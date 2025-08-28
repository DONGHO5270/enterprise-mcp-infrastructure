# 🏗️ Infrastructure Guide

> ⚠️ **Important**: This is an infrastructure framework. MCP services are NOT included.
> 
> This guide explains the infrastructure capabilities and how to add your own MCP services.

## 📋 What This Infrastructure Provides

### **Core Infrastructure Components**

#### **1. Docker Container Orchestration**
- Isolated environment for each MCP service
- Automatic network configuration
- Resource management and limits
- Cross-platform compatibility (Windows, Linux, macOS)

#### **2. MCP Router (Port 3100)**
- Unified API endpoint for all services
- JSON-RPC protocol handling
- Request routing to appropriate services
- Response aggregation

#### **3. Process Lifecycle Management**
- On-demand service spawning
- Automatic service shutdown after idle time
- Health monitoring and auto-recovery
- Resource optimization

#### **4. Environment Isolation**
- Separate environment variables per service
- API key management
- Configuration isolation
- Security boundaries

## 🎯 Infrastructure Architecture

```
┌─────────────────────────────────────┐
│         Client Application          │
│     (Claude Desktop, Cursor AI,     │
│      or any MCP-compatible app)     │
└──────────────┬──────────────────────┘
               │
               │ HTTP/JSON-RPC
               ▼
┌─────────────────────────────────────┐
│      MCP Router (Port 3100)         │
│   - Request routing                 │
│   - Process management              │
│   - Health monitoring               │
└──────────────┬──────────────────────┘
               │
               │ Spawns on-demand
               ▼
┌─────────────────────────────────────┐
│    Docker Container Network         │
├─────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  │
│  │   Service   │  │   Service   │  │
│  │     (A)     │  │     (B)     │  │
│  │   (Empty)   │  │   (Empty)   │  │
│  └─────────────┘  └─────────────┘  │
│                                     │
│  Users add their MCP services here │
└─────────────────────────────────────┘
```

## 📦 How to Add Your MCP Services

### **Step 1: Choose Your MCP Services**

Find MCP services from:
- Official MCP repositories
- Community contributions
- Your own custom implementations

### **Step 2: Add Service to Infrastructure**

1. **Place service files**
   ```bash
   # Copy your MCP service to the services directory
   cp -r your-mcp-service /services/mcp/
   ```

2. **Register in configuration**
   
   Edit `/services/mcp-router/src/config/mcp-services.ts`:
   ```typescript
   'your-service': {
     command: 'node',
     args: ['index.js'],
     cwd: path.join(__dirname, '../../mcp/your-service'),
     env: {
       // Add any required environment variables
       API_KEY: process.env.YOUR_SERVICE_API_KEY
     },
     startupTimeout: 5000,
     description: 'Description of your service'
   }
   ```

3. **Set up environment variables**
   
   Edit `configs/api-keys.env`:
   ```bash
   YOUR_SERVICE_API_KEY=your-actual-api-key
   ```

4. **Rebuild Docker images**
   ```bash
   docker-compose -f docker/compose/docker-compose-mcp-ondemand.yml build
   ```

5. **Test your service**
   ```bash
   curl -X POST http://localhost:3100/mcp/your-service \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","id":"test","method":"tools/list","params":{}}'
   ```

## 🚀 Infrastructure Capabilities

### **Performance Features**
- **On-demand execution**: Services only run when needed
- **Memory optimization**: 85% reduction compared to always-on services
- **Fast startup**: Services ready within seconds
- **Resource limits**: Prevent runaway processes

### **Reliability Features**
- **Health monitoring**: Continuous service health checks
- **Auto-recovery**: Automatic restart on failures
- **Graceful degradation**: Fallback mechanisms for service failures
- **Error isolation**: Service failures don't affect other services

### **Development Features**
- **Hot reload support**: Changes without full restart
- **Debug logging**: Comprehensive logging for troubleshooting
- **Multi-platform testing**: Test on different OS environments
- **Version management**: Easy service version switching

## 🔧 Configuration Options

### **Docker Compose Files**

Different configurations for various use cases:

| File | Purpose | Use Case |
|------|---------|----------|
| `docker-compose-mcp-ondemand.yml` | On-demand services | Production use |
| `docker-compose-mcp-always-on.yml` | Always-on services | Development/testing |
| `docker-compose-powershell.yml` | Windows PowerShell | Windows development |
| `docker-compose-desktop.yml` | Desktop integration | Claude Desktop |

### **Environment Variables**

| Variable | Purpose | Default |
|----------|---------|---------|
| `MCP_ROUTER_PORT` | Router listening port | 3100 |
| `MAX_CONCURRENT_PROCESSES` | Max simultaneous services | 10 |
| `SERVICE_IDLE_TIMEOUT` | Idle timeout (ms) | 60000 |
| `LOG_LEVEL` | Logging verbosity | info |

## 🛡️ Security Considerations

### **Infrastructure Security**
- Services run in isolated Docker containers
- Network isolation between services
- Environment variable isolation
- No shared filesystem access

### **API Security**
- API keys stored in environment files
- Keys never exposed in logs
- Separate keys per service
- Keys not included in version control

## 📊 Monitoring and Maintenance

### **Health Checks**
```bash
# Check infrastructure status
curl http://localhost:3100/health

# Check specific service
curl http://localhost:3100/mcp/your-service/health
```

### **Logs**
```bash
# View router logs
docker-compose logs mcp-router

# View all logs
docker-compose logs -f

# Filter logs
docker-compose logs | grep ERROR
```

### **Resource Usage**
```bash
# Check container resource usage
docker stats

# Check specific container
docker stats mcp-router
```

## ❓ Troubleshooting

### **Common Issues**

#### Service not responding
1. Check if Docker is running
2. Verify service is registered in configuration
3. Check logs for errors
4. Ensure dependencies are installed

#### Port conflicts
1. Check if port 3100 is available
2. Change port in environment variables if needed
3. Update client configuration

#### Service startup failures
1. Check service has all dependencies
2. Verify environment variables are set
3. Check file permissions
4. Review startup timeout settings

## 📚 Additional Resources

- [MCP Protocol Specification](https://github.com/modelcontextprotocol)
- [Docker Documentation](https://docs.docker.com)
- [JSON-RPC Specification](https://www.jsonrpc.org)

---

**Remember**: This infrastructure is a framework. Its value comes from the MCP services you add to it. Choose services that match your workflow and needs.