# Smart Setup Script for Windows PowerShell
# Automatically detects project location and configures paths
# Works from any directory where the project is cloned

param(
    [switch]$Force = $false
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Smart Setup for MCP Infrastructure" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Function to find project root
function Find-ProjectRoot {
    $currentPath = Get-Location
    $maxDepth = 10
    $depth = 0
    
    # Look for CLAUDE.md as project root indicator
    while ($depth -lt $maxDepth) {
        if (Test-Path (Join-Path $currentPath "CLAUDE.md")) {
            return $currentPath
        }
        
        $parent = Split-Path $currentPath -Parent
        if ([string]::IsNullOrEmpty($parent) -or $parent -eq $currentPath) {
            break
        }
        
        $currentPath = $parent
        $depth++
    }
    
    # If not found, assume current directory is project root
    return Get-Location
}

# Detect project root
$ProjectRoot = Find-ProjectRoot
Write-Host "[OK] Project Root: $ProjectRoot" -ForegroundColor Green

# Convert Windows path to Unix format for Docker
$ProjectRootUnix = $ProjectRoot -replace '\\', '/' -replace '^([A-Z]):', '/$1' | ForEach-Object { $_.ToLower() }
if ($ProjectRootUnix -match '^/([a-z])/') {
    $ProjectRootUnix = "/mnt/$($Matches[1])/" + $ProjectRootUnix.Substring(3)
}

Write-Host "[OK] Unix Path: $ProjectRootUnix" -ForegroundColor Green

# Create docker/compose directory if it doesn't exist
$dockerComposeDir = Join-Path $ProjectRoot "docker\compose"
if (-not (Test-Path $dockerComposeDir)) {
    New-Item -ItemType Directory -Path $dockerComposeDir -Force | Out-Null
    Write-Host "[OK] Created docker/compose directory" -ForegroundColor Green
}

# Generate .env file with dynamic paths
$envFile = Join-Path $dockerComposeDir ".env"
$envContent = @"
# Auto-generated environment configuration
# Generated on: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
# Project Root: $ProjectRoot

# System paths
PROJECT_ROOT=$ProjectRootUnix
PROJECT_ROOT_WINDOWS=$($ProjectRoot -replace '\\', '\\')
DATA_PATH=$ProjectRootUnix/data
LOG_PATH=$ProjectRootUnix/logs
SERVICES_PATH=$ProjectRootUnix/services
CONFIGS_PATH=$ProjectRootUnix/configs

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
"@

if ($Force -or -not (Test-Path $envFile)) {
    $envContent | Out-File -FilePath $envFile -Encoding UTF8
    Write-Host "[OK] Generated .env file" -ForegroundColor Green
} else {
    Write-Host "[INFO] .env file already exists (use -Force to overwrite)" -ForegroundColor Yellow
}

# Generate docker-compose.yml with relative paths
$composeFile = Join-Path $ProjectRoot "docker\docker-compose.yml"
$composeContent = @"
# Auto-generated Docker Compose configuration
# This file uses environment variables from docker/compose/.env

version: '3.8'

networks:
  mcp-network:
    driver: bridge
    name: `${NETWORK_NAME}

services:
  mcp-router:
    build:
      context: ./services/mcp-router
      dockerfile: Dockerfile
    container_name: mcp-router
    restart: unless-stopped
    ports:
      - "`${MCP_ROUTER_PORT}:3000"
    networks:
      - mcp-network
    volumes:
      # Use relative paths from project root
      - ./services/mcp:/app/services/mcp:ro
      - ./configs:/app/configs:ro
      - ./logs:/app/logs
    environment:
      - NODE_ENV=production
      - LOG_LEVEL=`${LOG_LEVEL}
      - PROJECT_ROOT=/app
    env_file:
      - ./docker/compose/.env
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"]
      interval: 30s
      timeout: 10s
      retries: 3
"@

if ($Force -or -not (Test-Path $composeFile)) {
    $composeContent | Out-File -FilePath $composeFile -Encoding UTF8
    Write-Host "[OK] Generated docker-compose.yml" -ForegroundColor Green
} else {
    Write-Host "[INFO] docker-compose.yml already exists (use -Force to overwrite)" -ForegroundColor Yellow
}

# Create necessary directories
$directories = @(
    "services\mcp",
    "configs",
    "logs",
    "data"
)

foreach ($dir in $directories) {
    $fullPath = Join-Path $ProjectRoot $dir
    if (-not (Test-Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
        Write-Host "[OK] Created directory: $dir" -ForegroundColor Green
    }
}

# Create a batch file for easy Docker commands
$startScript = Join-Path $ProjectRoot "start-mcp.bat"
$startContent = @"
@echo off
echo Starting MCP Infrastructure...
cd /d "%~dp0"
docker-compose -f docker\docker-compose.yml up -d
echo.
echo MCP Infrastructure is running!
echo Access the router at: http://localhost:3100
echo.
pause
"@

$startContent | Out-File -FilePath $startScript -Encoding ASCII
Write-Host "[OK] Created start-mcp.bat" -ForegroundColor Green

# Create a stop script
$stopScript = Join-Path $ProjectRoot "stop-mcp.bat"
$stopContent = @"
@echo off
echo Stopping MCP Infrastructure...
cd /d "%~dp0"
docker-compose -f docker\docker-compose.yml down
echo.
echo MCP Infrastructure stopped.
pause
"@

$stopContent | Out-File -FilePath $stopScript -Encoding ASCII
Write-Host "[OK] Created stop-mcp.bat" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "    Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Run: docker-compose -f docker\docker-compose.yml build" -ForegroundColor White
Write-Host "2. Run: docker-compose -f docker\docker-compose.yml up -d" -ForegroundColor White
Write-Host "   Or simply run: .\start-mcp.bat" -ForegroundColor White
Write-Host ""
Write-Host "Your infrastructure will be available at:" -ForegroundColor Cyan
Write-Host "http://localhost:3100" -ForegroundColor Green