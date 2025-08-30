# 🚀 Quick Start - 빠른 시작 가이드

## ⚠️ **중요: GitHub 클론 후 필수 설정**

GitHub에서 클론한 후 **반드시 아래 단계를 수행해야 합니다!**

---

## 📋 **사전 요구사항 체크리스트**

- [ ] Docker Desktop 설치 및 실행 중
- [ ] Git 설치됨
- [ ] Node.js 18+ 설치됨 (선택사항)
- [ ] Claude Code 설치됨 (나중에 설치 가능)

---

## 🎯 **Step 1: 저장소 클론**

```bash
# GitHub에서 클론
git clone https://github.com/DONGHO5270/enterprise-mcp-infrastructure
cd enterprise-mcp-infrastructure
```

---

## 🔧 **Step 2: Docker 이미지 빌드 (필수!)**

### **Windows PowerShell / Command Prompt**
```powershell
# Docker Desktop이 실행 중인지 확인
docker --version

# mcp-router 이미지 빌드
docker-compose -f docker/compose/docker-compose.yml build mcp-router

# 또는 전체 빌드
docker-compose -f docker/compose/docker-compose.yml build
```

### **macOS / Linux / WSL**
```bash
# Docker가 실행 중인지 확인
docker --version

# mcp-router 이미지 빌드
docker-compose -f docker/compose/docker-compose.yml build mcp-router

# 또는 전체 빌드
docker-compose -f docker/compose/docker-compose.yml build
```

---

## 🚀 **Step 3: MCP Router 시작**

```bash
# MCP Router 컨테이너 시작
docker-compose -f docker/compose/docker-compose.yml up -d mcp-router

# 로그 확인 (선택사항)
docker-compose -f docker/compose/docker-compose.yml logs -f mcp-router
```

---

## ✅ **Step 4: 설치 확인**

```bash
# Health check
curl http://localhost:3100/health

# 예상 응답:
{
  "status": "healthy",
  "router": "active",
  "services": 0,
  "message": "MCP Router is running. Install services using Claude Code."
}
```

### Windows PowerShell에서 curl이 없는 경우:
```powershell
# PowerShell 사용
Invoke-RestMethod -Uri "http://localhost:3100/health"
```

---

## 🎉 **Step 5: Claude Code로 MCP 서비스 설치**

```bash
# 프로젝트 폴더에서 Claude Code 실행
claude

# MCP 서비스 설치 예시
You> Install filesystem MCP
GitHub: https://github.com/modelcontextprotocol/servers/tree/main/filesystem

Claude> Installing filesystem MCP...
```

---

## 🔍 **문제 해결**

### **"docker-compose: command not found" 오류**
```bash
# Docker Desktop 설치 확인
# Docker Desktop에 Docker Compose가 포함되어 있음

# 또는 docker compose 사용 (새 버전)
docker compose build mcp-router
docker compose up -d mcp-router
```

### **"Cannot connect to Docker daemon" 오류**
1. Docker Desktop이 실행 중인지 확인
2. Windows: 시스템 트레이에서 Docker 아이콘 확인
3. macOS: 상단 메뉴바에서 Docker 아이콘 확인

### **포트 3100 이미 사용 중**
```bash
# 사용 중인 프로세스 확인
netstat -an | grep 3100

# Docker 컨테이너 정리
docker-compose -f docker/compose/docker-compose.yml down
docker-compose -f docker/compose/docker-compose.yml up -d mcp-router
```

### **빌드 실패 시**
```bash
# 클린 빌드
docker-compose -f docker/compose/docker-compose.yml down
docker system prune -f
docker-compose -f docker/compose/docker-compose.yml build --no-cache mcp-router
docker-compose -f docker/compose/docker-compose.yml up -d mcp-router
```

---

## 📊 **상태 모니터링**

```bash
# 실행 중인 컨테이너 확인
docker ps

# MCP Router 로그 보기
docker-compose -f docker/compose/docker-compose.yml logs mcp-router

# 실시간 로그 모니터링
docker-compose -f docker/compose/docker-compose.yml logs -f mcp-router
```

---

## 🎯 **다음 단계**

1. **MCP 서비스 설치**: Claude Code를 사용하여 필요한 MCP 서비스 설치
2. **프로젝트 연결**: 개발 프로젝트에서 MCP 서비스 사용 설정
3. **문서 참조**: README.md에서 자세한 사용법 확인

---

## ⚡ **5분 내 시작하기 요약**

```bash
# 1. 클론
git clone https://github.com/DONGHO5270/enterprise-mcp-infrastructure
cd enterprise-mcp-infrastructure

# 2. 빌드 (필수!)
docker-compose -f docker/compose/docker-compose.yml build mcp-router

# 3. 시작
docker-compose -f docker/compose/docker-compose.yml up -d mcp-router

# 4. 확인
curl http://localhost:3100/health

# 5. Claude Code 실행
claude
```

---

## 💡 **팁**

- Docker Desktop을 먼저 시작하세요
- 빌드는 처음 한 번만 하면 됩니다
- 이후에는 `docker-compose -f docker/compose/docker-compose.yml up -d`만 실행하면 됩니다
- 종료: `docker-compose -f docker/compose/docker-compose.yml down`