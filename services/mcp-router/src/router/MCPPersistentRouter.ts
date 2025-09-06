import { spawn, ChildProcess } from 'child_process';
import { MCPService } from '../types';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';
// import { taskMCPRouter, MCPDirective } from '../config/task-mcp-routing';
type MCPDirective = any; // Temporary type
const taskMCPRouter = { 
  routeMCPCall: async (tool: string, directive: any) => ({ 
    allowed: true,
    reason: '',
    modifiedDirective: directive
  }) 
}; // Temporary mock

interface MCPProcess {
  process: ChildProcess;
  service: MCPService;
  lastUsed: number;
  buffer: string;
  pendingRequests: Map<string | number, (response: any) => void>;
}

export class MCPPersistentRouter {
  private config: Record<string, MCPService>;
  private processes: Map<string, MCPProcess> = new Map();
  private cleanupInterval: NodeJS.Timeout;
  private idleTimeout: number;

  constructor(config: Record<string, MCPService>) {
    this.config = config;
    this.idleTimeout = parseInt(process.env.PROCESS_IDLE_TIMEOUT || '60000');
    
    // Cleanup idle processes every 30 seconds
    this.cleanupInterval = setInterval(() => {
      this.cleanupIdleProcesses();
    }, 30000);
  }

  async executeMCP(serviceName: string, mcpRequest: any, envFromHeaders?: Record<string, string>): Promise<any> {
    const service = this.config[serviceName];
    if (!service) {
      return {
        jsonrpc: '2.0',
        id: mcpRequest.id,
        error: {
          code: -32601,
          message: `Unknown service: ${serviceName}`
        }
      };
    }

    logger.info(`Executing MCP ${serviceName}.${mcpRequest.method}`);
    
    // Task 도구의 MCP 호출 처리
    if (serviceName === 'taskmaster-ai' && mcpRequest.method === 'tools/call') {
      const toolName = mcpRequest.params?.name;
      const mcpDirective = mcpRequest.params?.arguments?.mcpDirective;
      
      if (mcpDirective && this.isTaskToolWithMCPSupport(toolName)) {
        return await this.handleTaskMCPCall(toolName, mcpDirective, mcpRequest);
      }
    }
    
    // Handle prompts/list for services that don't implement it
    if (mcpRequest.method === 'prompts/list') {
      logger.info(`Handling prompts/list for ${serviceName} - returning empty`);
      return {
        jsonrpc: '2.0',
        id: mcpRequest.id,
        result: {
          prompts: []
        }
      };
    }
    
    try {
      // Merge environment variables from headers if provided
      const mergedService = envFromHeaders ? {
        ...service,
        env: { ...service.env, ...envFromHeaders }
      } : service;
      
      const mcpProcess = await this.getOrCreateProcess(serviceName, mergedService);
      const response = await this.sendRequest(mcpProcess, mcpRequest);
      return response;
    } catch (error: any) {
      logger.error(`Error executing ${serviceName}:`, error);
      return {
        jsonrpc: '2.0',
        id: mcpRequest.id,
        error: {
          code: -32603,
          message: error.message || 'Internal error'
        }
      };
    }
  }

  private async getOrCreateProcess(serviceName: string, service: MCPService): Promise<MCPProcess> {
    let mcpProcess = this.processes.get(serviceName);
    
    if (!mcpProcess || mcpProcess.process.killed) {
      // Create new process
      const childProcess = spawn(service.command, service.args || [], {
        cwd: service.cwd,
        env: {
          PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
          LANG: 'C.UTF-8',
          LC_ALL: 'C.UTF-8',
          PYTHONIOENCODING: 'utf-8',
          HOME: process.env.HOME || '/root',
          USER: process.env.USER || 'root',
          ...service.env
        },
        stdio: ['pipe', 'pipe', 'pipe']
      });

      mcpProcess = {
        process: childProcess,
        service,
        lastUsed: Date.now(),
        buffer: '',
        pendingRequests: new Map()
      };

      // Set up event handlers
      childProcess.stdout?.on('data', (data) => {
        mcpProcess!.buffer += data.toString();
        this.processBuffer(mcpProcess!);
      });

      childProcess.stderr?.on('data', (data) => {
        logger.debug(`${serviceName} stderr:`, data.toString());
      });

      childProcess.on('error', (error) => {
        logger.error(`Process error for ${serviceName}:`, error);
        // Reject all pending requests
        for (const [id, resolve] of mcpProcess!.pendingRequests) {
          resolve({
            jsonrpc: '2.0',
            id,
            error: {
              code: -32603,
              message: error.message
            }
          });
        }
        mcpProcess!.pendingRequests.clear();
      });

      childProcess.on('exit', (code) => {
        logger.info(`${serviceName} process exited with code ${code}`);
        this.processes.delete(serviceName);
        // Reject all pending requests
        for (const [id, resolve] of mcpProcess!.pendingRequests) {
          resolve({
            jsonrpc: '2.0',
            id,
            error: {
              code: -32603,
              message: `Process exited with code ${code} without responding`
            }
          });
        }
      });

      this.processes.set(serviceName, mcpProcess);
      
      // Initialize the process
      try {
        const initRequest = {
          jsonrpc: '2.0',
          id: 'auto-init-' + Date.now(),
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            capabilities: {},
            clientInfo: {
              name: 'mcp-router',
              version: '1.0.0'
            }
          }
        };
        
        await this.sendRequest(mcpProcess, initRequest);
        logger.info(`Successfully initialized ${serviceName}`);
      } catch (error) {
        logger.warn(`Failed to initialize ${serviceName}:`, error);
      }
      
      // Wait for process to be ready after initialization
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    mcpProcess.lastUsed = Date.now();
    return mcpProcess;
  }

  private processBuffer(mcpProcess: MCPProcess) {
    const lines = mcpProcess.buffer.split('\n');
    mcpProcess.buffer = lines.pop() || ''; // Keep incomplete line in buffer

    for (const line of lines) {
      if (line.trim()) {
        try {
          const response = JSON.parse(line);
          logger.info(`Received response with ID: ${response.id}, pending IDs: ${Array.from(mcpProcess.pendingRequests.keys())}`);
          if (response.id !== undefined && mcpProcess.pendingRequests.has(response.id)) {
            const resolve = mcpProcess.pendingRequests.get(response.id);
            mcpProcess.pendingRequests.delete(response.id);
            resolve!(response);
          } else {
            logger.info(`Response ID ${response.id} not found in pending requests`);
          }
        } catch (e) {
          logger.debug('Failed to parse line as JSON:', line);
        }
      }
    }
  }

  private async sendRequest(mcpProcess: MCPProcess, request: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        mcpProcess.pendingRequests.delete(request.id);
        reject(new Error('Request timeout'));
      }, parseInt(process.env.REQUEST_TIMEOUT || '120000'));

      logger.info(`Sending request with ID: ${request.id}, method: ${request.method}`);
      mcpProcess.pendingRequests.set(request.id, (response) => {
        clearTimeout(timeout);
        resolve(response);
      });

      const requestStr = JSON.stringify(request) + '\n';
      mcpProcess.process.stdin?.write(requestStr);
    });
  }

  private cleanupIdleProcesses() {
    const now = Date.now();
    for (const [serviceName, mcpProcess] of this.processes) {
      if (now - mcpProcess.lastUsed > this.idleTimeout) {
        logger.info(`Cleaning up idle process: ${serviceName}`);
        mcpProcess.process.kill('SIGTERM');
        this.processes.delete(serviceName);
      }
    }
  }

  private isTaskToolWithMCPSupport(toolName: string): boolean {
    const supportedTools = [
      'parse_prd', 'expand_task', 'analyze_project_complexity',
      'generate_files', 'next_task', 'update_task'
    ];
    return supportedTools.includes(toolName);
  }
  
  private async handleTaskMCPCall(
    taskTool: string,
    directive: MCPDirective,
    originalRequest: any
  ): Promise<any> {
    try {
      // Task MCP 라우터를 통해 호출 검증
      const routingResult = await taskMCPRouter.routeMCPCall(taskTool, directive);
      
      if (!routingResult.allowed) {
        return {
          jsonrpc: '2.0',
          id: originalRequest.id,
          error: {
            code: -32602,
            message: `MCP call not allowed: ${routingResult.reason}`
          }
        };
      }
      
      // 대상 MCP 서비스로 요청 전달
      const targetRequest = {
        jsonrpc: '2.0',
        id: uuidv4(),
        method: directive.method,
        params: directive.params
      };
      
      // 메타데이터 추가
      if (routingResult.modifiedDirective?.metadata) {
        targetRequest.params = {
          ...targetRequest.params,
          _metadata: routingResult.modifiedDirective.metadata
        };
      }
      
      // 대상 서비스 호출
      const response = await this.executeMCP(
        directive.targetService,
        targetRequest
      );
      
      // Task 도구에 응답 반환
      return {
        jsonrpc: '2.0',
        id: originalRequest.id,
        result: {
          mcpResponse: response,
          routing: {
            tool: taskTool,
            targetService: directive.targetService,
            method: directive.method,
            timestamp: new Date().toISOString()
          }
        }
      };
    } catch (error: any) {
      logger.error(`Error in Task MCP routing:`, error);
      return {
        jsonrpc: '2.0',
        id: originalRequest.id,
        error: {
          code: -32603,
          message: `Task MCP routing error: ${error.message}`
        }
      };
    }
  }

  async shutdown() {
    clearInterval(this.cleanupInterval);
    for (const [serviceName, mcpProcess] of this.processes) {
      logger.info(`Shutting down process: ${serviceName}`);
      mcpProcess.process.kill('SIGTERM');
    }
    this.processes.clear();
  }
}