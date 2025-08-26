#!/usr/bin/env node

/**
 * Echo MCP - Simple demonstration MCP service
 * Provides basic echo functionality to test the infrastructure
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

// Service metadata
const SERVICE_INFO = {
  name: 'echo-mcp',
  version: '1.0.0',
  description: 'Simple echo service for testing MCP infrastructure'
};

// Available tools
const TOOLS = [
  {
    name: 'echo',
    description: 'Echoes back the provided message',
    inputSchema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'The message to echo back'
        }
      },
      required: ['message']
    }
  },
  {
    name: 'reverse',
    description: 'Reverses the provided text',
    inputSchema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: 'The text to reverse'
        }
      },
      required: ['text']
    }
  },
  {
    name: 'uppercase',
    description: 'Converts text to uppercase',
    inputSchema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: 'The text to convert to uppercase'
        }
      },
      required: ['text']
    }
  }
];

// Handle JSON-RPC requests
rl.on('line', (line) => {
  try {
    const request = JSON.parse(line);
    handleRequest(request);
  } catch (e) {
    sendError(null, -32700, 'Parse error', e.message);
  }
});

function handleRequest(request) {
  const { method, params, id } = request;

  switch (method) {
    case 'initialize':
      sendResult(id, {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {}
        },
        serverInfo: SERVICE_INFO
      });
      break;

    case 'initialized':
      // No response needed
      break;

    case 'tools/list':
      sendResult(id, { tools: TOOLS });
      break;

    case 'tools/call':
      handleToolCall(id, params);
      break;

    default:
      sendError(id, -32601, 'Method not found', `Unknown method: ${method}`);
  }
}

function handleToolCall(id, params) {
  const { name, arguments: args } = params;

  try {
    let result;

    switch (name) {
      case 'echo':
        result = {
          content: [
            {
              type: 'text',
              text: `Echo: ${args.message}`
            }
          ]
        };
        break;

      case 'reverse':
        result = {
          content: [
            {
              type: 'text',
              text: args.text.split('').reverse().join('')
            }
          ]
        };
        break;

      case 'uppercase':
        result = {
          content: [
            {
              type: 'text',
              text: args.text.toUpperCase()
            }
          ]
        };
        break;

      default:
        sendError(id, -32602, 'Invalid params', `Unknown tool: ${name}`);
        return;
    }

    sendResult(id, result);
  } catch (e) {
    sendError(id, -32603, 'Internal error', e.message);
  }
}

function sendResult(id, result) {
  const response = {
    jsonrpc: '2.0',
    id,
    result
  };
  console.log(JSON.stringify(response));
}

function sendError(id, code, message, data) {
  const response = {
    jsonrpc: '2.0',
    id,
    error: {
      code,
      message,
      data
    }
  };
  console.log(JSON.stringify(response));
}

// Handle errors
process.on('uncaughtException', (err) => {
  process.stderr.write(`Uncaught exception: ${err}\n`);
  process.exit(1);
});