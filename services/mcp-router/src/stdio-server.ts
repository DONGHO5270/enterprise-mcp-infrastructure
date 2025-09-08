#!/usr/bin/env node

// Stdio server for MCP router - provides direct stdio interface for Claude Desktop
import { MCPRouter } from './router/MCPRouter';
import { config } from './config';
import { logger } from './utils/logger';
import * as readline from 'readline';

// Disable HTTP logging for stdio mode
logger.level = 'error';

// JSON-RPC interfaces
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

async function main() {
  const serviceName = process.argv[2];
  
  if (!serviceName) {
    console.error('Usage: stdio-server <service-name>');
    process.exit(1);
  }

  if (!config.MCP_SERVICES[serviceName]) {
    console.error(`Unknown service: ${serviceName}`);
    console.error(`Available services: ${Object.keys(config.MCP_SERVICES).join(', ')}`);
    process.exit(1);
  }

  // Initialize router
  const router = new MCPRouter(config);

  // Create readline interface for stdin/stdout
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  // Handle incoming JSON-RPC requests
  rl.on('line', async (line) => {
    try {
      const request: JSONRPCRequest = JSON.parse(line.trim());
      
      let response: JSONRPCResponse = {
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
        } else if (request.method === 'notifications/initialized') {
          // No response needed for notifications
          return;
        } else {
          // Forward to MCP service
          const result = await router.execute(serviceName, request.method, request.params || {});
          if (result.error) {
            response.error = result.error;
          } else {
            response.result = result.result || result;
          }
        }
      } catch (error: any) {
        response.error = {
          code: -32603,
          message: error.message || 'Internal error'
        };
      }

      // Send response
      console.log(JSON.stringify(response));
      
    } catch (error) {
      // Parse error
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