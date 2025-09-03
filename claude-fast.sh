#!/bin/bash

# Fast Claude Launcher for unified-mcp-infrastructure (Linux/macOS)

set -e  # Exit on error

# Parse arguments
MODE="new"
if [ "$1" = "--continue" ] || [ "$1" = "continue" ]; then
    MODE="continue"
fi

# Colors for output
BLUE='\033[0;34m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

clear
echo -e "${BLUE}🚀 Unified MCP Infrastructure${NC}"
echo -e "${CYAN}Fast Claude Launcher${NC}"
echo -e "${CYAN}Path: $(pwd)${NC}"
echo

# Quick MCP Router check
echo -e "${YELLOW}⚡ Quick MCP Check...${NC}"
if curl -s --connect-timeout 2 http://localhost:3100/health > /dev/null 2>&1; then
    HEALTH=$(curl -s http://localhost:3100/health 2>/dev/null || echo '{"uptime":0}')
    UPTIME=$(echo "$HEALTH" | grep -o '"uptime":[0-9.]*' | cut -d: -f2 | cut -d, -f1 2>/dev/null || echo "0")
    echo -e "${GREEN}✅ MCP Router: Healthy (uptime: ${UPTIME}s)${NC}"
else
    echo -e "${YELLOW}⚠️  MCP Router: Not available${NC}"
    echo -e "${GRAY}   Run: docker-compose -f docker/compose/docker-compose-mcp-ondemand.yml up -d${NC}"
fi
echo

# Environment setup for MCP access
export MCP_ROUTER_URL="http://localhost:3100"
export MCP_PROJECT_ROOT="$(pwd)"
export UNIFIED_MCP_PATH="$(pwd)"

# Check for Claude Code installation
if ! command -v claude &> /dev/null; then
    echo -e "${RED}❌ Claude Code not found${NC}"
    echo -e "${GRAY}   Install with: npm install -g @anthropics/claude-code${NC}"
    exit 1
fi

# Claude launch configuration
CLAUDE_CMD="claude"
if [ -f ".mcp.json" ]; then
    echo -e "${CYAN}📦 Using .mcp.json configuration${NC}"
else
    echo -e "${CYAN}📦 Using mcp-config.json configuration${NC}"
    CLAUDE_CMD="claude --mcp-config mcp-config.json"
fi

if [ "$MODE" = "continue" ]; then
    CLAUDE_CMD="$CLAUDE_CMD --continue"
    echo -e "${GREEN}🔄 Continuing previous session...${NC}"
else
    echo -e "${GREEN}🆕 Starting new session...${NC}"
fi

echo
echo -e "${YELLOW}📋 Environment Setup:${NC}"
echo -e "${GRAY}  MCP_ROUTER_URL: http://localhost:3100${NC}"
echo -e "${GRAY}  MCP_PROJECT_ROOT: $(pwd)${NC}"
echo
echo -e "${GRAY}Command: $CLAUDE_CMD${NC}"
echo -e "${CYAN}Launching Claude Code with full MCP support...${NC}"
echo

# Launch Claude
exec $CLAUDE_CMD