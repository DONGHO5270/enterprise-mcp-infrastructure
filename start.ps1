# Start MCP Infrastructure - Windows PowerShell Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting MCP Infrastructure" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan

# Check if Docker is running
$dockerStatus = docker version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Docker is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop first." -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] Docker is running" -ForegroundColor Green

# Find project root by looking for CLAUDE.md
$projectRoot = Get-Location
if (-not (Test-Path "$projectRoot\CLAUDE.md")) {
    Write-Host "[ERROR] Not in project root directory!" -ForegroundColor Red
    Write-Host "Please run from the project root containing CLAUDE.md" -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] Project root: $projectRoot" -ForegroundColor Green

# Check for docker-compose file
$composeFile = "$projectRoot\docker\docker-compose.yml"
if (-not (Test-Path $composeFile)) {
    # Try alternative locations
    $composeFile = "$projectRoot\docker\compose\docker-compose-powershell.yml"
    if (-not (Test-Path $composeFile)) {
        $composeFile = "$projectRoot\docker\compose\docker-compose-mcp-ondemand.yml"
        if (-not (Test-Path $composeFile)) {
            Write-Host "[ERROR] docker-compose.yml not found!" -ForegroundColor Red
            Write-Host "Expected at: docker\docker-compose.yml" -ForegroundColor Yellow
            exit 1
        }
    }
}

Write-Host "[OK] Using compose file: $composeFile" -ForegroundColor Green

# Build MCP Router
Write-Host ""
Write-Host "Building MCP Router..." -ForegroundColor Cyan
docker-compose -f $composeFile build mcp-router
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Build successful" -ForegroundColor Green

# Start MCP Router
Write-Host ""
Write-Host "Starting MCP Router..." -ForegroundColor Cyan
docker-compose -f $composeFile up -d mcp-router
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to start MCP Router!" -ForegroundColor Red
    exit 1
}

# Wait for service to be ready
Write-Host ""
Write-Host "Waiting for service to be ready..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

# Test health endpoint
Write-Host ""
Write-Host "Testing MCP Router health..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3100/health" -Method Get
    if ($response.status -eq "healthy") {
        Write-Host "[OK] MCP Router is healthy!" -ForegroundColor Green
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  MCP Infrastructure Ready!" -ForegroundColor Green
        Write-Host "  Access at: http://localhost:3100" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
    } else {
        Write-Host "[WARNING] Unexpected health status: $($response.status)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[ERROR] Health check failed!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Try checking Docker logs:" -ForegroundColor Yellow
    Write-Host "  docker-compose -f $composeFile logs mcp-router" -ForegroundColor Yellow
    exit 1
}