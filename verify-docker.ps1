# Docker 설정 완료 검증 스크립트 (PowerShell)
# GUI 설정 완료 후 이 스크립트로 모든 것이 올바르게 작동하는지 확인

param(
    [switch]$Verbose = $false
)

$ErrorActionPreference = "Continue"

# Test counter
$TestsPassed = 0
$TestsFailed = 0

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🔍 Docker 환경 검증 시작" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Function to run test
function Test-Command {
    param(
        [string]$TestName,
        [string]$Command,
        [string]$Description = ""
    )
    
    Write-Host "`n📋 테스트: $TestName" -ForegroundColor Yellow
    Write-Host "명령어: $Command" -ForegroundColor Gray
    
    try {
        $output = Invoke-Expression $Command -ErrorAction Stop
        Write-Host "✅ 성공" -ForegroundColor Green
        if ($Verbose -and $output) {
            Write-Host "출력: $output" -ForegroundColor Gray
        }
        $script:TestsPassed++
        return $true
    }
    catch {
        Write-Host "❌ 실패" -ForegroundColor Red
        Write-Host "오류: $($_.Exception.Message)" -ForegroundColor Red
        $script:TestsFailed++
        return $false
    }
}

# Function to run test with output capture
function Test-CommandWithOutput {
    param(
        [string]$TestName,
        [string]$Command
    )
    
    Write-Host "`n📋 테스트: $TestName" -ForegroundColor Yellow
    Write-Host "명령어: $Command" -ForegroundColor Gray
    
    try {
        $output = Invoke-Expression $Command -ErrorAction Stop
        Write-Host "✅ 성공" -ForegroundColor Green
        Write-Host "출력: $output" -ForegroundColor Gray
        $script:TestsPassed++
        return $true
    }
    catch {
        Write-Host "❌ 실패" -ForegroundColor Red
        Write-Host "오류: $($_.Exception.Message)" -ForegroundColor Red
        $script:TestsFailed++
        return $false
    }
}

Write-Host "`n=== 1. 시스템 환경 검증 ===" -ForegroundColor Cyan

# Check Windows version
$WindowsVersion = (Get-WmiObject -class Win32_OperatingSystem).Caption
Write-Host "✅ Windows 버전: $WindowsVersion" -ForegroundColor Green

# Check WSL availability
try {
    $wslVersion = wsl --list --verbose 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ WSL 사용 가능" -ForegroundColor Green
        if ($Verbose) {
            Write-Host "WSL 배포판:" -ForegroundColor Gray
            Write-Host $wslVersion -ForegroundColor Gray
        }
    }
    else {
        Write-Host "⚠️ WSL 설치되지 않음" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "⚠️ WSL 상태 확인 불가" -ForegroundColor Yellow
}

Write-Host "`n=== 2. Docker 기본 검증 ===" -ForegroundColor Cyan

# Test 1: Docker command availability
Test-Command "Docker 명령어 사용 가능" "docker --version"

# Test 2: Docker daemon connection
Test-Command "Docker 데몬 연결" "docker info"

# Test 3: Docker Compose availability
Test-CommandWithOutput "Docker Compose 버전 확인" "docker compose version"

Write-Host "`n=== 3. Docker 기능 테스트 ===" -ForegroundColor Cyan

# Test 4: List containers
Test-Command "컨테이너 목록 조회" "docker ps"

# Test 5: List images
Test-Command "이미지 목록 조회" "docker images"

# Test 6: Hello World test
Write-Host "`n📋 테스트: Hello World 컨테이너 실행" -ForegroundColor Yellow
try {
    $helloOutput = docker run --rm hello-world 2>&1
    if ($helloOutput -match "Hello from Docker") {
        Write-Host "✅ 성공 - Hello World 테스트 통과" -ForegroundColor Green
        Write-Host "출력: Hello from Docker!" -ForegroundColor Gray
        $TestsPassed++
    }
    else {
        Write-Host "❌ 실패 - Hello World 출력 확인 안됨" -ForegroundColor Red
        Write-Host "출력: $helloOutput" -ForegroundColor Red
        $TestsFailed++
    }
}
catch {
    Write-Host "❌ 실패 - Hello World 컨테이너 실행 실패" -ForegroundColor Red
    Write-Host "오류: $($_.Exception.Message)" -ForegroundColor Red
    $TestsFailed++
}

Write-Host "`n=== 4. MCP 인프라 준비 상태 확인 ===" -ForegroundColor Cyan

# Get script location
$ScriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Check CLAUDE.md
if (Test-Path (Join-Path $ScriptPath "CLAUDE.md")) {
    Write-Host "✅ MCP 인프라 디렉토리 확인됨" -ForegroundColor Green
    $TestsPassed++
}
else {
    Write-Host "❌ CLAUDE.md 파일을 찾을 수 없음" -ForegroundColor Red
    Write-Host "현재 디렉토리: $ScriptPath" -ForegroundColor Gray
    $TestsFailed++
}

# Check smart-setup scripts
$smartSetupPs1 = Join-Path $ScriptPath "smart-setup.ps1"
$smartSetupSh = Join-Path $ScriptPath "smart-setup.sh"

if ((Test-Path $smartSetupPs1) -and (Test-Path $smartSetupSh)) {
    Write-Host "✅ Smart Setup 스크립트 확인됨" -ForegroundColor Green
    $TestsPassed++
}
else {
    Write-Host "❌ Smart Setup 스크립트 누락" -ForegroundColor Red
    $TestsFailed++
}

# Check docker directory structure
$dockerDir = Join-Path $ScriptPath "docker"
if (Test-Path $dockerDir) {
    Write-Host "✅ Docker 설정 디렉토리 확인됨" -ForegroundColor Green
    $TestsPassed++
    
    $composeFile = Join-Path $dockerDir "docker-compose.yml"
    if (Test-Path $composeFile) {
        Write-Host "✅ Docker Compose 파일 확인됨" -ForegroundColor Green
        $TestsPassed++
    }
    else {
        Write-Host "⚠️ Docker Compose 파일 없음 (smart-setup 실행 필요)" -ForegroundColor Yellow
    }
}
else {
    Write-Host "❌ Docker 설정 디렉토리 누락" -ForegroundColor Red
    $TestsFailed++
}

Write-Host "`n=== 5. 네트워크 및 포트 확인 ===" -ForegroundColor Cyan

# Check if port 3100 is available
try {
    $portTest = Test-NetConnection -ComputerName localhost -Port 3100 -WarningAction SilentlyContinue
    if ($portTest.TcpTestSucceeded) {
        Write-Host "⚠️ 포트 3100이 이미 사용 중" -ForegroundColor Yellow
        try {
            $process = Get-NetTCPConnection -LocalPort 3100 -ErrorAction SilentlyContinue | Select-Object -First 1
            if ($process) {
                $processInfo = Get-Process -Id $process.OwningProcess -ErrorAction SilentlyContinue
                Write-Host "사용 중인 프로세스: $($processInfo.ProcessName)" -ForegroundColor Gray
            }
        }
        catch {
            Write-Host "프로세스 정보 확인 불가" -ForegroundColor Gray
        }
    }
    else {
        Write-Host "✅ 포트 3100 사용 가능" -ForegroundColor Green
        $TestsPassed++
    }
}
catch {
    Write-Host "⚠️ 포트 3100 확인 불가" -ForegroundColor Yellow
}

# Final results
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🎯 검증 결과 요약" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$TotalTests = $TestsPassed + $TestsFailed
$SuccessRate = if ($TotalTests -gt 0) { [math]::Round(($TestsPassed * 100) / $TotalTests) } else { 0 }

Write-Host "총 테스트: $TotalTests"
Write-Host "통과: $TestsPassed" -ForegroundColor Green
Write-Host "실패: $TestsFailed" -ForegroundColor Red
Write-Host "성공률: $SuccessRate%"

if ($TestsFailed -eq 0) {
    Write-Host "`n🎉 모든 테스트 통과! Docker 환경이 완벽히 설정되었습니다." -ForegroundColor Green
    Write-Host "`n다음 단계:" -ForegroundColor Cyan
    Write-Host "1. " -NoNewline
    Write-Host ".\smart-setup.ps1" -ForegroundColor Yellow -NoNewline
    Write-Host " 실행하여 MCP 인프라 구성"
    Write-Host "2. " -NoNewline  
    Write-Host ".\start-mcp.bat" -ForegroundColor Yellow -NoNewline
    Write-Host " 실행하여 서비스 시작"
    Write-Host "3. " -NoNewline
    Write-Host "curl http://localhost:3100/health" -ForegroundColor Yellow -NoNewline
    Write-Host " 으로 상태 확인"
    exit 0
}
elseif ($SuccessRate -ge 80) {
    Write-Host "`n⚠️ 대부분의 테스트는 통과했지만 일부 문제가 있습니다." -ForegroundColor Yellow
    Write-Host "`n권장 조치:" -ForegroundColor Cyan
    Write-Host "1. Docker Desktop 재시작"
    Write-Host "2. WSL Integration 설정 재확인" 
    Write-Host "3. 필요시 시스템 재부팅"
    exit 1
}
else {
    Write-Host "`n❌ 심각한 문제가 발견되었습니다." -ForegroundColor Red
    Write-Host "`n권장 조치:" -ForegroundColor Cyan
    Write-Host "1. " -NoNewline
    Write-Host "DOCKER-GUI-SETUP-GUIDE.md" -ForegroundColor Yellow -NoNewline
    Write-Host " 가이드 재검토"
    Write-Host "2. Docker Desktop WSL Integration 재설정"
    Write-Host "3. Docker Desktop 완전 재설치 고려"
    exit 2
}