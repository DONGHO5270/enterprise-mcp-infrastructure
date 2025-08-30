# Docker Desktop Initial Setup Script for Windows
# Run as Administrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Docker Desktop Setup Helper" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check if Docker is installed
$dockerPath = Get-Command docker -ErrorAction SilentlyContinue
if (-not $dockerPath) {
    Write-Host "[ERROR] Docker Desktop not installed!" -ForegroundColor Red
    Write-Host "Please install from: https://www.docker.com/products/docker-desktop/" -ForegroundColor Yellow
    exit 1
}

# Check if Docker is running
try {
    docker version | Out-Null
    Write-Host "[OK] Docker is installed and running" -ForegroundColor Green
} catch {
    Write-Host "[INFO] Starting Docker Desktop..." -ForegroundColor Yellow
    Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    Write-Host "Waiting for Docker to start (30 seconds)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
}

# Check WSL 2
Write-Host "`nChecking WSL 2..." -ForegroundColor Cyan
$wslVersion = wsl --list --verbose 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "[INFO] Installing WSL 2..." -ForegroundColor Yellow
    wsl --install -d Ubuntu
    Write-Host "[ACTION REQUIRED] Please restart your computer after WSL installation!" -ForegroundColor Red
    exit 1
}

# Create .wslconfig for memory optimization
$wslConfigPath = "$env:USERPROFILE\.wslconfig"
if (-not (Test-Path $wslConfigPath)) {
    Write-Host "`nCreating WSL config for Docker optimization..." -ForegroundColor Yellow
    $wslConfig = @"
[wsl2]
memory=4GB
processors=2
swap=2GB
localhostForwarding=true

[experimental]
autoMemoryReclaim=gradual
"@
    $wslConfig | Out-File -FilePath $wslConfigPath -Encoding UTF8
    Write-Host "[OK] WSL config created at $wslConfigPath" -ForegroundColor Green
}

# Test Docker
Write-Host "`nTesting Docker installation..." -ForegroundColor Cyan
try {
    docker run hello-world | Out-Null
    Write-Host "[OK] Docker test successful!" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Docker test failed" -ForegroundColor Red
}

# Create docker-compose alias if needed
$dockerComposePath = Get-Command docker-compose -ErrorAction SilentlyContinue
if (-not $dockerComposePath) {
    Write-Host "`nCreating docker-compose alias..." -ForegroundColor Yellow
    # Docker Desktop v2+ uses 'docker compose' instead of 'docker-compose'
    Write-Host "[INFO] Use 'docker compose' instead of 'docker-compose'" -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Setup Check Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`nManual Settings Required in Docker Desktop GUI:" -ForegroundColor Yellow
Write-Host "1. Open Docker Desktop Settings (gear icon)" -ForegroundColor White
Write-Host "2. General > Enable 'Start Docker Desktop when you log in'" -ForegroundColor White
Write-Host "3. Resources > WSL Integration > Enable Ubuntu" -ForegroundColor White
Write-Host "4. Resources > Advanced > Set Memory to 4GB minimum" -ForegroundColor White
Write-Host "5. Apply & Restart" -ForegroundColor White

Write-Host "`nPress any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")