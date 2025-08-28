# 🚀 Quick Start Guide

> 💡 **통합 MCP 관리시스템**: 사용자의 MCP 서비스를 Docker 기반으로 통합 관리

## 📋 Prerequisites

Before you begin, ensure you have:

- **Docker Desktop** installed and running
- **Git** for cloning the repository
- **8GB+ RAM** recommended
- **Basic Docker knowledge** helpful

## 🔧 Installation Steps

### **Step 1: Clone the Repository**

```bash
git clone https://github.com/DONGHO5270/enterprise-mcp-infrastructure
cd enterprise-mcp-infrastructure
```

### **Step 2: Verify Docker is Running**

```bash
# Check Docker is installed
docker --version

# Check Docker is running
docker ps

# If not running, start Docker Desktop
```

### **Step 3: Set Up Environment Variables**

```bash
# Copy the template file
cp configs/api-keys.env.template configs/api-keys.env

# Edit with your API keys (if you have services that need them)
nano configs/api-keys.env

# Example content:
# GITHUB_TOKEN=your_github_token
# ANTHROPIC_API_KEY=your_anthropic_key
# OPENAI_API_KEY=your_openai_key
```

### **Step 4: Start the Infrastructure**

```bash
# Start the MCP router and infrastructure
docker-compose -f docker/compose/docker-compose-mcp-ondemand.yml up -d

# Verify it's running
docker ps

# Check the logs
docker-compose -f docker/compose/docker-compose-mcp-ondemand.yml logs
```

### **Step 5: Test the Infrastructure**

```bash
# Test the health endpoint
curl http://localhost:3100/health

# Expected response: {"status":"healthy","router":"active"}
```

## 📦 Adding Your First MCP Service

### **Example: Adding a Simple MCP Service**

1. **Create service directory**
   ```bash
   mkdir -p services/mcp/hello-world
   ```

2. **Create a simple service** (`services/mcp/hello-world/index.js`):
   ```javascript
   const process = require('process');
   
   // Simple MCP service that responds to JSON-RPC
   process.stdin.on('data', (chunk) => {
     const request = JSON.parse(chunk);
     
     if (request.method === 'tools/list') {
       const response = {
         jsonrpc: '2.0',
         id: request.id,
         result: {
           tools: [{
             name: 'hello',
             description: 'Say hello',
             inputSchema: {
               type: 'object',
               properties: {
                 name: { type: 'string' }
               }
             }
           }]
         }
       };
       process.stdout.write(JSON.stringify(response) + '\n');
     }
   });
   ```

3. **Register the service** in `services/mcp-router/src/config/mcp-services.ts`:
   ```typescript
   'hello-world': {
     command: 'node',
     args: ['index.js'],
     cwd: path.join(__dirname, '../../mcp/hello-world'),
     env: {},
     startupTimeout: 5000,
     description: 'Simple hello world service'
   }
   ```

4. **Rebuild and test**:
   ```bash
   # Rebuild the Docker image
   docker-compose -f docker/compose/docker-compose-mcp-ondemand.yml build
   
   # Restart the services
   docker-compose -f docker/compose/docker-compose-mcp-ondemand.yml restart
   
   # Test your new service
   curl -X POST http://localhost:3100/mcp/hello-world \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","id":"test","method":"tools/list","params":{}}'
   ```

## ⚠️ Important Notes

### **사용자가 추가하는 것**

- 📌 **MCP 서비스** - 필요한 서비스를 선택하여 추가
- 🔑 **API 키** - 각 서비스별 인증 정보 설정
- ⚙️ **환경 설정** - 서비스별 세부 구성
- 🎯 **커스텀 로직** - 프로젝트에 맞는 설정

### **What You Need to Do**

1. **Find or create MCP services** you want to use
2. **Add them to the services directory**
3. **Register them in the configuration**
4. **Install their dependencies**
5. **Configure API keys if needed**

## 🔍 Troubleshooting

### **Port 3100 Already in Use**
```bash
# Find what's using port 3100
lsof -i :3100  # On Mac/Linux
netstat -ano | findstr :3100  # On Windows

# Change port in docker-compose file if needed
```

### **Docker Not Running**
```bash
# Start Docker Desktop manually
# Or use command line:
sudo systemctl start docker  # Linux
open /Applications/Docker.app  # Mac
```

### **Service Not Responding**
```bash
# Check logs
docker-compose -f docker/compose/docker-compose-mcp-ondemand.yml logs

# Check if service is registered
cat services/mcp-router/src/config/mcp-services.ts | grep your-service

# Restart everything
docker-compose -f docker/compose/docker-compose-mcp-ondemand.yml down
docker-compose -f docker/compose/docker-compose-mcp-ondemand.yml up -d
```

## 📚 Next Steps

1. **Read the [Infrastructure Guide](INFRASTRUCTURE-GUIDE.md)** to understand the architecture
2. **Find MCP services** that match your needs
3. **Add and configure** your chosen services
4. **Test thoroughly** before production use

## 🆘 Getting Help

- **GitHub Issues**: https://github.com/DONGHO5270/enterprise-mcp-infrastructure/issues
- **Documentation**: See [README.md](README.md) for detailed information
- **Infrastructure Guide**: See [INFRASTRUCTURE-GUIDE.md](INFRASTRUCTURE-GUIDE.md) for technical details

---

**참고**: 이 프로젝트는 MCP 서비스 통합 관리시스템입니다. 실제 MCP 서비스는 사용자가 필요에 따라 선택하여 추가합니다.