#!/bin/bash
# Smart Setup Script for Linux/WSL/macOS
# Automatically detects project location and configures paths
# Works from any directory where the project is cloned

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================"
echo -e "    Smart Setup for MCP Infrastructure"
echo -e "========================================${NC}"

# Function to find project root
find_project_root() {
    local current_path="$(pwd)"
    local max_depth=10
    local depth=0
    
    # Look for CLAUDE.md as project root indicator
    while [ $depth -lt $max_depth ]; do
        if [ -f "$current_path/CLAUDE.md" ]; then
            echo "$current_path"
            return 0
        fi
        
        local parent="$(dirname "$current_path")"
        if [ "$parent" = "$current_path" ] || [ "$parent" = "/" ]; then
            break
        fi
        
        current_path="$parent"
        depth=$((depth + 1))
    done
    
    # If not found, assume current directory is project root
    echo "$(pwd)"
}

# Detect project root
PROJECT_ROOT="$(find_project_root)"
echo -e "${GREEN}[OK] Project Root: $PROJECT_ROOT${NC}"

# Check if running in WSL
IS_WSL=false
WINDOWS_PATH=""
if grep -q Microsoft /proc/version 2>/dev/null; then
    IS_WSL=true
    # Convert to Windows path for WSL
    if command -v wslpath &> /dev/null; then
        WINDOWS_PATH=$(wslpath -w "$PROJECT_ROOT" 2>/dev/null || echo "")
        if [ -n "$WINDOWS_PATH" ]; then
            echo -e "${GREEN}[OK] Windows Path: $WINDOWS_PATH${NC}"
        fi
    fi
fi

# Create docker/compose directory if it doesn't exist
DOCKER_COMPOSE_DIR="$PROJECT_ROOT/docker/compose"
if [ ! -d "$DOCKER_COMPOSE_DIR" ]; then
    mkdir -p "$DOCKER_COMPOSE_DIR"
    echo -e "${GREEN}[OK] Created docker/compose directory${NC}"
fi

# Generate .env file with dynamic paths
ENV_FILE="$DOCKER_COMPOSE_DIR/.env"
generate_env_file() {
    cat > "$ENV_FILE" << EOF
# Auto-generated environment configuration
# Generated on: $(date '+%Y-%m-%d %H:%M:%S')
# Project Root: $PROJECT_ROOT

# System paths
PROJECT_ROOT=$PROJECT_ROOT
DATA_PATH=$PROJECT_ROOT/data
LOG_PATH=$PROJECT_ROOT/logs
SERVICES_PATH=$PROJECT_ROOT/services
CONFIGS_PATH=$PROJECT_ROOT/configs

# Network configuration
NETWORK_NAME=mcp-network

# MCP Router configuration
MCP_HUB_PORT=3100
MCP_ROUTER_PORT=3100
GATEWAY_PORT=3200

# Logging
LOG_LEVEL=info

# Docker configuration
COMPOSE_PROJECT_NAME=unified-mcp
DOCKER_BUILDKIT=1
EOF

    # Add Windows path if in WSL
    if [ "$IS_WSL" = true ] && [ -n "$WINDOWS_PATH" ]; then
        echo "PROJECT_ROOT_WINDOWS=$WINDOWS_PATH" >> "$ENV_FILE"
    fi
}

# Check if force flag is set
FORCE=false
if [ "$1" = "--force" ] || [ "$1" = "-f" ]; then
    FORCE=true
fi

if [ "$FORCE" = true ] || [ ! -f "$ENV_FILE" ]; then
    generate_env_file
    echo -e "${GREEN}[OK] Generated .env file${NC}"
else
    echo -e "${YELLOW}[INFO] .env file already exists (use --force to overwrite)${NC}"
fi

# Generate docker-compose.yml with relative paths
COMPOSE_FILE="$PROJECT_ROOT/docker-compose.yml"
generate_compose_file() {
    cat > "$COMPOSE_FILE" << 'EOF'
# Auto-generated Docker Compose configuration
# This file uses environment variables from docker/compose/.env

version: '3.8'

networks:
  mcp-network:
    driver: bridge
    name: ${NETWORK_NAME}

services:
  mcp-router:
    build:
      context: ./services/mcp-router
      dockerfile: Dockerfile
    container_name: mcp-router
    restart: unless-stopped
    ports:
      - "${MCP_ROUTER_PORT}:3000"
    networks:
      - mcp-network
    volumes:
      # Use relative paths from project root
      - ./services/mcp:/app/services/mcp:ro
      - ./configs:/app/configs:ro
      - ./logs:/app/logs
    environment:
      - NODE_ENV=production
      - LOG_LEVEL=${LOG_LEVEL}
      - PROJECT_ROOT=/app
    env_file:
      - ./docker/compose/.env
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"]
      interval: 30s
      timeout: 10s
      retries: 3
EOF
}

if [ "$FORCE" = true ] || [ ! -f "$COMPOSE_FILE" ]; then
    generate_compose_file
    echo -e "${GREEN}[OK] Generated docker-compose.yml${NC}"
else
    echo -e "${YELLOW}[INFO] docker-compose.yml already exists (use --force to overwrite)${NC}"
fi

# Create necessary directories
DIRECTORIES=(
    "services/mcp"
    "configs"
    "logs"
    "data"
)

for dir in "${DIRECTORIES[@]}"; do
    FULL_PATH="$PROJECT_ROOT/$dir"
    if [ ! -d "$FULL_PATH" ]; then
        mkdir -p "$FULL_PATH"
        echo -e "${GREEN}[OK] Created directory: $dir${NC}"
    fi
done

# Create start script
START_SCRIPT="$PROJECT_ROOT/start-mcp.sh"
cat > "$START_SCRIPT" << 'EOF'
#!/bin/bash
echo "Starting MCP Infrastructure..."
cd "$(dirname "$0")"
docker-compose up -d
echo ""
echo "MCP Infrastructure is running!"
echo "Access the router at: http://localhost:3100"
EOF
chmod +x "$START_SCRIPT"
echo -e "${GREEN}[OK] Created start-mcp.sh${NC}"

# Create stop script
STOP_SCRIPT="$PROJECT_ROOT/stop-mcp.sh"
cat > "$STOP_SCRIPT" << 'EOF'
#!/bin/bash
echo "Stopping MCP Infrastructure..."
cd "$(dirname "$0")"
docker-compose down
echo ""
echo "MCP Infrastructure stopped."
EOF
chmod +x "$STOP_SCRIPT"
echo -e "${GREEN}[OK] Created stop-mcp.sh${NC}"

echo -e "\n${CYAN}========================================"
echo -e "    Setup Complete!"
echo -e "========================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "${WHITE}1. Run: docker-compose build${NC}"
echo -e "${WHITE}2. Run: docker-compose up -d${NC}"
echo -e "${WHITE}   Or simply run: ./start-mcp.sh${NC}"
echo ""
echo -e "${CYAN}Your infrastructure will be available at:${NC}"
echo -e "${GREEN}http://localhost:3100${NC}"

# Special instructions for WSL users
if [ "$IS_WSL" = true ]; then
    echo ""
    echo -e "${YELLOW}WSL User Note:${NC}"
    echo -e "You can also access from Windows at the same URL"
    echo -e "Make sure Docker Desktop is running with WSL2 integration"
fi