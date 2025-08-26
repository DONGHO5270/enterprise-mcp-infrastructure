#!/usr/bin/env node

/**
 * Time MCP - Time and date utilities demonstration service
 * Provides time-related tools for testing the infrastructure
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

// Service metadata
const SERVICE_INFO = {
  name: 'time-mcp',
  version: '1.0.0',
  description: 'Time and date utilities service for MCP infrastructure'
};

// Available tools
const TOOLS = [
  {
    name: 'current_time',
    description: 'Get current time in various formats',
    inputSchema: {
      type: 'object',
      properties: {
        format: {
          type: 'string',
          description: 'Time format: iso, unix, readable',
          enum: ['iso', 'unix', 'readable']
        }
      },
      required: []
    }
  },
  {
    name: 'time_difference',
    description: 'Calculate time difference between two dates',
    inputSchema: {
      type: 'object',
      properties: {
        start: { type: 'string', description: 'Start date (ISO format)' },
        end: { type: 'string', description: 'End date (ISO format)' }
      },
      required: ['start', 'end']
    }
  },
  {
    name: 'add_days',
    description: 'Add days to a date',
    inputSchema: {
      type: 'object',
      properties: {
        date: { type: 'string', description: 'Base date (ISO format)' },
        days: { type: 'integer', description: 'Number of days to add' }
      },
      required: ['date', 'days']
    }
  },
  {
    name: 'timezone_convert',
    description: 'Convert time between timezones',
    inputSchema: {
      type: 'object',
      properties: {
        time: { type: 'string', description: 'Time to convert (ISO format)' },
        from_tz: { type: 'string', description: 'Source timezone offset (e.g., +00:00)' },
        to_tz: { type: 'string', description: 'Target timezone offset (e.g., +09:00)' }
      },
      required: ['time', 'from_tz', 'to_tz']
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
      case 'current_time':
        const now = new Date();
        let timeStr;
        switch (args.format || 'iso') {
          case 'unix':
            timeStr = `Unix timestamp: ${Math.floor(now.getTime() / 1000)}`;
            break;
          case 'readable':
            timeStr = `Current time: ${now.toLocaleString()}`;
            break;
          case 'iso':
          default:
            timeStr = `ISO time: ${now.toISOString()}`;
        }
        result = {
          content: [{ type: 'text', text: timeStr }]
        };
        break;

      case 'time_difference':
        const start = new Date(args.start);
        const end = new Date(args.end);
        const diff = end - start;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        result = {
          content: [{
            type: 'text',
            text: `Time difference: ${days} days, ${hours} hours, ${minutes} minutes`
          }]
        };
        break;

      case 'add_days':
        const baseDate = new Date(args.date);
        baseDate.setDate(baseDate.getDate() + args.days);
        result = {
          content: [{
            type: 'text',
            text: `New date: ${baseDate.toISOString()}`
          }]
        };
        break;

      case 'timezone_convert':
        const sourceTime = new Date(args.time);
        const fromOffset = parseTimezoneOffset(args.from_tz);
        const toOffset = parseTimezoneOffset(args.to_tz);
        const offsetDiff = (toOffset - fromOffset) * 60 * 1000;
        const convertedTime = new Date(sourceTime.getTime() + offsetDiff);
        
        result = {
          content: [{
            type: 'text',
            text: `Converted time: ${convertedTime.toISOString()}`
          }]
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

function parseTimezoneOffset(tz) {
  // Parse timezone offset like "+09:00" to minutes
  const match = tz.match(/([+-])(\d{2}):(\d{2})/);
  if (!match) throw new Error('Invalid timezone format');
  
  const sign = match[1] === '+' ? 1 : -1;
  const hours = parseInt(match[2]);
  const minutes = parseInt(match[3]);
  
  return sign * (hours * 60 + minutes);
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