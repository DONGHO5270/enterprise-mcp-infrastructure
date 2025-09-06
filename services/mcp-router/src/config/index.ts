import { RouterConfig } from '../types';
import dotenv from 'dotenv';
import path from 'path';
import { MCP_SERVICES_CONFIG } from './mcp-services';
import { MCP_SERVICES_WINDOWS_CONFIG } from './mcp-services-windows';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../../configs/api-keys.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../configs/environment.env') });

// Determine if we're running in stdio mode (Claude Desktop) vs HTTP mode (Docker)
const isStdioMode = process.argv.some(arg => arg.includes('stdio-server')) || process.env.MCP_STDIO_MODE === 'true';

export const config: RouterConfig = {
  MAX_CONCURRENT_PROCESSES: parseInt(process.env.MAX_CONCURRENT_PROCESSES || '10'),
  REQUEST_TIMEOUT: parseInt(process.env.REQUEST_TIMEOUT || '30000'),
  PROCESS_IDLE_TIMEOUT: parseInt(process.env.PROCESS_IDLE_TIMEOUT || '60000'),
  MCP_SERVICES: isStdioMode ? MCP_SERVICES_WINDOWS_CONFIG : MCP_SERVICES_CONFIG
};
