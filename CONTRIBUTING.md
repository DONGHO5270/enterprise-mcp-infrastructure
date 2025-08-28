# 🤝 Contributing to MCP Infrastructure Framework

Thank you for your interest in contributing! This project provides **infrastructure for MCP services**. Note that MCP services themselves are not included - this is an empty framework that users populate with their own services.

## 🎯 Our Standards

### ✅ What We Accept
- **Infrastructure improvements** - Docker setup, routing optimization
- **Documentation improvements** - Installation guides, architecture docs
- **Bug fixes** - Router, container, or infrastructure issues
- **Cross-platform compatibility** - Improvements for Windows, Linux, macOS

### ❌ What We Don't Accept
- MCP service implementations (those belong in separate repositories)
- Business logic beyond infrastructure scope
- AI features beyond basic infrastructure
- Service-specific code (this is infrastructure only)

## 🚀 Getting Started

### Prerequisites
- Docker 20.10+
- Node.js 18+ (for testing)
- Git

### Setup Development Environment
```bash
# 1. Fork and clone
git clone https://github.com/yourusername/unified-mcp-infrastructure
cd unified-mcp-infrastructure

# 2. Start services
docker-compose -f docker/compose/docker-compose-mcp-ondemand.yml up -d

# 3. Verify all services work
./scripts/test-all-21-mcps.sh

# 4. Make your changes
```

## 🔧 Types of Contributions

### 1. Improving Infrastructure for MCP Services

#### Infrastructure Enhancement Checklist
- [ ] Enhancement improves reliability or performance
- [ ] Changes are compatible with existing architecture
- [ ] Docker configuration is optimized
- [ ] Cross-platform compatibility is maintained
- [ ] Documentation is updated
- [ ] No service-specific logic added

#### Step-by-Step Process
1. **Create service directory**
   ```bash
   mkdir services/mcp/your-service-mcp
   cd services/mcp/your-service-mcp
   ```

2. **Add service configuration**
   ```typescript
   // In services/mcp-router/src/config/mcp-services.ts
   'your-service': {
     command: 'node',
     args: ['index.js'],
     cwd: path.join(__dirname, '../../mcp/your-service-mcp'),
     env: { NODE_ENV: 'production' },
     startupTimeout: 8000,
     description: 'Your service description'
   }
   ```

3. **Create wrapper script**
   ```javascript
   // services/mcp/your-service-mcp/index.js
   // Implement your MCP service here
   ```

4. **Add to Docker compose**
   ```yaml
   # Add volume mount in docker-compose files
   - ./services/mcp/your-service-mcp:/app/services/mcp/your-service-mcp
   ```

5. **Write tests**
   ```bash
   # Create test file
   echo 'curl -X POST http://localhost:3100/mcp/your-service ...' > test-your-service.sh
   ```

6. **Update documentation**
   - Update infrastructure guides
   - Document configuration changes
   - Add troubleshooting tips if applicable

### 2. Improving Existing Services

#### Bug Fixes
- Include reproduction steps
- Verify fix works across all supported platforms
- Add regression test if applicable

#### Performance Improvements
- Benchmark before/after performance
- Ensure changes don't break existing functionality
- Document any configuration changes needed

### 3. Documentation Improvements

- **Accuracy first** - All examples must work exactly as written
- **Clarity** - Assume users are new to MCP
- **Completeness** - Include all necessary setup steps

## 🧪 Testing

### Required Tests Before Submitting
```bash
# 1. Test all services still work
./scripts/test-all-21-mcps.sh

# 2. Test your specific service
curl -X POST http://localhost:3100/mcp/your-service \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":"test","method":"tools/list","params":{}}'

# 3. Test service startup time
time docker-compose up your-service

# 4. Test cross-platform (if possible)
# Windows: docker-compose -f docker/compose/docker-compose-powershell.yml
# Linux: docker-compose -f docker/compose/docker-compose-mcp-ondemand.yml
```

### Test Quality Standards
- All tools must return valid responses
- No timeouts or hanging requests
- Error messages must be helpful
- Startup time < 10 seconds

## 📋 Pull Request Process

### 1. Before You Submit
- [ ] All tests pass
- [ ] Documentation updated
- [ ] No breaking changes to existing services
- [ ] Infrastructure changes are documented
- [ ] Cross-platform compatibility verified

### 2. PR Description Template
```markdown
## Summary
Brief description of changes

## Type of Change
- [ ] Infrastructure improvement
- [ ] Bug fix
- [ ] Performance improvement
- [ ] Documentation update

## Testing
- [ ] Tested on Linux/WSL
- [ ] Tested on Windows (if applicable)
- [ ] All existing services still work
- [ ] Added automated tests

## Infrastructure Changes
- Components affected: (list components)
- Performance impact: (describe if applicable)

## Breaking Changes
None / List any breaking changes
```

### 3. Review Process
1. **Automated checks** - CI tests, formatting
2. **Manual review** - Code quality, architecture fit
3. **Integration testing** - Full service stack verification
4. **Documentation review** - Accuracy and completeness

## 🔄 Infrastructure Quality Standards

All infrastructure contributions should meet:

### 🏆 Production Quality
- High reliability and uptime
- Efficient resource usage
- Comprehensive error handling
- Performance optimized

### 🛠️ Documentation Quality
- Clear architecture diagrams
- Step-by-step setup guides
- Troubleshooting sections
- API documentation

### 🔧 Testing Standards
- Unit tests for critical paths
- Integration tests for Docker setup
- Cross-platform verification

## 🌟 Recognition

Contributors who add quality services will be:
- Listed in project README
- Given credit in release notes
- Invited to join the core team (for significant contributions)

## ❓ Questions?

### Reporting Issues
- Check existing issues first
- Include reproduction steps
- Specify which service/tool is affected
- Include environment details (OS, Docker version)

### Getting Help
- Join our [Discord community](https://discord.gg/mcp-infrastructure) (coming soon)
- Open a discussion on GitHub
- Email: contributors@mcp-infrastructure.org (coming soon)

### Architectural Questions
- How does on-demand spawning work?
- Why use Docker for everything?
- How to handle service dependencies?

Check our [Architecture Documentation](docs/ARCHITECTURE.md) or ask in discussions.

## 📄 Code of Conduct

### Our Standards
- **Quality first** - No compromises on working functionality
- **Transparency** - All claims must be verifiable
- **Respect** - Professional communication
- **Collaboration** - Help others succeed

### Unacceptable Behavior
- Submitting non-working code
- False claims about tool functionality
- Unprofessional communication
- Plagiarism or license violations

---

## 🏗️ Development Roadmap

Interested in contributing? Here are areas where we need help:

### High Priority
- [ ] Windows native support (non-Docker)
- [ ] Service auto-discovery
- [ ] Real-time health monitoring
- [ ] Performance benchmarking suite

### Medium Priority
- [ ] Web UI for service management
- [ ] API rate limiting
- [ ] Service dependency management
- [ ] Automated service testing CI/CD

### Low Priority
- [ ] GraphQL interface
- [ ] Service marketplace
- [ ] Plugin system
- [ ] Multi-region deployment

---

**Thank you for helping us maintain the highest quality MCP infrastructure in the ecosystem!**

*Quality over quantity. Transparency over promises. Community over competition.*