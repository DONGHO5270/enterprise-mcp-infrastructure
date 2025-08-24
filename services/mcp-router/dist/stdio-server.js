#!/usr/bin/env node
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
Object.defineProperty(exports, "__esModule", { value: true });
// Stdio server for MCP router - provides direct stdio interface for Claude Desktop
const MCPRouter_1 = require("./router/MCPRouter");
const config_1 = require("./config");
const logger_1 = require("./utils/logger");
const readline = __importStar(require("readline"));
// Disable HTTP logging for stdio mode
logger_1.logger.level = 'error';
async function main() {
    const serviceName = process.argv[2];
    if (!serviceName) {
        console.error('Usage: stdio-server <service-name>');
        process.exit(1);
    }
    if (!config_1.config.MCP_SERVICES[serviceName]) {
        console.error(`Unknown service: ${serviceName}`);
        console.error(`Available services: ${Object.keys(config_1.config.MCP_SERVICES).join(', ')}`);
        process.exit(1);
    }
    // Initialize router
    const router = new MCPRouter_1.MCPRouter(config_1.config);
    // Create readline interface for stdin/stdout
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    // Handle incoming JSON-RPC requests
    rl.on('line', async (line) => {
        try {
            const request = JSON.parse(line.trim());
            let response = {
                jsonrpc: '2.0',
                id: request.id
            };
            try {
                // Handle different methods
                if (request.method === 'initialize') {
                    response.result = {
                        protocolVersion: '2024-11-05',
                        capabilities: {
                            tools: {},
                            resources: {},
                            prompts: {}
                        },
                        serverInfo: {
                            name: `mcp-router-${serviceName}`,
                            version: '1.0.0'
                        }
                    };
                }
                else if (request.method === 'notifications/initialized') {
                    // No response needed for notifications
                    return;
                }
                else {
                    // Forward to MCP service
                    const result = await router.execute(serviceName, request.method, request.params || {});
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
                    message: error.message || 'Internal error'
                };
            }
            // Send response
            console.log(JSON.stringify(response));
        }
        catch (error) {
            // Parse error
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
        process.exit(0);
    });
    process.on('SIGTERM', () => {
        process.exit(0);
    });
}
main().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
});
//# sourceMappingURL=stdio-server.js.map