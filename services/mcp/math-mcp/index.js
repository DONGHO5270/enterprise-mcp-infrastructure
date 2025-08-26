#!/usr/bin/env node

/**
 * Math MCP - Mathematical operations demonstration service
 * Provides basic math tools for testing the infrastructure
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

// Service metadata
const SERVICE_INFO = {
  name: 'math-mcp',
  version: '1.0.0',
  description: 'Mathematical operations service for MCP infrastructure'
};

// Available tools
const TOOLS = [
  {
    name: 'add',
    description: 'Add two numbers',
    inputSchema: {
      type: 'object',
      properties: {
        a: { type: 'number', description: 'First number' },
        b: { type: 'number', description: 'Second number' }
      },
      required: ['a', 'b']
    }
  },
  {
    name: 'multiply',
    description: 'Multiply two numbers',
    inputSchema: {
      type: 'object',
      properties: {
        a: { type: 'number', description: 'First number' },
        b: { type: 'number', description: 'Second number' }
      },
      required: ['a', 'b']
    }
  },
  {
    name: 'factorial',
    description: 'Calculate factorial of a number',
    inputSchema: {
      type: 'object',
      properties: {
        n: { type: 'integer', description: 'Number to calculate factorial for (0-20)' }
      },
      required: ['n']
    }
  },
  {
    name: 'fibonacci',
    description: 'Generate Fibonacci sequence',
    inputSchema: {
      type: 'object',
      properties: {
        count: { type: 'integer', description: 'Number of Fibonacci numbers to generate' }
      },
      required: ['count']
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
      case 'add':
        result = {
          content: [
            {
              type: 'text',
              text: `${args.a} + ${args.b} = ${args.a + args.b}`
            }
          ]
        };
        break;

      case 'multiply':
        result = {
          content: [
            {
              type: 'text',
              text: `${args.a} × ${args.b} = ${args.a * args.b}`
            }
          ]
        };
        break;

      case 'factorial':
        if (args.n < 0 || args.n > 20) {
          throw new Error('Factorial input must be between 0 and 20');
        }
        const fact = factorial(args.n);
        result = {
          content: [
            {
              type: 'text',
              text: `${args.n}! = ${fact}`
            }
          ]
        };
        break;

      case 'fibonacci':
        if (args.count < 1 || args.count > 100) {
          throw new Error('Count must be between 1 and 100');
        }
        const fib = fibonacci(args.count);
        result = {
          content: [
            {
              type: 'text',
              text: `First ${args.count} Fibonacci numbers: ${fib.join(', ')}`
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

function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

function fibonacci(count) {
  const result = [];
  let a = 0, b = 1;
  
  for (let i = 0; i < count; i++) {
    result.push(a);
    [a, b] = [b, a + b];
  }
  
  return result;
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