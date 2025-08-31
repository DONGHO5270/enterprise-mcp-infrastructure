#!/bin/bash
# Docker 설정 완료 검증 스크립트
# GUI 설정 완료 후 이 스크립트로 모든 것이 올바르게 작동하는지 확인

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;36m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

echo -e "${BLUE}========================================"
echo -e "🔍 Docker 환경 검증 시작"
echo -e "========================================${NC}"

# Function to run test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="$3"
    
    echo -e "\n${YELLOW}📋 테스트: $test_name${NC}"
    echo -e "명령어: $test_command"
    
    if eval $test_command > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 성공${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ 실패${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

# Function to run test with output check
run_test_with_output() {
    local test_name="$1"
    local test_command="$2"
    
    echo -e "\n${YELLOW}📋 테스트: $test_name${NC}"
    echo -e "명령어: $test_command"
    
    local output=$(eval $test_command 2>&1)
    local exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}✅ 성공${NC}"
        echo -e "출력: $output"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ 실패${NC}"
        echo -e "오류: $output"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

echo -e "\n${BLUE}=== 1. 시스템 환경 검증 ===${NC}"

# Check if running in WSL
if grep -q Microsoft /proc/version 2>/dev/null; then
    echo -e "${GREEN}✅ WSL 환경 감지됨${NC}"
    IS_WSL=true
else
    echo -e "${YELLOW}⚠️ WSL이 아닌 환경에서 실행 중${NC}"
    IS_WSL=false
fi

# Check WSL version
if command -v wsl.exe &> /dev/null && [ "$IS_WSL" = true ]; then
    WSL_VERSION=$(wsl.exe -l -v 2>/dev/null | grep -i ubuntu | awk '{print $3}' || echo "unknown")
    if [ "$WSL_VERSION" = "2" ]; then
        echo -e "${GREEN}✅ WSL 2 사용 중${NC}"
    else
        echo -e "${YELLOW}⚠️ WSL 버전: $WSL_VERSION${NC}"
    fi
fi

echo -e "\n${BLUE}=== 2. Docker 기본 검증 ===${NC}"

# Test 1: Docker command availability
run_test "Docker 명령어 사용 가능" "command -v docker"

# Test 2: Docker version
run_test_with_output "Docker 버전 확인" "docker --version"

# Test 3: Docker daemon connection
run_test "Docker 데몬 연결" "docker info"

# Test 4: Docker Compose availability  
run_test_with_output "Docker Compose 버전 확인" "docker compose version"

echo -e "\n${BLUE}=== 3. Docker 기능 테스트 ===${NC}"

# Test 5: List containers (should work even if empty)
run_test "컨테이너 목록 조회" "docker ps"

# Test 6: List images
run_test "이미지 목록 조회" "docker images"

# Test 7: Hello World test
echo -e "\n${YELLOW}📋 테스트: Hello World 컨테이너 실행${NC}"
if docker run --rm hello-world > /tmp/hello-world-test.log 2>&1; then
    if grep -q "Hello from Docker" /tmp/hello-world-test.log; then
        echo -e "${GREEN}✅ 성공 - Hello World 테스트 통과${NC}"
        echo -e "출력: $(grep "Hello from Docker" /tmp/hello-world-test.log)"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ 실패 - Hello World 출력 확인 안됨${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
else
    echo -e "${RED}❌ 실패 - Hello World 컨테이너 실행 실패${NC}"
    cat /tmp/hello-world-test.log
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

echo -e "\n${BLUE}=== 4. MCP 인프라 준비 상태 확인 ===${NC}"

# Check if we're in the right directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
if [ -f "$SCRIPT_DIR/CLAUDE.md" ]; then
    echo -e "${GREEN}✅ MCP 인프라 디렉토리 확인됨${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ CLAUDE.md 파일을 찾을 수 없음${NC}"
    echo -e "현재 디렉토리: $SCRIPT_DIR"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

# Check if smart-setup scripts exist
if [ -f "$SCRIPT_DIR/smart-setup.sh" ] && [ -f "$SCRIPT_DIR/smart-setup.ps1" ]; then
    echo -e "${GREEN}✅ Smart Setup 스크립트 확인됨${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ Smart Setup 스크립트 누락${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

# Check docker directory structure
if [ -d "$SCRIPT_DIR/docker" ]; then
    echo -e "${GREEN}✅ Docker 설정 디렉토리 확인됨${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
    
    if [ -f "$SCRIPT_DIR/docker/docker-compose.yml" ]; then
        echo -e "${GREEN}✅ Docker Compose 파일 확인됨${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${YELLOW}⚠️ Docker Compose 파일 없음 (smart-setup 실행 필요)${NC}"
    fi
else
    echo -e "${RED}❌ Docker 설정 디렉토리 누락${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

echo -e "\n${BLUE}=== 5. 네트워크 및 포트 확인 ===${NC}"

# Check if port 3100 is available (for MCP router)
if command -v ss &> /dev/null; then
    if ss -tuln | grep -q ":3100 "; then
        echo -e "${YELLOW}⚠️ 포트 3100이 이미 사용 중${NC}"
        echo -e "사용 중인 프로세스:"
        ss -tulnp | grep ":3100 "
    else
        echo -e "${GREEN}✅ 포트 3100 사용 가능${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    fi
else
    echo -e "${YELLOW}⚠️ ss 명령어 없음 - 포트 확인 건너뜀${NC}"
fi

# Final results
echo -e "\n${BLUE}========================================"
echo -e "🎯 검증 결과 요약"
echo -e "========================================${NC}"

TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED))
SUCCESS_RATE=$((TESTS_PASSED * 100 / TOTAL_TESTS))

echo -e "총 테스트: $TOTAL_TESTS"
echo -e "${GREEN}통과: $TESTS_PASSED${NC}"
echo -e "${RED}실패: $TESTS_FAILED${NC}"
echo -e "성공률: $SUCCESS_RATE%"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 모든 테스트 통과! Docker 환경이 완벽히 설정되었습니다.${NC}"
    echo -e "\n${BLUE}다음 단계:${NC}"
    echo -e "1. ${YELLOW}./smart-setup.sh${NC} 실행하여 MCP 인프라 구성"
    echo -e "2. ${YELLOW}./start-mcp.sh${NC} 실행하여 서비스 시작"
    echo -e "3. ${YELLOW}curl http://localhost:3100/health${NC} 으로 상태 확인"
    exit 0
elif [ $SUCCESS_RATE -ge 80 ]; then
    echo -e "\n${YELLOW}⚠️ 대부분의 테스트는 통과했지만 일부 문제가 있습니다.${NC}"
    echo -e "\n${BLUE}권장 조치:${NC}"
    echo -e "1. Docker Desktop 재시작"
    echo -e "2. WSL Integration 설정 재확인"
    echo -e "3. 필요시 시스템 재부팅"
    exit 1
else
    echo -e "\n${RED}❌ 심각한 문제가 발견되었습니다.${NC}"
    echo -e "\n${BLUE}권장 조치:${NC}"
    echo -e "1. ${YELLOW}DOCKER-GUI-SETUP-GUIDE.md${NC} 가이드 재검토"
    echo -e "2. Docker Desktop WSL Integration 재설정"
    echo -e "3. Docker Desktop 완전 재설치 고려"
    exit 2
fi