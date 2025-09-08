// Task 도구에서 MCP 서비스를 호출하기 위한 헬퍼 모듈
const fetch = require('node-fetch');

class TaskMCPClient {
  constructor(options = {}) {
    // Docker 내부에서 실행 중인지 감지
    const isDocker = process.env.DOCKER_ENV === 'true' || 
                     process.env.HOSTNAME?.includes('docker') ||
                     require('fs').existsSync('/.dockerenv');
    
    this.routerUrl = options.routerUrl || 
                     process.env.MCP_ROUTER_INTERNAL_URL ||
                     (isDocker ? 'http://mcp-router:3000' : 'http://localhost:3100');
    
    this.timeout = options.timeout || 60000;
    this.retryCount = options.retryCount || 3;
    this.retryDelay = options.retryDelay || 1000;
  }

  /**
   * MCP 서비스를 호출합니다.
   * @param {string} serviceName - MCP 서비스 이름
   * @param {string} method - JSON-RPC 메소드
   * @param {object} params - 메소드 파라미터
   * @returns {Promise<any>} - 응답 결과
   */
  async call(serviceName, method, params = {}) {
    const requestId = `${serviceName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const payload = {
      jsonrpc: '2.0',
      id: requestId,
      method: method,
      params: params
    };

    let lastError;
    for (let attempt = 0; attempt < this.retryCount; attempt++) {
      try {
        const response = await this._makeRequest(serviceName, payload);
        
        if (response.error) {
          throw new Error(`MCP Error: ${response.error.message || JSON.stringify(response.error)}`);
        }
        
        return response.result;
      } catch (error) {
        lastError = error;
        console.error(`Attempt ${attempt + 1} failed for ${serviceName}:`, error.message);
        
        if (attempt < this.retryCount - 1) {
          await this._delay(this.retryDelay * Math.pow(2, attempt)); // Exponential backoff
        }
      }
    }
    
    throw lastError;
  }

  /**
   * MCP 도구를 호출합니다.
   * @param {string} serviceName - MCP 서비스 이름
   * @param {string} toolName - 도구 이름
   * @param {object} args - 도구 인자
   * @returns {Promise<any>} - 도구 실행 결과
   */
  async callTool(serviceName, toolName, args = {}) {
    return this.call(serviceName, 'tools/call', {
      name: toolName,
      arguments: args
    });
  }

  /**
   * MCP 서비스의 도구 목록을 가져옵니다.
   * @param {string} serviceName - MCP 서비스 이름
   * @returns {Promise<Array>} - 도구 목록
   */
  async listTools(serviceName) {
    const result = await this.call(serviceName, 'tools/list', {});
    return result.tools || [];
  }

  /**
   * MCP 서비스의 리소스 목록을 가져옵니다.
   * @param {string} serviceName - MCP 서비스 이름
   * @returns {Promise<Array>} - 리소스 목록
   */
  async listResources(serviceName) {
    const result = await this.call(serviceName, 'resources/list', {});
    return result.resources || [];
  }

  /**
   * 여러 MCP 서비스를 병렬로 호출합니다.
   * @param {Array<{service: string, method: string, params: object}>} calls - 호출 목록
   * @returns {Promise<Array>} - 응답 결과 배열
   */
  async batchCall(calls) {
    return Promise.all(
      calls.map(({ service, method, params }) => 
        this.call(service, method, params).catch(error => ({ error: error.message }))
      )
    );
  }

  async _makeRequest(serviceName, payload) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeout);
    
    try {
      const response = await fetch(`${this.routerUrl}/mcp/${serviceName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } finally {
      clearTimeout(timeout);
    }
  }

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 싱글톤 인스턴스
const defaultClient = new TaskMCPClient();

// ES6 스타일 exports
module.exports = TaskMCPClient;
module.exports.default = TaskMCPClient;
module.exports.defaultClient = defaultClient;

// 간편 함수들
module.exports.callMCP = defaultClient.call.bind(defaultClient);
module.exports.callTool = defaultClient.callTool.bind(defaultClient);
module.exports.listTools = defaultClient.listTools.bind(defaultClient);
module.exports.listResources = defaultClient.listResources.bind(defaultClient);
module.exports.batchCall = defaultClient.batchCall.bind(defaultClient);