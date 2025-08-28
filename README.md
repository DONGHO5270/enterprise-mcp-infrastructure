# 🏗️ **통합 MCP 인프라 프레임워크**

> **빈 인프라 프레임워크 - 당신의 MCP 서비스를 위한 Docker 기반 관리 시스템**
> 
> ⚠️ **중요**: 이것은 빈 프레임워크입니다. MCP 서비스는 포함되지 않습니다.
> 사용자가 자신의 MCP 서비스를 추가하여 사용하는 인프라입니다.

[![Framework](https://img.shields.io/badge/Type-Infrastructure_Framework-yellow)](https://github.com/your-repo/mcp-infrastructure)
[![Docker](https://img.shields.io/badge/Docker-Required-blue)](https://www.docker.com/)
[![Terminal AI](https://img.shields.io/badge/Terminal-AI_Managed-orange)](https://github.com/your-repo/mcp-infrastructure)

---

## 🎯 **이 프로젝트는 무엇인가요?**

**통합 MCP 인프라**는 여러 MCP(Model Context Protocol) 서비스를 관리하기 위한 **빈 인프라 프레임워크**입니다.

### ✅ **프레임워크가 제공하는 것**
- 🤖 **터미널 점유 AI 관리**: Claude Code가 터미널을 통해 MCP 환경 관리
- 🐳 **Docker 오케스트레이션**: 모든 MCP 서비스를 컨테이너로 격리 실행
- 🚀 **온디맨드 아키텍처**: 필요한 서비스만 자동으로 시작/종료
- 🔌 **통합 라우터**: 단일 포트(3100)로 모든 서비스 접근
- 📝 **설정 템플릿**: MCP 서비스 추가를 위한 템플릿 제공

### ❌ **프레임워크가 제공하지 않는 것**
- ❌ **MCP 서비스**: 사용자가 직접 추가해야 함
- ❌ **API 키**: 각 서비스별 API 키는 직접 설정
- ❌ **사전 구성된 도구**: 빈 프레임워크로 도구 없음
- ❌ **즉시 사용 가능한 기능**: 서비스 설치 및 설정 필요

---

## 🤔 **왜 이 프레임워크가 필요한가요?**

### **문제: MCP 서비스 관리의 복잡성**
```
😰 여러 MCP 서비스를 어떻게 통합 관리하지?
🔧 각 서비스마다 다른 설정과 의존성...
💾 모든 서비스를 켜두면 리소스 낭비가 심각
🤯 서비스 간 충돌과 포트 관리가 복잡
```

### **해결: 통합 인프라 프레임워크**
```
✅ Docker로 모든 서비스 격리 및 표준화
✅ 온디맨드로 필요한 서비스만 실행
✅ 터미널 점유 AI가 자동으로 환경 관리
✅ 단일 라우터로 모든 서비스 통합 접근
```

---

## 🚀 **시작하기**

### **1단계: 프레임워크 설치**
```bash
# 저장소 클론
git clone https://github.com/your-repo/mcp-infrastructure
cd mcp-infrastructure

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

## 🏗️ **프레임워크 구조**

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

이 프레임워크 개선에 기여를 환영합니다:

1. 프레임워크 기능 개선
2. MCP 서비스 통합 가이드
3. 버그 수정 및 성능 개선

---

## ⚠️ **주의사항**

1. **이것은 빈 프레임워크입니다** - MCP 서비스를 직접 추가해야 합니다
2. **API 키 필요** - 각 서비스의 API 키는 직접 설정하세요
3. **Docker 필수** - Docker 없이는 작동하지 않습니다

---

## 📄 **라이선스**

MIT License - 자유롭게 사용, 수정, 배포 가능

---

**참고**: 이 프로젝트는 인프라 프레임워크입니다. 실제 MCP 서비스와 도구는 사용자가 추가해야 합니다.