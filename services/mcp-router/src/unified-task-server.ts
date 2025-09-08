#!/usr/bin/env node

/**
 * Unified Task Server for Hybrid MCP Implementation
 * 
 * This server provides a single entry point for all MCP services,
 * supporting both HTTP API and Direct MCP Protocol (stdio).
 * 
 * Usage:
 * - Direct: node unified-task-server.js
 * - With service filter: node unified-task-server.js --services npm-sentinel,mermaid
 */

import { MCPRouter } from './router/MCPRouter';
import { config } from './config';
import { logger } from './utils/logger';
import * as readline from 'readline';

// Disable HTTP logging for stdio mode
logger.level = 'error';

interface JSONRPCRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: any;
}

interface JSONRPCResponse {
  jsonrpc: '2.0';
  id: string | number;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

interface TaskParams {
  service?: string;
  method?: string;
  params?: any;
  // Legacy support
  tool?: string;
  arguments?: any;
}

class UnifiedTaskServer {
  private router: MCPRouter;
  private availableServices: Set<string>;
  private toolsCache: Map<string, any[]> = new Map();

  constructor() {
    this.router = new MCPRouter(config);
    this.availableServices = new Set(Object.keys(config.MCP_SERVICES));
    
    // Parse command line arguments
    const args = process.argv.slice(2);
    const servicesArg = args.find(arg => arg.startsWith('--services='));
    
    if (servicesArg) {
      const services = servicesArg.split('=')[1].split(',');
      this.availableServices = new Set(services.filter(s => 
        config.MCP_SERVICES[s]
      ));
    }
    
    logger.info(`Unified Task Server initialized with ${this.availableServices.size} services`);
  }

  /**
   * Parse Task() format calls
   * Supports:
   * - Task("service.method", params)
   * - Task("method", { service: "name", params })
   * - Direct method calls with service in params
   */
  private async parseTaskCall(method: string, params: any): Promise<{ service: string; method: string; params: any }> {
    // Case 1: service.method format
    if (method.includes('.')) {
      const [service, actualMethod] = method.split('.', 2);
      return { service, method: actualMethod, params };
    }
    
    // Case 2: service in params
    if (params?.service) {
      const { service, ...actualParams } = params;
      return { service, method, params: actualParams.params || actualParams };
    }
    
    // Case 3: tool/arguments format (legacy)
    if (params?.tool) {
      // Extract service from tool name
      const toolParts = params.tool.split('_');
      const service = await this.findServiceByTool(params.tool);
      
      if (service) {
        return { 
          service, 
          method: 'tools/call',
          params: {
            name: params.tool,
            arguments: params.arguments || {}
          }
        };
      }
    }
    
    // Case 4: Try to infer service from method
    const service = this.inferServiceFromMethod(method);
    if (service) {
      return { service, method, params };
    }
    
    throw new Error(`Cannot determine service for method: ${method}`);
  }

  /**
   * Find service that provides a specific tool
   */
  private async findServiceByTool(toolName: string): Promise<string | null> {
    for (const service of this.availableServices) {
      try {
        const tools = await this.getServiceTools(service);
        if (tools.some(tool => tool.name === toolName)) {
          return service;
        }
      } catch (e) {
        // Continue searching
      }
    }
    return null;
  }

  /**
   * Get cached tools for a service
   */
  private async getServiceTools(service: string): Promise<any[]> {
    if (!this.toolsCache.has(service)) {
      try {
        const result = await this.router.execute(service, 'tools/list', {});
        this.toolsCache.set(service, result.tools || []);
      } catch (e) {
        this.toolsCache.set(service, []);
      }
    }
    return this.toolsCache.get(service) || [];
  }

  /**
   * Try to infer service from method name patterns
   */
  private inferServiceFromMethod(method: string): string | null {
    // Common patterns
    const patterns = [
      { pattern: /npm|package/i, service: 'npm-sentinel' },
      { pattern: /mermaid|diagram/i, service: 'mermaid' },
      { pattern: /think|analyze/i, service: 'clear-thought' },
      { pattern: /stochastic|probability/i, service: 'stochastic-thinking' },
      { pattern: /docker|container/i, service: 'docker' },
      { pattern: /github|git|repo/i, service: 'github' },
      { pattern: /playwright|browser/i, service: 'playwright' },
      { pattern: /supabase|database/i, service: 'supabase' }
    ];
    
    for (const { pattern, service } of patterns) {
      if (pattern.test(method) && this.availableServices.has(service)) {
        return service;
      }
    }
    
    return null;
  }

  /**
   * Handle JSON-RPC request
   */
  async handleRequest(request: JSONRPCRequest): Promise<JSONRPCResponse> {
    const response: JSONRPCResponse = {
      jsonrpc: '2.0',
      id: request.id
    };

    try {
      switch (request.method) {
        case 'initialize':
          response.result = await this.handleInitialize();
          break;
          
        case 'tools/list':
          response.result = await this.handleToolsList();
          break;
          
        case 'notifications/initialized':
          // No response needed for notifications
          return null as any;
          
        default:
          // Parse and route Task calls
          const { service, method, params } = await this.parseTaskCall(
            request.method, 
            request.params
          );
          
          const result = await this.router.execute(service, method, params);
          
          if (result.error) {
            response.error = result.error;
          } else {
            response.result = result.result || result;
          }
      }
    } catch (error: any) {
      response.error = {
        code: -32603,
        message: error.message || 'Internal error',
        data: error.stack
      };
    }

    return response;
  }

  /**
   * Handle initialize request
   */
  private async handleInitialize() {
    // Pre-cache all tools
    const toolsPromises = Array.from(this.availableServices).map(service =>
      this.getServiceTools(service)
    );
    await Promise.all(toolsPromises);

    return {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {},
        resources: {},
        prompts: {}
      },
      serverInfo: {
        name: 'unified-mcp-task-server',
        version: '1.0.0',
        description: `Unified access to ${this.availableServices.size} MCP services`
      }
    };
  }

  /**
   * Handle tools/list request - aggregate from all services
   */
  private async handleToolsList() {
    const allTools: any[] = [];
    
    for (const service of this.availableServices) {
      try {
        const tools = await this.getServiceTools(service);
        
        // Add service prefix to tool names for clarity
        const prefixedTools = tools.map(tool => ({
          ...tool,
          name: `${service}.${tool.name}`,
          description: `[${service}] ${tool.description || ''}`
        }));
        
        allTools.push(...prefixedTools);
      } catch (error) {
        logger.error(`Failed to get tools from ${service}:`, error);
      }
    }

    return { tools: allTools };
  }

  /**
   * Start the stdio server
   */
  start() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });

    rl.on('line', async (line) => {
      try {
        const request: JSONRPCRequest = JSON.parse(line.trim());
        const response = await this.handleRequest(request);
        
        if (response) {
          console.log(JSON.stringify(response));
        }
      } catch (error) {
        const errorResponse: JSONRPCResponse = {
          jsonrpc: '2.0',
          id: null as any,
          error: {
            code: -32700,
            message: 'Parse error'
          }
        };
        console.log(JSON.stringify(errorResponse));
      }
    });

    // Handle shutdown
    process.on('SIGINT', () => {
      this.router.shutdown().then(() => {
        process.exit(0);
      });
    });

    process.on('SIGTERM', () => {
      this.router.shutdown().then(() => {
        process.exit(0);
      });
    });
  }
}

// Start server
const server = new UnifiedTaskServer();
server.start();