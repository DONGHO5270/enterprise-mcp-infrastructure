# MCP Services Directory

This directory contains Docker-containerized MCP services installed by users.

## Structure

Each subdirectory represents an installed MCP service:
- Service code is cloned from GitHub
- Dockerfile is created for containerization
- Service runs in Docker container and connects to MCP Router on port 3100

## Installed Services

- **clear-thought**: Systematic thinking and mental models MCP service (Port 24001)

## Adding New Services

Use Claude Code to install new MCP services:
```
You> Install [service-name] MCP
GitHub: [repository-url]
```

Claude will automatically:
1. Clone the repository
2. Create Dockerfile
3. Update docker-compose configuration
4. Register with MCP Router
5. Start the service