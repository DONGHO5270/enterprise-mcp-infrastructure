// Task 도구에서 MCP 서비스를 호출하기 위한 TypeScript 헬퍼 모듈
import fetch from 'node-fetch';
import * as fs from 'fs';

interface TaskMCPClientOptions {
  routerUrl?: string;
  timeout?: number;
  retryCount?: number;
  retryDelay?: number;
}

interface MCPRequest {
  jsonrpc: '2.0';
  id: string;
  method: string;
  params?: any;
}

interface MCPResponse {
  jsonrpc: '2.0';
  id: string;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

interface MCPTool {
  name: string;
  description?: string;
  inputSchema?: any;
}

interface MCPResource {
  name: string;
  uri: string;
  description?: string;
  mimeType?: string;
}

interface BatchCall {
  service: string;
  method: string;
  params?: any;
}

export class TaskMCPClient {
  private routerUrl: string;
  private timeout: number;
  private retryCount: number;
  private retryDelay: number;

  constructor(options: TaskMCPClientOptions = {}) {
    // Docker 내부에서 실행 중인지 감지
    const isDocker = process.env.DOCKER_ENV === 'true' || 
                     process.env.HOSTNAME?.includes('docker') ||
                     fs.existsSync('/.dockerenv');
    
    this.routerUrl = options.routerUrl || 
                     process.env.MCP_ROUTER_INTERNAL_URL ||
                     (isDocker ? 'http://mcp-router:3000' : 'http://localhost:3100');
    
    this.timeout = options.timeout || 60000;
    this.retryCount = options.retryCount || 3;
    this.retryDelay = options.retryDelay || 1000;
  }

  /**
   * MCP 서비스를 호출합니다.
   */
  async call<T = any>(serviceName: string, method: string, params: any = {}): Promise<T> {
    const requestId = `${serviceName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const payload: MCPRequest = {
      jsonrpc: '2.0',
      id: requestId,
      method: method,
      params: params
    };

    let lastError: Error | undefined;
    
    for (let attempt = 0; attempt < this.retryCount; attempt++) {
      try {
        const response = await this._makeRequest(serviceName, payload);
        
        if (response.error) {
          throw new Error(`MCP Error: ${response.error.message || JSON.stringify(response.error)}`);
        }
        
        return response.result as T;
      } catch (error) {
        lastError = error as Error;
        console.error(`Attempt ${attempt + 1} failed for ${serviceName}:`, lastError.message);
        
        if (attempt < this.retryCount - 1) {
          await this._delay(this.retryDelay * Math.pow(2, attempt)); // Exponential backoff
        }
      }
    }
    
    throw lastError!;
  }

  /**
   * MCP 도구를 호출합니다.
   */
  async callTool<T = any>(serviceName: string, toolName: string, args: any = {}): Promise<T> {
    return this.call<T>(serviceName, 'tools/call', {
      name: toolName,
      arguments: args
    });
  }

  /**
   * MCP 서비스의 도구 목록을 가져옵니다.
   */
  async listTools(serviceName: string): Promise<MCPTool[]> {
    const result = await this.call<{ tools: MCPTool[] }>(serviceName, 'tools/list', {});
    return result.tools || [];
  }

  /**
   * MCP 서비스의 리소스 목록을 가져옵니다.
   */
  async listResources(serviceName: string): Promise<MCPResource[]> {
    const result = await this.call<{ resources: MCPResource[] }>(serviceName, 'resources/list', {});
    return result.resources || [];
  }

  /**
   * 여러 MCP 서비스를 병렬로 호출합니다.
   */
  async batchCall(calls: BatchCall[]): Promise<Array<any | { error: string }>> {
    return Promise.all(
      calls.map(({ service, method, params }) => 
        this.call(service, method, params).catch(error => ({ error: error.message }))
      )
    );
  }

  private async _makeRequest(serviceName: string, payload: MCPRequest): Promise<MCPResponse> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeout);
    
    try {
      const response = await fetch(`${this.routerUrl}/mcp/${serviceName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal as any
      });
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json() as MCPResponse;
    } finally {
      clearTimeout(timeout);
    }
  }

  private _delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 싱글톤 인스턴스
export const defaultClient = new TaskMCPClient();

// 간편 함수들
export const callMCP = defaultClient.call.bind(defaultClient);
export const callTool = defaultClient.callTool.bind(defaultClient);
export const listTools = defaultClient.listTools.bind(defaultClient);
export const listResources = defaultClient.listResources.bind(defaultClient);
export const batchCall = defaultClient.batchCall.bind(defaultClient);

// 기본 export
export default TaskMCPClient;