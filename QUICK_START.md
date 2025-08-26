# ⚡ 60-Second Quick Start

## 🚀 Try It NOW (Demo Branch)

```bash
# 1. Clone and run
git clone -b demo-services https://github.com/DONGHO5270/enterprise-mcp-infrastructure
cd enterprise-mcp-infrastructure
docker-compose -f docker/compose/docker-compose-demo.yml up -d

# 2. Test it works
curl -X POST http://localhost:3100/mcp/echo-mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":"test","method":"tools/call","params":{"name":"echo","arguments":{"message":"Hello World!"}}}'

# Expected output: {"jsonrpc":"2.0","id":"test","result":{"content":[{"type":"text","text":"Echo: Hello World!"}]}}
```

## ✅ What You Get

- **3 Working MCP Services** (11 tools total)
- **Complete Infrastructure** ready for your services
- **Docker-based** deployment
- **Zero configuration** needed

## 🎯 Next Steps

1. **Test the demo** - See how it works
2. **Add your services** - Replace demo with real MCP
3. **Scale up** - Add all 23 services
4. **Deploy** - Production ready!

## 📚 Resources

- [Full Documentation](README.md)
- [Service Catalog](TOOL-CATALOG.md)
- [Docker Setup](docker/compose/README.md)
- [Contributing Guide](CONTRIBUTING.md)

---

**Need help?** Open an issue: https://github.com/DONGHO5270/enterprise-mcp-infrastructure/issues