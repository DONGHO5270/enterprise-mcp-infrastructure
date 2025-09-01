#!/bin/bash
# Start MCP Infrastructure - Linux/WSL Script

echo "========================================"
echo "  Starting MCP Infrastructure"
echo "========================================"

# Check if Docker is running
if ! docker version >/dev/null 2>&1; then
    echo "[ERROR] Docker is not running!"
    echo "Please start Docker first."
    exit 1
fi

echo "[OK] Docker is running"

# Find project root by looking for CLAUDE.md
PROJECT_ROOT=$(pwd)
if [ ! -f "$PROJECT_ROOT/CLAUDE.md" ]; then
    echo "[ERROR] Not in project root directory!"
    echo "Please run from the project root containing CLAUDE.md"
    exit 1
fi

echo "[OK] Project root: $PROJECT_ROOT"

# Check for docker-compose file
COMPOSE_FILE="$PROJECT_ROOT/docker/compose/docker-compose.yml"
if [ ! -f "$COMPOSE_FILE" ]; then
    # Try alternative location
    COMPOSE_FILE="$PROJECT_ROOT/docker/docker-compose.yml"
    if [ ! -f "$COMPOSE_FILE" ]; then
        echo "[ERROR] docker-compose.yml not found!"
        echo "Expected at: docker/compose/docker-compose.yml"
        exit 1
    fi
fi

echo "[OK] Using compose file: $COMPOSE_FILE"

# Build MCP Router
echo ""
echo "Building MCP Router..."
docker-compose -f "$COMPOSE_FILE" build mcp-router
if [ $? -ne 0 ]; then
    echo "[ERROR] Build failed!"
    exit 1
fi
echo "[OK] Build successful"

# Start MCP Router
echo ""
echo "Starting MCP Router..."
docker-compose -f "$COMPOSE_FILE" up -d mcp-router
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to start MCP Router!"
    exit 1
fi

# Wait for service to be ready
echo ""
echo "Waiting for service to be ready..."
sleep 3

# Test health endpoint
echo ""
echo "Testing MCP Router health..."
if curl -s http://localhost:3100/health | grep -q "healthy"; then
    echo "[OK] MCP Router is healthy!"
    echo ""
    echo "========================================"
    echo "  MCP Infrastructure Ready!"
    echo "  Access at: http://localhost:3100"
    echo "========================================"
else
    echo "[ERROR] Health check failed!"
    echo ""
    echo "Try checking Docker logs:"
    echo "  docker-compose -f $COMPOSE_FILE logs mcp-router"
    exit 1
fi