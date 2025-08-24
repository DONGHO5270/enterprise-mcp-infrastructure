#!/usr/bin/env node
"use strict";
/**
 * Unified Task Server for Hybrid MCP Implementation (HTTP Backend)
 *
 * This server provides a single entry point for all MCP services,
 * supporting Direct MCP Protocol (stdio) interface while using HTTP API backend.
 *
 * Usage:
 * - Direct: node unified-task-server-http.js
 * - With service filter: node unified-task-server-http.js --services npm-sentinel,mermaid
 */
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
const readline = __importStar(require("readline"));
const axios_1 = __importDefault(require("axios"));
// Disable console logging for stdio mode
console.error = () => { };
class UnifiedTaskServerHTTP {
    baseUrl;
    availableServices;
    toolsCache = new Map();
    constructor() {
        // Use Docker router endpoint
        this.baseUrl = process.env.MCP_ROUTER_URL || 'http://localhost:3100';
        // Default services
        const defaultServices = [
            'npm-sentinel', 'mermaid', 'clear-thought', 'stochastic-thinking',
            'node-omnibus', 'code-context-provider', 'desktop-commander', 'context7',
            'nodejs-debugger', 'serper-search', 'vercel', '21stdev-magic',
            'mem0', 'taskmaster-ai', 'code-runner', 'docker',
            'github', 'code-checker', 'supabase', 'serena',
            'playwright', 'sequential-thinking-tools'
        ];
        this.availableServices = new Set(defaultServices);
        // Parse command line arguments
        const args = process.argv.slice(2);
        const servicesArg = args.find(arg => arg.startsWith('--services='));
        if (servicesArg) {
            const services = servicesArg.split('=')[1].split(',');
            this.availableServices = new Set(services);
        }
    }
    /**
     * Call MCP service via HTTP
     */
    async callMCPService(service, method, params) {
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/mcp/${service}`, {
                jsonrpc: '2.0',
                id: Date.now(),
                method,
                params
            }, {
                headers: { 'Content-Type': 'application/json' },
                timeout: 30000
            });
            return response.data;
        }
        catch (error) {
            if (error.response?.data) {
                return error.response.data;
            }
            throw error;
        }
    }
    /**
     * Parse Task() format calls
     */
    async parseTaskCall(method, params) {
        // Case 1: service.method format
        if (method.includes('.')) {
            const [service, actualMethod] = method.split('.', 2);
            if (this.availableServices.has(service)) {
                return { service, method: actualMethod, params };
            }
        }
        // Case 2: service in params
        if (params?.service && this.availableServices.has(params.service)) {
            const { service, ...actualParams } = params;
            return { service, method, params: actualParams.params || actualParams };
        }
        // Case 3: tool/arguments format (legacy)
        if (params?.tool) {
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
    async findServiceByTool(toolName) {
        // First, check if tool name includes service prefix
        for (const service of this.availableServices) {
            if (toolName.startsWith(`${service}.`) || toolName.startsWith(`${service}_`)) {
                return service;
            }
        }
        // Then, search through all services
        for (const service of this.availableServices) {
            try {
                const tools = await this.getServiceTools(service);
                if (tools.some(tool => tool.name === toolName)) {
                    return service;
                }
            }
            catch (e) {
                // Continue searching
            }
        }
        return null;
    }
    /**
     * Get cached tools for a service
     */
    async getServiceTools(service) {
        if (!this.toolsCache.has(service)) {
            try {
                const response = await this.callMCPService(service, 'tools/list', {});
                if (response.result?.tools) {
                    this.toolsCache.set(service, response.result.tools);
                }
                else {
                    this.toolsCache.set(service, []);
                }
            }
            catch (e) {
                this.toolsCache.set(service, []);
            }
        }
        return this.toolsCache.get(service) || [];
    }
    /**
     * Try to infer service from method name patterns
     */
    inferServiceFromMethod(method) {
        const patterns = [
            { pattern: /npm|package/i, service: 'npm-sentinel' },
            { pattern: /mermaid|diagram/i, service: 'mermaid' },
            { pattern: /think|analyze/i, service: 'clear-thought' },
            { pattern: /stochastic|probability/i, service: 'stochastic-thinking' },
            { pattern: /docker|container/i, service: 'docker' },
            { pattern: /github|git|repo/i, service: 'github' },
            { pattern: /playwright|browser/i, service: 'playwright' },
            { pattern: /supabase|database/i, service: 'supabase' },
            { pattern: /sequential|thinking/i, service: 'sequential-thinking-tools' }
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
    async handleRequest(request) {
        const response = {
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
                    return null;
                default:
                    // Parse and route Task calls
                    const { service, method, params } = await this.parseTaskCall(request.method, request.params);
                    // Call service via HTTP
                    const serviceResponse = await this.callMCPService(service, method, params);
                    if (serviceResponse.error) {
                        response.error = serviceResponse.error;
                    }
                    else {
                        response.result = serviceResponse.result;
                    }
            }
        }
        catch (error) {
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
    async handleInitialize() {
        // Pre-cache tools from frequently used services
        const corServices = ['npm-sentinel', 'clear-thought', 'docker', 'github'];
        const toolsPromises = corServices.map(service => this.getServiceTools(service).catch(() => []));
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
                description: `Unified access to ${this.availableServices.size} MCP services via HTTP backend`
            }
        };
    }
    /**
     * Handle tools/list request - aggregate from all services
     */
    async handleToolsList() {
        const allTools = [];
        const errors = [];
        // Batch requests for better performance
        const serviceList = Array.from(this.availableServices);
        const batchSize = 5;
        for (let i = 0; i < serviceList.length; i += batchSize) {
            const batch = serviceList.slice(i, i + batchSize);
            const batchPromises = batch.map(async (service) => {
                try {
                    const tools = await this.getServiceTools(service);
                    // Add service prefix to tool names for clarity
                    const prefixedTools = tools.map(tool => ({
                        ...tool,
                        name: tool.name.includes('.') ? tool.name : `${service}.${tool.name}`,
                        description: `[${service}] ${tool.description || ''}`
                    }));
                    return prefixedTools;
                }
                catch (error) {
                    errors.push(`${service}: ${error.message}`);
                    return [];
                }
            });
            const batchResults = await Promise.all(batchPromises);
            batchResults.forEach(tools => allTools.push(...tools));
        }
        // Log any errors to stderr (won't interfere with stdio)
        if (errors.length > 0) {
            process.stderr.write(`Tool loading errors: ${errors.join(', ')}\n`);
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
                const request = JSON.parse(line.trim());
                const response = await this.handleRequest(request);
                if (response) {
                    console.log(JSON.stringify(response));
                }
            }
            catch (error) {
                const errorResponse = {
                    jsonrpc: '2.0',
                    id: null,
                    error: {
                        code: -32700,
                        message: 'Parse error'
                    }
                };
                console.log(JSON.stringify(errorResponse));
            }
        });
        // Handle shutdown gracefully
        process.on('SIGINT', () => {
            process.exit(0);
        });
        process.on('SIGTERM', () => {
            process.exit(0);
        });
    }
}
// Start server
const server = new UnifiedTaskServerHTTP();
server.start();
//# sourceMappingURL=unified-task-server-http.js.map