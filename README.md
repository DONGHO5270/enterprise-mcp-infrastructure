# 🎯 **통합 MCP 관리시스템**

> **모든 MCP 서비스를 하나의 강력한 인프라로 통합 관리**
> 
> 터미널 점유 AI 관리 · Docker 격리 실행 · 온디맨드 리소스 최적화
> 
> 💡 **참고**: MCP 서비스는 사용자가 필요에 따라 선택하여 추가합니다.

[![Platform](https://img.shields.io/badge/Type-Management_System-green)](https://github.com/DONGHO5270/enterprise-mcp-infrastructure)
[![Docker](https://img.shields.io/badge/Docker-Orchestration-blue)](https://www.docker.com/)
[![Terminal AI](https://img.shields.io/badge/Terminal-AI_Managed-orange)](https://github.com/DONGHO5270/enterprise-mcp-infrastructure)
[![Architecture](https://img.shields.io/badge/Architecture-OnDemand-success)](https://github.com/DONGHO5270/enterprise-mcp-infrastructure)

---

## 🎯 **이 프로젝트는 무엇인가요?**

**통합 MCP 관리시스템**은 여러 MCP(Model Context Protocol) 서비스를 Docker 기반으로 통합 관리하는 **강력한 오케스트레이션 플랫폼**입니다.

### ✅ **시스템이 제공하는 핵심 기능**
- 🤖 **터미널 점유 AI 관리**: Claude Code가 터미널을 통해 MCP 환경 관리
- 🐳 **Docker 오케스트레이션**: 모든 MCP 서비스를 컨테이너로 격리 실행
- 🚀 **온디맨드 아키텍처**: 필요한 서비스만 자동으로 시작/종료
- 🔌 **통합 라우터**: 단일 포트(3100)로 모든 서비스 접근
- 📝 **설정 템플릿**: MCP 서비스 추가를 위한 템플릿 제공

### 📦 **사용자가 추가하는 것**
- 📌 **MCP 서비스**: 필요한 서비스를 선택하여 추가
- 🔑 **API 키**: 각 서비스별 API 키 설정
- 🎯 **커스텀 도구**: 프로젝트에 맞는 MCP 선택
- ⚙️ **환경 설정**: 서비스별 세부 설정

---

## 🤔 **왜 이 관리시스템이 필요한가요?**

### **문제: MCP 서비스 관리의 복잡성**
```
😰 여러 MCP 서비스를 어떻게 통합 관리하지?
🔧 각 서비스마다 다른 설정과 의존성...
💾 모든 서비스를 켜두면 리소스 낭비가 심각
🤯 서비스 간 충돌과 포트 관리가 복잡
```

### **해결: 통합 MCP 관리시스템**
```
✅ Docker로 모든 서비스 격리 및 표준화
✅ 온디맨드로 필요한 서비스만 실행
✅ 터미널 점유 AI가 자동으로 환경 관리
✅ 단일 라우터로 모든 서비스 통합 접근
```

---

## 🚀 **시작하기**

### **1단계: 시스템 설치**
```bash
# 저장소 클론
git clone https://github.com/DONGHO5270/enterprise-mcp-infrastructure
cd enterprise-mcp-infrastructure

# Docker 컨테이너 빌드
docker-compose build

# 라우터 시작
docker-compose up -d mcp-router
```

### **2단계: 당신의 MCP 서비스 추가**
```bash
# services/mcp/ 디렉토리에 서비스 추가
cp -r your-mcp-service services/mcp/

# 설정 파일 업데이트
# services/mcp-router/src/config/mcp-services.ts 편집
```

### **3단계: 터미널 점유 AI 사용**
```bash
# Claude Code로 터미널 점유
claude

# AI와 대화하며 MCP 관리
"내 {your-service} MCP 서비스 시작해줘"
"현재 실행 중인 서비스 상태 확인"
```

---

## 🏗️ **시스템 구조**

```
mcp-infrastructure/
├── services/
│   ├── mcp-router/        # 핵심 라우터 (포함됨)
│   │   ├── src/
│   │   └── Dockerfile
│   └── mcp/              # 여기에 당신의 MCP 추가
│       └── .gitkeep      # 빈 디렉토리
├── docker/
│   └── compose/
│       └── docker-compose.yml
├── scripts/
│   └── add-mcp-service.sh  # MCP 추가 도우미
└── README.md
```

---

## 💡 **사용 예시**

### **당신의 MCP 서비스 추가하기**
```javascript
// services/mcp-router/src/config/mcp-services.ts
export const MCP_SERVICES = {
  '{your-service}': {
    name: '{your-service}',
    command: 'node',
    args: ['./services/mcp/{your-service}/index.js'],
    env: {
      API_KEY: process.env.YOUR_API_KEY
    }
  }
};
```

### **터미널에서 사용**
```bash
# 서비스 테스트
curl -X POST http://localhost:3100/mcp/{your-service} \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list"}'
```

---

## ⚙️ **주요 기능**

### **1. 터미널 점유 AI 관리**
- Claude Code가 터미널을 점유하여 실시간 MCP 관리
- 자연어로 서비스 제어 및 모니터링

### **2. 온디맨드 실행**
- 60초 유휴 시 자동 종료
- 메모리 사용량 최대 85% 절감

### **3. Docker 격리**
- 서비스 간 완벽한 격리
- 의존성 충돌 방지

---

## 📋 **요구사항**

- Docker 20.10+
- Docker Compose 2.0+
- Node.js 18+ (선택사항)
- WSL2 (Windows 사용자)

---

## 🛠️ **설정 가이드**

### **환경 변수 설정**
```bash
# .env 파일 생성
cp .env.example .env

# API 키 추가 (당신의 서비스에 필요한 경우)
echo "YOUR_API_KEY=your-key-here" >> .env
```

### **MCP 서비스 템플릿**
```javascript
// 새 MCP 서비스 추가 템플릿
{
  name: 'service-name',
  command: 'node',
  args: ['path/to/service'],
  env: {},
  startupTimeout: 5000
}
```

---

## 🤝 **기여하기**

이 관리시스템 개선에 기여를 환영합니다:

1. 시스템 기능 개선
2. MCP 서비스 통합 가이드
3. 버그 수정 및 성능 개선

---

## ⚠️ **주의사항**

1. **MCP 서비스는 직접 추가** - 필요한 서비스를 선택하여 통합하세요
2. **API 키 설정 필요** - 각 서비스별 인증 정보는 직접 구성하세요
3. **Docker 환경 필수** - 모든 서비스는 Docker 컨테이너로 실행됩니다

---

## 📄 **라이선스**

MIT License - 자유롭게 사용, 수정, 배포 가능

---

**참고**: 이 프로젝트는 MCP 서비스 통합 관리시스템입니다. 실제 MCP 서비스는 사용자가 필요에 따라 선택하여 추가합니다.