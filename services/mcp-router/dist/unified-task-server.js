#!/usr/bin/env node
"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const MCPRouter_1 = require("./router/MCPRouter");
const config_1 = require("./config");
const logger_1 = require("./utils/logger");
const readline = __importStar(require("readline"));
// Disable HTTP logging for stdio mode
logger_1.logger.level = 'error';
class UnifiedTaskServer {
    router;
    availableServices;
    toolsCache = new Map();
    constructor() {
        this.router = new MCPRouter_1.MCPRouter(config_1.config);
        this.availableServices = new Set(Object.keys(config_1.config.MCP_SERVICES));
        // Parse command line arguments
        const args = process.argv.slice(2);
        const servicesArg = args.find(arg => arg.startsWith('--services='));
        if (servicesArg) {
            const services = servicesArg.split('=')[1].split(',');
            this.availableServices = new Set(services.filter(s => config_1.config.MCP_SERVICES[s]));
        }
        logger_1.logger.info(`Unified Task Server initialized with ${this.availableServices.size} services`);
    }
    /**
     * Parse Task() format calls
     * Supports:
     * - Task("service.method", params)
     * - Task("method", { service: "name", params })
     * - Direct method calls with service in params
     */
    async parseTaskCall(method, params) {
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
    async findServiceByTool(toolName) {
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
                const result = await this.router.execute(service, 'tools/list', {});
                this.toolsCache.set(service, result.tools || []);
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
                    const result = await this.router.execute(service, method, params);
                    if (result.error) {
                        response.error = result.error;
                    }
                    else {
                        response.result = result.result || result;
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
        // Pre-cache all tools
        const toolsPromises = Array.from(this.availableServices).map(service => this.getServiceTools(service));
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
    async handleToolsList() {
        const allTools = [];
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
            }
            catch (error) {
                logger_1.logger.error(`Failed to get tools from ${service}:`, error);
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
//# sourceMappingURL=unified-task-server.js.map