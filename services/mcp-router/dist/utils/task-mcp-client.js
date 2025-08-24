"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchCall = exports.listResources = exports.listTools = exports.callTool = exports.callMCP = exports.defaultClient = exports.TaskMCPClient = void 0;
// Task 도구에서 MCP 서비스를 호출하기 위한 TypeScript 헬퍼 모듈
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs = __importStar(require("fs"));
class TaskMCPClient {
    routerUrl;
    timeout;
    retryCount;
    retryDelay;
    constructor(options = {}) {
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
            }
            catch (error) {
                lastError = error;
                console.error(`Attempt ${attempt + 1} failed for ${serviceName}:`, lastError.message);
                if (attempt < this.retryCount - 1) {
                    await this._delay(this.retryDelay * Math.pow(2, attempt)); // Exponential backoff
                }
            }
        }
        throw lastError;
    }
    /**
     * MCP 도구를 호출합니다.
     */
    async callTool(serviceName, toolName, args = {}) {
        return this.call(serviceName, 'tools/call', {
            name: toolName,
            arguments: args
        });
    }
    /**
     * MCP 서비스의 도구 목록을 가져옵니다.
     */
    async listTools(serviceName) {
        const result = await this.call(serviceName, 'tools/list', {});
        return result.tools || [];
    }
    /**
     * MCP 서비스의 리소스 목록을 가져옵니다.
     */
    async listResources(serviceName) {
        const result = await this.call(serviceName, 'resources/list', {});
        return result.resources || [];
    }
    /**
     * 여러 MCP 서비스를 병렬로 호출합니다.
     */
    async batchCall(calls) {
        return Promise.all(calls.map(({ service, method, params }) => this.call(service, method, params).catch(error => ({ error: error.message }))));
    }
    async _makeRequest(serviceName, payload) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.timeout);
        try {
            const response = await (0, node_fetch_1.default)(`${this.routerUrl}/mcp/${serviceName}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: controller.signal
            });
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        }
        finally {
            clearTimeout(timeout);
        }
    }
    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.TaskMCPClient = TaskMCPClient;
// 싱글톤 인스턴스
exports.defaultClient = new TaskMCPClient();
// 간편 함수들
exports.callMCP = exports.defaultClient.call.bind(exports.defaultClient);
exports.callTool = exports.defaultClient.callTool.bind(exports.defaultClient);
exports.listTools = exports.defaultClient.listTools.bind(exports.defaultClient);
exports.listResources = exports.defaultClient.listResources.bind(exports.defaultClient);
exports.batchCall = exports.defaultClient.batchCall.bind(exports.defaultClient);
// 기본 export
exports.default = TaskMCPClient;
//# sourceMappingURL=task-mcp-client.js.map