#!/usr/bin/env node

/**
 * MCP Bridge to Router for AI Tools (Task Tool Integration)
 * 
 * This bridge enables Claude Code sessions to access MCP services
 * through the centralized MCP Router at port 3100.
 * 
 * It translates stdio-based MCP protocol to HTTP calls to the router
 * and provides special handling for the Task tool.
 */

const readline = require('readline');
const http = require('http');
const { spawn } = require('child_process');

// Configuration from environment or defaults
const MCP_ROUTER_URL = process.env.MCP_ROUTER_URL || 'http://localhost:3100';
const PROJECT_NAME = process.env.PROJECT_NAME || 'KFoodTimerMobile';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const ENABLE_AI_FEATURES = process.env.ENABLE_AI_FEATURES === 'true';

// Parse router URL
const routerUrl = new URL(MCP_ROUTER_URL);
const ROUTER_HOST = routerUrl.hostname;
const ROUTER_PORT = routerUrl.port || 80;

// Logging utility
const log = (level, message, data = null) => {
  if (LOG_LEVEL === 'debug' || (LOG_LEVEL === 'info' && level !== 'debug')) {
    const timestamp = new Date().toISOString();
    const logMessage = {
      timestamp,
      level,
      project: PROJECT_NAME,
      message,
      ...(data && { data })
    };
    console.error(`[BRIDGE] ${JSON.stringify(logMessage)}`);
  }
};

// Initialize readline for stdio communication
// output을 null로 설정하여 stdout 충돌 방지
const rl = readline.createInterface({
  input: process.stdin,
  output: null,  // stdout 직접 제어를 위해 null 설정
  terminal: false
});

// Request ID counter
let requestIdCounter = 1;

// Active requests map
const activeRequests = new Map();

/**
 * Send JSON-RPC response to stdout
 * 수정: process.stdout.write 사용으로 버퍼링 문제 해결
 */
function sendResponse(response) {
  const responseStr = JSON.stringify(response);
  // response.method는 없음, 올바른 구조로 로그 수정
  log('debug', 'Sending response', { id: response.id, result: response.result ? 'present' : 'absent' });
  // console.log 대신 process.stdout.write 사용 (즉시 출력 보장)
  process.stdout.write(responseStr + '\n');
}

/**
 * Send JSON-RPC error response
 */
function sendError(id, code, message, data = null) {
  const error = {
    jsonrpc: '2.0',
    id,
    error: {
      code,
      message,
      ...(data && { data })
    }
  };
  sendResponse(error);
}

/**
 * Make HTTP request to MCP Router
 */
function callRouter(serviceName, method, params) {
  return new Promise((resolve, reject) => {
    const path = `/mcp/${serviceName}`;
    const requestData = JSON.stringify({
      jsonrpc: '2.0',
      id: requestIdCounter++,
      method,
      params
    });

    const options = {
      hostname: ROUTER_HOST,
      port: ROUTER_PORT,
      path,
      method: 'POST',
      timeout: 30000,  // 30초 타임아웃 추가
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestData),
        'X-Project-Name': PROJECT_NAME,
        'X-Bridge-Version': '1.0.0'
      }
    };

    log('debug', `Calling router: ${serviceName}/${method}`, { params });

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.error) {
            reject(new Error(response.error.message || 'Router error'));
          } else {
            resolve(response.result);
          }
        } catch (e) {
          reject(new Error(`Invalid response from router: ${e.message}`));
        }
      });
    });

    req.on('error', (error) => {
      log('error', `Router request failed: ${error.message}`);
      reject(error);
    });

    // 타임아웃 핸들러 추가
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request timeout after 30 seconds for ${serviceName}/${method}`));
    });

    req.write(requestData);
    req.end();
  });
}

/**
 * Handle Task tool requests
 * Special handling for AI task delegation
 */
async function handleTaskTool(params) {
  const { description, prompt, subagent_type } = params;
  
  log('info', `Task tool invoked: ${description}`, { subagent_type });
  
  // Map subagent_type to MCP service
  const serviceMap = {
    'general-purpose': 'clear-thought',
    'stochastic': 'stochastic-thinking',
    'code-analysis': 'ast-grep',
    'web-search': 'web',
    'docker': 'docker',
    'github': 'github'
  };
  
  const serviceName = serviceMap[subagent_type] || 'clear-thought';
  
  try {
    // Call the appropriate MCP service through the router using tools/call
    const result = await callRouter(serviceName, 'tools/call', {
      name: 'sequentialthinking',
      arguments: {
        thought: prompt,
        thoughtNumber: 1,
        totalThoughts: 1,
        nextThoughtNeeded: false
      }
    });
    
    return {
      success: true,
      service: serviceName,
      result
    };
  } catch (error) {
    log('error', `Task tool error: ${error.message}`);
    return {
      success: false,
      error: error.message,
      service: serviceName
    };
  }
}

/**
 * Handle incoming JSON-RPC requests
 */
async function handleRequest(request) {
  const { id, method, params } = request;
  
  log('debug', `Handling request: ${method}`, { id });
  
  try {
    switch (method) {
      case 'initialize':
        // Respond with bridge capabilities
        sendResponse({
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '1.0',
            capabilities: {
              tools: {
                Task: {
                  description: 'AI task delegation through MCP Router',
                  inputSchema: {
                    type: 'object',
                    properties: {
                      description: { type: 'string' },
                      prompt: { type: 'string' },
                      subagent_type: { type: 'string' }
                    },
                    required: ['description', 'prompt', 'subagent_type']
                  }
                }
              }
            },
            serverInfo: {
              name: 'mcp-router-bridge',
              version: '1.0.0',
              project: PROJECT_NAME,
              routerUrl: MCP_ROUTER_URL
            }
          }
        });
        break;
        
      case 'tools/list':
        // List available tools
        sendResponse({
          jsonrpc: '2.0',
          id,
          result: {
            tools: [{
              name: 'Task',
              description: 'AI task delegation through MCP Router',
              inputSchema: {
                type: 'object',
                properties: {
                  description: { type: 'string' },
                  prompt: { type: 'string' },
                  subagent_type: { type: 'string' }
                },
                required: ['description', 'prompt', 'subagent_type']
              }
            }]
          }
        });
        break;
        
      case 'tools/call':
        // Handle tool invocation
        if (params.name === 'Task') {
          const result = await handleTaskTool(params.arguments);
          sendResponse({
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2)
                }
              ]
            }
          });
        } else {
          sendError(id, -32601, `Unknown tool: ${params.name}`);
        }
        break;
        
      case 'notifications/initialized':
        // Client is ready
        log('info', 'Bridge initialized successfully');
        break;
        
      case 'shutdown':
        // Clean shutdown
        log('info', 'Shutting down bridge');
        process.exit(0);
        break;
        
      default:
        // Unknown method - try to route to MCP services
        if (method.startsWith('mcp/')) {
          const [, serviceName, serviceMethod] = method.split('/');
          try {
            const result = await callRouter(serviceName, serviceMethod, params);
            sendResponse({
              jsonrpc: '2.0',
              id,
              result
            });
          } catch (error) {
            sendError(id, -32603, `Router error: ${error.message}`);
          }
        } else {
          sendError(id, -32601, `Method not found: ${method}`);
        }
    }
  } catch (error) {
    log('error', `Request handling error: ${error.message}`, { method });
    sendError(id, -32603, `Internal error: ${error.message}`);
  }
}

/**
 * Health check for router connection
 */
async function checkRouterConnection() {
  try {
    const options = {
      hostname: ROUTER_HOST,
      port: ROUTER_PORT,
      path: '/health',
      method: 'GET',
      timeout: 5000
    };
    
    return new Promise((resolve) => {
      const req = http.request(options, (res) => {
        resolve(res.statusCode === 200);
      });
      
      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });
      
      req.end();
    });
  } catch {
    return false;
  }
}

/**
 * Main initialization
 */
async function initialize() {
  log('info', 'Starting MCP Router Bridge', {
    project: PROJECT_NAME,
    router: MCP_ROUTER_URL,
    aiFeatures: ENABLE_AI_FEATURES
  });
  
  // Check router connection
  const isConnected = await checkRouterConnection();
  if (!isConnected) {
    log('warn', 'Router not responding at ' + MCP_ROUTER_URL);
    log('info', 'Bridge will attempt to reconnect when requests arrive');
  } else {
    log('info', 'Router connection verified');
  }
  
  // Process incoming JSON-RPC requests
  rl.on('line', (line) => {
    try {
      const request = JSON.parse(line);
      if (request.jsonrpc === '2.0') {
        handleRequest(request);
      } else {
        log('warn', 'Invalid JSON-RPC version', { received: request.jsonrpc });
      }
    } catch (error) {
      log('error', `Failed to parse request: ${error.message}`, { line });
    }
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    log('info', 'Received SIGINT, shutting down');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    log('info', 'Received SIGTERM, shutting down');
    process.exit(0);
  });
  
  // Handle uncaught errors
  process.on('uncaughtException', (error) => {
    log('error', `Uncaught exception: ${error.message}`, { stack: error.stack });
    process.exit(1);
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    log('error', 'Unhandled rejection', { reason, promise });
  });
}

// Start the bridge
initialize().catch((error) => {
  log('error', `Failed to initialize bridge: ${error.message}`);
  process.exit(1);
});