/**
 * MCP Services Configuration
 * Demo version with 3 working services
 */

export interface MCPServiceConfig {
  command: string;
  args?: string[];
  env?: Record<string, string>;
  startupTimeout?: number;
  description?: string;
  verified?: boolean;
  toolCount?: number;
}

export const MCP_SERVICES: Record<string, MCPServiceConfig> = {
  // Demo Services - Fully Functional
  'echo-mcp': {
    command: 'bash',
    args: ['services/mcp/echo-mcp/run.sh'],
    startupTimeout: 5000,
    description: 'Simple echo service for testing',
    verified: true,
    toolCount: 3
  },
  
  'math-mcp': {
    command: 'bash',
    args: ['services/mcp/math-mcp/run.sh'],
    startupTimeout: 5000,
    description: 'Mathematical operations service',
    verified: true,
    toolCount: 4
  },
  
  'time-mcp': {
    command: 'bash',
    args: ['services/mcp/time-mcp/run.sh'],
    startupTimeout: 5000,
    description: 'Time and date utilities service',
    verified: true,
    toolCount: 4
  }

  // Note: Additional services can be added here following the same pattern
  // Simply create the service in /services/mcp/[service-name]/
  // and add its configuration here
};