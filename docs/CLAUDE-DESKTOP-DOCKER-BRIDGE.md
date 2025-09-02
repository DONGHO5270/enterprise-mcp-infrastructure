# 🖥️ Claude Desktop with Docker MCP Services Setup Guide

## Overview

This guide explains how to use Docker-based MCP services from the unified infrastructure with Claude Desktop. Since Claude Desktop requires stdio-based communication and Docker MCP services use HTTP, a bridge is necessary.

## The Challenge

- **Docker MCP Services**: Run on `http://localhost:3100` (HTTP protocol)
- **Claude Desktop**: Expects stdio-based communication (stdin/stdout)
- **Solution**: A bridge script that translates between stdio and HTTP

## Setup Instructions

### Step 1: Create the Bridge Script

Create `claude-desktop-bridge.js` in a permanent location (e.g., `C:\claude-tools\`):

```javascript
#!/usr/bin/env node
const http = require('http');
const readline = require('readline');

class ClaudeDesktopMCPBridge {
  constructor() {
    this.routerUrl = 'http://localhost:3100';
  }

  async handleRequest(request) {
    try {
      // Determine which MCP service to call based on the request
      const service = this.detectService(request);
      
      // Forward request to Docker MCP Router
      const response = await this.callMCPRouter(service, request);
      
      return response;
    } catch (error) {
      return {
        jsonrpc: '2.0',
        id: request.id,
        error: {
          code: -32603,
          message: error.message
        }
      };
    }
  }

  detectService(request) {
    // Analyze request to determine target service
    if (request.method === 'tools/list') {
      return 'router'; // Get all available tools
    }
    
    // Parse tool name to identify service
    const toolName = request.params?.name || '';
    const serviceMap = {
      'analyze': 'clear-thought',
      'think': 'stochastic-thinking',
      'search': 'github',
      'test': 'playwright',
      'docker': 'docker',
      'deploy': 'vercel'
    };
    
    for (const [key, service] of Object.entries(serviceMap)) {
      if (toolName.toLowerCase().includes(key)) {
        return service;
      }
    }
    
    return 'router'; // Default to router
  }

  async callMCPRouter(service, request) {
    const url = service === 'router' 
      ? `${this.routerUrl}/health` 
      : `${this.routerUrl}/mcp/${service}`;
    
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify(request);
      
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };
      
      const req = http.request(url, options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error('Invalid JSON response'));
          }
        });
      });
      
      req.on('error', reject);
      req.write(postData);
      req.end();
    });
  }

  start() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });

    rl.on('line', async (line) => {
      try {
        const request = JSON.parse(line);
        const response = await this.handleRequest(request);
        console.log(JSON.stringify(response));
      } catch (error) {
        console.error('Bridge error:', error);
      }
    });
  }
}

// Start the bridge
const bridge = new ClaudeDesktopMCPBridge();
bridge.start();
```

### Step 2: Make Bridge Executable

#### Windows
```powershell
# Create batch wrapper
echo @node "C:\claude-tools\claude-desktop-bridge.js" %* > C:\claude-tools\claude-desktop-bridge.bat
```

#### macOS/Linux
```bash
chmod +x ~/claude-tools/claude-desktop-bridge.js
```

### Step 3: Configure Claude Desktop

Edit Claude Desktop configuration file:

#### Windows
Location: `%APPDATA%\Claude\claude_desktop_config.json`

#### macOS
Location: `~/Library/Application Support/Claude/claude_desktop_config.json`

#### Linux
Location: `~/.config/Claude/claude_desktop_config.json`

Add this configuration:

```json
{
  "mcpServers": {
    "docker-mcp": {
      "command": "node",
      "args": ["C:\\claude-tools\\claude-desktop-bridge.js"],
      "env": {
        "MCP_ROUTER_URL": "http://localhost:3100"
      }
    }
  }
}
```

**Note**: Adjust the path based on your OS:
- Windows: `"C:\\claude-tools\\claude-desktop-bridge.js"`
- macOS/Linux: `"/home/user/claude-tools/claude-desktop-bridge.js"`

### Step 4: Verify Setup

1. **Ensure Docker MCP Router is running:**
```bash
curl http://localhost:3100/health
# Should return: {"status":"healthy","router":"active"}
```

2. **Restart Claude Desktop** to load the new configuration

3. **Test in Claude Desktop:**
   - Open a new conversation
   - The MCP icon should appear in the interface
   - Try: "List available MCP tools"

## Troubleshooting

### Issue: "MCP connection failed"
**Solution**: 
1. Check Docker is running: `docker ps`
2. Verify MCP Router: `curl http://localhost:3100/health`
3. Check bridge script path in config

### Issue: "Command not found"
**Solution**: 
1. Ensure Node.js is installed: `node --version`
2. Verify bridge script exists at configured path
3. Check file permissions (executable)

### Issue: "No MCP tools available"
**Solution**:
1. MCP services might not be installed in Docker
2. Run infrastructure setup first:
```bash
cd enterprise-mcp-infrastructure
./smart-setup.sh  # or .\smart-setup.ps1 on Windows
```

## Alternative: Direct Service Configuration

If you want to connect to specific MCP services directly (bypassing the router):

```json
{
  "mcpServers": {
    "clear-thought": {
      "command": "node",
      "args": ["C:\\claude-tools\\direct-service-bridge.js", "clear-thought"]
    },
    "github": {
      "command": "node", 
      "args": ["C:\\claude-tools\\direct-service-bridge.js", "github"]
    }
  }
}
```

## Best Practices

1. **Keep Bridge Script Updated**: As new MCP services are added, update the service mapping
2. **Monitor Logs**: Check Claude Desktop logs for connection issues
3. **Resource Management**: The bridge is lightweight but keep an eye on Node.js processes
4. **Security**: Only expose localhost connections, never public IPs

## Performance Comparison

| Method | Setup Complexity | Performance | Flexibility |
|--------|-----------------|-------------|-------------|
| Bridge Script | Medium | Good | High |
| Native Docker | Not Possible | N/A | N/A |
| Individual MCPs | High | Best | Low |

## Conclusion

While Claude Desktop cannot directly connect to Docker HTTP services, this bridge solution provides:
- ✅ Access to all Docker MCP services
- ✅ Single configuration point
- ✅ Maintained context across services
- ✅ Compatible with the unified infrastructure

The bridge adds minimal overhead while enabling full MCP functionality in Claude Desktop.