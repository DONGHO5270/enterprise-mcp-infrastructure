#!/bin/bash
# Docker Desktop Initial Setup Script for macOS/Linux
# Path-independent version - works from any location

# Get script location
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR"

# Auto-detect project root by looking for CLAUDE.md
CURRENT_PATH="$SCRIPT_DIR"
while [ "$CURRENT_PATH" != "/" ] && [ ! -f "$CURRENT_PATH/CLAUDE.md" ]; do
    CURRENT_PATH=$(dirname "$CURRENT_PATH")
done

if [ -f "$CURRENT_PATH/CLAUDE.md" ]; then
    PROJECT_ROOT="$CURRENT_PATH"
fi

echo "========================================"
echo "Docker Desktop Setup Helper"
echo "Project Root: $PROJECT_ROOT"
echo "========================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}[ERROR] Docker Desktop not installed!${NC}"
    echo -e "${YELLOW}Please install from: https://www.docker.com/products/docker-desktop/${NC}"
    exit 1
fi

# Check if Docker is running
if docker version &> /dev/null; then
    echo -e "${GREEN}[OK] Docker is installed and running${NC}"
else
    echo -e "${YELLOW}[INFO] Starting Docker...${NC}"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open -a Docker
        echo "Waiting for Docker to start (30 seconds)..."
        sleep 30
    else
        sudo systemctl start docker
        sudo systemctl enable docker
    fi
fi

# Test Docker
echo -e "\n${CYAN}Testing Docker installation...${NC}"
if docker run hello-world &> /dev/null; then
    echo -e "${GREEN}[OK] Docker test successful!${NC}"
else
    echo -e "${RED}[ERROR] Docker test failed${NC}"
    echo -e "${YELLOW}Try: sudo usermod -aG docker $USER${NC}"
    echo -e "${YELLOW}Then logout and login again${NC}"
fi

# Check docker-compose
if command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}[OK] docker-compose is available${NC}"
else
    echo -e "${YELLOW}[INFO] Use 'docker compose' instead of 'docker-compose'${NC}"
fi

# Linux specific - add user to docker group
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if ! groups | grep -q docker; then
        echo -e "\n${YELLOW}Adding user to docker group...${NC}"
        sudo usermod -aG docker $USER
        echo -e "${RED}[ACTION REQUIRED] Please logout and login again!${NC}"
    fi
fi

echo -e "\n========================================"
echo -e "${GREEN}Setup Check Complete!${NC}"
echo -e "========================================"

# macOS specific settings
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo -e "\n${YELLOW}Manual Settings Required in Docker Desktop:${NC}"
    echo "1. Open Docker Desktop Preferences"
    echo "2. General > Enable 'Start Docker Desktop when you log in'"
    echo "3. Resources > Advanced > Set Memory to 4GB minimum"
    echo "4. Resources > File Sharing > Add project directory if needed"
    echo "5. Apply & Restart"
fi

# Linux specific settings
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo -e "\n${YELLOW}Recommended Settings:${NC}"
    echo "1. Enable Docker service: sudo systemctl enable docker"
    echo "2. Check memory limits: docker info | grep Memory"
    echo "3. Configure daemon.json if needed: /etc/docker/daemon.json"
fi

# Generate path configuration for docker-compose
echo -e "\n${CYAN}Generating path configuration...${NC}"
ENV_FILE="$PROJECT_ROOT/docker/compose/.env"

if [ -d "$(dirname "$ENV_FILE")" ]; then
    cat >> "$ENV_FILE" << EOF
# Auto-generated path configuration
PROJECT_ROOT=$PROJECT_ROOT
DATA_PATH=$PROJECT_ROOT/data
LOG_PATH=$PROJECT_ROOT/logs
EOF
    echo -e "${GREEN}[OK] Path configuration saved to .env${NC}"
fi

# For WSL users, detect Windows path
if grep -q Microsoft /proc/version 2>/dev/null; then
    echo -e "\n${CYAN}WSL detected. Converting paths...${NC}"
    WINDOWS_PATH=$(wslpath -w "$PROJECT_ROOT" 2>/dev/null || echo "$PROJECT_ROOT")
    echo "Windows Path: $WINDOWS_PATH"
    echo "WSL Path: $PROJECT_ROOT"
fi

echo -e "\nPress Enter to continue..."
read