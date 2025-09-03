# Fast Claude Launcher for unified-mcp-infrastructure
param(
    [Parameter(Position=0)]
    [string]$Mode = 'new'
)

Clear-Host
Write-Host "🚀 Unified MCP Infrastructure" -ForegroundColor Blue
Write-Host "Fast Claude Launcher" -ForegroundColor Cyan
Write-Host "Path: $PWD" -ForegroundColor Cyan
Write-Host ""

# Quick MCP Router check
Write-Host "⚡ Quick MCP Check..." -ForegroundColor Yellow
try {
    $healthResult = Invoke-WebRequest -Uri "http://localhost:3100/health" -Method GET -TimeoutSec 2 -ErrorAction Stop
    $health = $healthResult.Content | ConvertFrom-Json
    Write-Host "✅ MCP Router: Healthy (uptime: $([math]::Round($health.uptime, 1))s)" -ForegroundColor Green
} catch {
    Write-Host "⚠️  MCP Router: Not available" -ForegroundColor Yellow
    Write-Host "   Run: docker-compose -f docker/compose/docker-compose-mcp-ondemand.yml up -d" -ForegroundColor Gray
}

Write-Host ""

# Environment setup for MCP access
$env:MCP_ROUTER_URL = "http://localhost:3100"
$env:MCP_PROJECT_ROOT = $PWD.Path
$env:UNIFIED_MCP_PATH = $PWD.Path

# Claude launch configuration
if (Test-Path ".mcp.json") {
    Write-Host "📦 Using .mcp.json configuration" -ForegroundColor Cyan
    $claudeCmd = "claude --dangerously-skip-permissions"
} else {
    Write-Host "📦 Using mcp-config.json configuration" -ForegroundColor Cyan
    $claudeCmd = "claude --mcp-config mcp-config.json --dangerously-skip-permissions"
}

if ($Mode -eq '--continue' -or $Mode -eq 'continue') {
    $claudeCmd += " --continue"
    Write-Host "🔄 Continuing previous session..." -ForegroundColor Green
} else {
    Write-Host "🆕 Starting new session..." -ForegroundColor Green
}

Write-Host "⏵ dangerously-skip-permissions on" -ForegroundColor Magenta

Write-Host ""
Write-Host "📋 Environment Setup:" -ForegroundColor Yellow
Write-Host "  MCP_ROUTER_URL: http://localhost:3100" -ForegroundColor DarkGray
Write-Host "  MCP_PROJECT_ROOT: $($PWD.Path)" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Command: $claudeCmd" -ForegroundColor DarkGray
Write-Host "Launching Claude Code with full MCP support..." -ForegroundColor Cyan
Write-Host ""

# Launch Claude directly in PowerShell
Invoke-Expression $claudeCmd