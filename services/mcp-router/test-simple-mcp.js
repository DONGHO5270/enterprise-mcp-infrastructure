#!/usr/bin/env node

// Simple test MCP that echoes back the request
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  try {
    const request = JSON.parse(line);
    
    // Simple echo response
    const response = {
      jsonrpc: '2.0',
      id: request.id,
      result: {
        echo: request.method,
        params: request.params,
        timestamp: new Date().toISOString()
      }
    };
    
    console.log(JSON.stringify(response));
  } catch (e) {
    // Send error response
    console.log(JSON.stringify({
      jsonrpc: '2.0',
      id: 'error',
      error: {
        code: -32700,
        message: 'Parse error',
        data: e.message
      }
    }));
  }
});

// Send capabilities on startup
console.log(JSON.stringify({
  jsonrpc: '2.0',
  id: 'init',
  result: {
    capabilities: {
      tools: ['echo']
    }
  }
}));