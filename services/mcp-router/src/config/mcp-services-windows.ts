import { MCPService } from '../types';
import path from 'path';

// Windows/WSL compatible MCP services configuration for stdio mode
// This configuration uses actual Windows/WSL paths instead of Docker container paths

const BASE_PATH = '/mnt/c/claude-development/unified-mcp-infrastructure/services/mcp';

export const MCP_SERVICES_WINDOWS_CONFIG: Record<string, MCPService> = {
  // Code Checker MCP (Python) - Direct execution
  'code-checker': {
    name: 'code-checker',
    command: 'python3',
    args: ['-u', 'real_mcp_server.py'],
    cwd: path.join(BASE_PATH, 'code-checker-mcp'),
    env: {
      PYTHONPATH: path.join(BASE_PATH, 'code-checker-mcp/src'),
      PYTHONUNBUFFERED: '1',
      PYTHONIOENCODING: 'utf-8',
      LANG: 'C.UTF-8',
      LC_ALL: 'C.UTF-8'
    },
    capabilities: ['tools'],
    startupTimeout: 10000
  },

  // Mem0 MCP (Python) - Direct execution
  'mem0': {
    name: 'mem0',
    command: 'python3',
    args: ['-u', 'mem0_service.py'],
    cwd: path.join(BASE_PATH, 'mem0-mcp'),
    env: {
      MEM0_API_KEY: process.env.MEM0_API_KEY || '',
      PYTHONPATH: path.join(BASE_PATH, 'mem0-mcp'),
      PYTHONUNBUFFERED: '1',
      PYTHONIOENCODING: 'utf-8',
      LANG: 'C.UTF-8',
      LC_ALL: 'C.UTF-8'
    },
    capabilities: ['tools'],
    startupTimeout: 10000
  },

  // Other services (fallback to original configuration)
  // These services work with the shell-based approach
  
  // Context7 MCP
  'context7': {
    name: 'context7',
    command: 'node',
    args: ['dist/index.js'],
    cwd: path.join(BASE_PATH, 'context7-mcp'),
    env: {
      CONTEXT7_API_KEY: process.env.CONTEXT7_API_KEY || ''
    },
    capabilities: ['tools', 'resources']
  },

  // Clear Thought MCP (Node.js based)
  'clear-thought': {
    name: 'clear-thought',
    command: 'node',
    args: ['dist/main.js'],
    cwd: path.join(BASE_PATH, 'clear-thought-mcp'),
    env: {},
    capabilities: ['tools'],
    startupTimeout: 10000
  },

  // Stochastic Thinking MCP
  'stochastic-thinking': {
    name: 'stochastic-thinking',
    command: 'node',
    args: ['packages/server-stochasticthinking/dist/index.js'],
    cwd: path.join(BASE_PATH, 'stochastic-thinking-mcp'),
    env: {},
    capabilities: ['tools'],
    startupTimeout: 10000
  },

  // Sequential Thinking Tools MCP
  'sequential-thinking-tools': {
    name: 'sequential-thinking-tools',
    command: 'node',
    args: ['index.js'],
    cwd: path.join(BASE_PATH, 'sequential-thinking-tools'),
    env: {
      NODE_ENV: 'production',
      LANG: 'C.UTF-8',
      LC_ALL: 'C.UTF-8'
    },
    capabilities: ['tools'],
    startupTimeout: 15000
  },

  // NPM Sentinel MCP
  'npm-sentinel': {
    name: 'npm-sentinel',
    command: 'node',
    args: ['dist/index.js'],
    cwd: path.join(BASE_PATH, 'npm-sentinel-mcp'),
    env: {
      NPM_REGISTRY_URL: process.env.NPM_REGISTRY_URL || 'https://registry.npmjs.org'
    },
    capabilities: ['tools']
  },

  // Mermaid MCP
  'mermaid': {
    name: 'mermaid',
    command: 'node',
    args: ['dist/index.js'],
    cwd: path.join(BASE_PATH, 'mermaid-mcp'),
    env: {
      PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: 'true',
      DISPLAY: ':99'
    },
    capabilities: ['tools'],
    startupTimeout: 30000
  },

  // Node Omnibus MCP
  'node-omnibus': {
    name: 'node-omnibus',
    command: 'node',
    args: ['build/index.js'],
    cwd: path.join(BASE_PATH, 'node-omnibus-mcp'),
    env: {},
    capabilities: ['tools']
  },

  // Code Context Provider MCP
  'code-context-provider': {
    name: 'code-context-provider',
    command: 'node',
    args: ['dist/index.js'],
    cwd: path.join(BASE_PATH, 'code-context-provider-mcp'),
    env: {},
    capabilities: ['tools', 'resources']
  },

  // Desktop Commander MCP
  'desktop-commander': {
    name: 'desktop-commander',
    command: 'node',
    args: ['dist/index.js'],
    cwd: path.join(BASE_PATH, 'desktop-commander-mcp'),
    env: {
      ALLOWED_PATHS: process.env.DESKTOP_COMMANDER_ALLOWED_PATHS || '/workspace'
    },
    capabilities: ['tools']
  },

  // NodeJS Debugger MCP
  'nodejs-debugger': {
    name: 'nodejs-debugger',
    command: 'node',
    args: ['src/mcp-server.js'],
    cwd: path.join(BASE_PATH, 'nodejs-debugger-mcp'),
    env: {},
    capabilities: ['tools']
  },

  // Serper Search MCP
  'serper-search': {
    name: 'serper-search',
    command: 'node',
    args: ['build/index.js'],
    cwd: path.join(BASE_PATH, 'serper-search-mcp'),
    env: {
      SERPER_API_KEY: process.env.SERPER_MCP_API_KEY || ''
    },
    capabilities: ['tools']
  },

  // Vercel MCP
  'vercel': {
    name: 'vercel',
    command: 'node',
    args: ['dist/index.js'],
    cwd: path.join(BASE_PATH, 'vercel-mcp'),
    env: {
      VERCEL_ID: process.env.VERCEL_MCP_ID || '',
      VERCEL_ACCESS_TOKEN: process.env.VERCEL_MCP_ACCESS_TOKEN || ''
    },
    capabilities: ['tools', 'resources'],
    startupTimeout: 10000
  },

  // 21st.dev Magic MCP
  '21stdev-magic': {
    name: '21stdev-magic',
    command: 'node',
    args: ['dist/index.js'],
    cwd: path.join(BASE_PATH, '21stdev-magic-mcp'),
    env: {
      TWENTY_FIRST_API_KEY: process.env.TWENTY_FIRST_MCP_API_KEY || ''
    },
    capabilities: ['tools'],
    startupTimeout: 15000
  },

  // Taskmaster AI MCP (Python)
  'taskmaster-ai': {
    name: 'taskmaster-ai',
    command: 'python3',
    args: ['-u', 'taskmaster_ai_pure_tool.py'],
    cwd: path.join(BASE_PATH, 'taskmaster-ai-mcp'),
    env: {
      ANTHROPIC_API_KEY: process.env.TASKMASTER_ANTHROPIC_API_KEY || '',
      OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
      OLLAMA_MODEL: process.env.OLLAMA_MODEL || 'llama3.2',
      USE_OLLAMA: process.env.USE_OLLAMA || 'false',
      LLM_PROVIDER: process.env.LLM_PROVIDER || 'anthropic',
      TASKMASTER_WAIT_FOR_ALL: 'true',
      TASKMASTER_HOST_MODE: 'true',
      PYTHONPATH: path.join(BASE_PATH, 'taskmaster-ai-mcp'),
      PYTHONUNBUFFERED: '1',
      PYTHONIOENCODING: 'utf-8',
      LANG: 'C.UTF-8',
      LC_ALL: 'C.UTF-8'
    },
    capabilities: ['tools', 'resources'],
    startupTimeout: 30000
  },

  // Code Runner MCP (Deno)
  'code-runner': {
    name: 'code-runner',
    command: 'deno',
    args: ['run', '--allow-all', 'index.ts'],
    cwd: path.join(BASE_PATH, 'code-runner-mcp'),
    env: {},
    capabilities: ['tools'],
    startupTimeout: 10000
  },

  // Docker MCP (Python)
  'docker': {
    name: 'docker',
    command: 'python3',
    args: ['-u', 'docker_mcp_server.py'],
    cwd: path.join(BASE_PATH, 'docker-mcp'),
    env: {
      DOCKER_HOST: process.env.DOCKER_HOST || 'unix:///var/run/docker.sock',
      PYTHONPATH: path.join(BASE_PATH, 'docker-mcp'),
      PYTHONUNBUFFERED: '1',
      PYTHONIOENCODING: 'utf-8',
      LANG: 'C.UTF-8',
      LC_ALL: 'C.UTF-8'
    },
    capabilities: ['tools'],
    startupTimeout: 10000
  },

  // GitHub MCP
  'github': {
    name: 'github',
    command: 'node',
    args: ['dist/index.js'],
    cwd: path.join(BASE_PATH, 'github-mcp'),
    env: {
      GITHUB_TOKEN: process.env.GITHUB_MCP_TOKEN || ''
    },
    capabilities: ['tools', 'resources'],
    startupTimeout: 15000
  },

  // Supabase MCP
  'supabase': {
    name: 'supabase',
    command: 'node',
    args: ['dist/index.js'],
    cwd: path.join(BASE_PATH, 'supabase-mcp'),
    env: {
      SUPABASE_URL: process.env.SUPABASE_MCP_URL || '',
      SUPABASE_KEY: process.env.SUPABASE_MCP_KEY || '',
      SUPABASE_PROJECT_REF: process.env.SUPABASE_MCP_PROJECT_REF || '',
      SUPABASE_ACCESS_TOKEN: process.env.SUPABASE_MCP_ACCESS_TOKEN || ''
    },
    capabilities: ['tools', 'resources'],
    startupTimeout: 15000
  },

  // Serena MCP (Python)
  'serena': {
    name: 'serena',
    command: 'python3',
    args: ['-u', 'serena_mcp.py'],
    cwd: path.join(BASE_PATH, 'serena-mcp'),
    env: {
      SERENA_PROJECT_DIR: process.env.SERENA_PROJECT_DIR || BASE_PATH,
      PYTHONPATH: path.join(BASE_PATH, 'serena-mcp/src'),
      PYTHONUNBUFFERED: '1',
      PYTHONIOENCODING: 'utf-8',
      LANG: 'C.UTF-8',
      LC_ALL: 'C.UTF-8'
    },
    capabilities: ['tools'],
    startupTimeout: 15000
  },

  // Playwright MCP (Python)
  'playwright': {
    name: 'playwright',
    command: 'python3',
    args: ['-u', 'playwright_mcp.py'],
    cwd: path.join(BASE_PATH, 'playwright-mcp'),
    env: {
      PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: 'true',
      DISPLAY: ':99',
      PYTHONPATH: path.join(BASE_PATH, 'playwright-mcp'),
      PYTHONUNBUFFERED: '1',
      PYTHONIOENCODING: 'utf-8',
      LANG: 'C.UTF-8',
      LC_ALL: 'C.UTF-8'
    },
    capabilities: ['tools'],
    startupTimeout: 15000
  }
};