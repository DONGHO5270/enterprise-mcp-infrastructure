# 📌 Important: What This Repository Contains

## ✅ This is an MCP Management Tool
- **Infrastructure** for managing MCP services
- **Router** for unified access (port 3100)
- **Docker orchestration** for on-demand execution
- **Configuration tools** for Claude Code/Desktop

## ❌ This Does NOT Include MCPs
- No pre-installed MCP services
- Users install their own MCPs
- Clean slate approach
- You choose what to add

## 🎯 Purpose
```
1. You install this infrastructure
2. You add MCPs you need
3. Infrastructure manages them efficiently
```

## 📦 What's Actually Here
```
unified-mcp-infrastructure-clean/
├── services/
│   └── mcp-router/        # Router only
├── docker/                # Orchestration
├── bridge-to-router.js    # Connection bridge
└── docs/                  # Documentation
```

**No MCP services included - just the management platform**