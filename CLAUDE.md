# Language / 언어 선택

🇺🇸 [English](#english) | 🇰🇷 [한국어](#한국어)

---

<a name="english"></a>
# 🎯 Unified MCP Infrastructure Project Context

> This file is automatically read by Claude Code to understand project context.

## 🔒 Core Values (Immutable)

### Terminal-First AI Usage
- Claude Code takes over terminal to manage MCP environment in real-time
- Users interact continuously with AI through `claude` command
- No need to memorize traditional commands, control infrastructure with natural language
- **This is not just a feature, but the reason this project exists**

### Start from Empty Infrastructure
- Users selectively add only desired MCPs
- Integrate all MCP services with Docker containers
- Install once, share across all projects
- Optimize resources with on-demand execution

---

## 📋 Role of This Infrastructure

### 1. MCP Service Installation (Docker Containerization)
```
You> Install [desired MCP name]
GitHub: [GitHub URL of the MCP]

You> Install [another MCP name]
GitHub: [GitHub URL of the MCP]
```

### 2. MCP Configuration for Development Projects (Important!)
```
# ⚠️ Must run from enterprise-mcp-infrastructure folder
You> Configure my project /home/user/my-project to use installed MCPs
You> Add MCP configuration to /path/to/another-project too
```

### 3. Managing Installed MCPs
```
You> Show installed MCP list
You> Check Docker container status
You> Restart MCP service
You> Test port 3100 connection
You> Show specific MCP logs
You> Check memory usage
```

### 4. System Monitoring
```
You> Check router status
You> Show on-demand timer status
You> Diagnose Docker network
```

---

## ⚠️ Important: Difference Between Installation and Configuration

**Installation (once in this infrastructure)**:
- Run MCP in Docker container
- Provide permanently on port 3100
- Shareable across all projects

**Configuration (in each usage environment)**:
- Claude Code: Requires per-project configuration
- Claude Desktop: Global configuration once
- Only add configuration pointing to installed MCP

---

## 🛠️ Project Structure

```
enterprise-mcp-infrastructure/
├── services/
│   ├── mcp-router/        # Core router (included)
│   └── mcp/              # MCP services (user adds)
├── docker/
│   └── compose/
│       └── docker-compose-mcp-ondemand.yml
├── CLAUDE.md            # This file (auto-load)
└── README.md            # Project documentation
```

---

## ⚙️ Environment Configuration

### Docker Status
- **Router Port**: 3100 (external access)
- **Network**: mcp-network (container communication)
- **On-demand**: Auto-shutdown after 60 seconds idle
- **Resources**: Start services only when needed

### API Key Configuration (per MCP as needed)
```bash
# Set environment variables per MCP service
export SERVICE_API_KEY="your-api-key"
export ANOTHER_SERVICE_TOKEN="your-token"
# Add environment variables needed per service
```

---

## 📝 Current Infrastructure Status

### Completed Base System
- [x] Docker infrastructure ready
- [x] MCP Router running (port 3100)
- [x] On-demand architecture implemented
- [x] Container networking configured

### User Addition Areas
- [ ] Docker install desired MCP services
- [ ] Configure MCP connections in individual projects

---

## 🎯 How to Utilize Infrastructure

### Add MCP with Terminal-First AI
```bash
You> Install [desired MCP name]
GitHub: [GitHub URL of the MCP]

# Claude automatically:
# 1. Clone repository
# 2. Containerize with Docker
# 3. Connect to port 3100 router
# 4. Ready to use (after configuration)
```

### Development Project MCP Configuration (Important!)
```bash
# ⚠️ Must run from this infrastructure folder
cd enterprise-mcp-infrastructure
claude

# Request project configuration
You> Configure my project /path/to/my-project for MCP

# Claude automatically creates and configures .clauderc
```

### Usage in Development Projects
- **Claude Code**: Configure `.clauderc` per project (using method above)
- **Claude Desktop**: Global config once, then use in all projects
- **Common**: Access installed MCPs through http://localhost:3100

---

**💡 Tip**: Modify this file to fit your project. Claude Code can have better context.

---

<a name="한국어"></a>
# 🎯 통합 MCP 인프라 프로젝트 컨텍스트

> 이 파일은 Claude Code가 자동으로 읽어 프로젝트 컨텍스트를 파악합니다.

## 🔒 핵심 가치 (절대 불변)

### 터미널 점유 AI 기반 사용
- Claude Code가 터미널을 점유하여 MCP 환경을 실시간 관리
- 사용자는 `claude` 명령으로 AI와 지속적 상호작용
- 전통적 명령어 암기 불필요, 자연어로 인프라 제어
- **이는 단순한 기능이 아닌 프로젝트의 존재 이유**

### 빈 인프라에서 시작
- 사용자가 원하는 MCP만 선택적으로 추가
- Docker 컨테이너로 모든 MCP 서비스 통합
- 설치는 1회만, 모든 프로젝트에서 공유
- 온디맨드 실행으로 리소스 최적화

---

## 📋 이 인프라의 역할

### 1. MCP 서비스 설치 (Docker 컨테이너화)
```
You> [원하는 MCP명] 설치해줘
GitHub: [해당 MCP의 GitHub URL]

You> [다른 MCP명] 설치해줘  
GitHub: [해당 MCP의 GitHub URL]
```

### 2. 개발 프로젝트에 MCP 설정 (중요!)
```
# ⚠️ 반드시 enterprise-mcp-infrastructure 폴더에서 실행
You> 내 프로젝트 /home/user/my-project에 설치된 MCP들 사용할 수 있게 설정해줘
You> /path/to/another-project에도 MCP 설정 추가해줘
```

### 3. 설치된 MCP 관리
```
You> 설치된 MCP 목록 보여줘
You> Docker 컨테이너 상태 확인해줘
You> MCP 서비스 재시작해줘
You> 포트 3100 연결 테스트해줘
You> 특정 MCP 로그 보여줘
You> 메모리 사용량 확인해줘
```

### 4. 시스템 모니터링
```
You> 라우터 상태 확인해줘
You> 온디맨드 타이머 상태 보여줘
You> Docker 네트워크 진단해줘
```

---

## ⚠️ 중요: 설치와 설정의 차이

**설치 (이 인프라에서 1회)**:
- Docker 컨테이너로 MCP 실행
- 포트 3100에서 영구 제공
- 모든 프로젝트에서 공유 가능

**설정 (각 사용 환경에서)**:
- Claude Code: 프로젝트별 설정 필요
- Claude Desktop: 전역 설정 1회
- 설치된 MCP를 가리키는 설정만 추가

---

## 🛠️ 프로젝트 구조

```
enterprise-mcp-infrastructure/
├── services/
│   ├── mcp-router/        # 핵심 라우터 (포함됨)
│   └── mcp/              # MCP 서비스들 (사용자가 추가)
├── docker/
│   └── compose/
│       └── docker-compose-mcp-ondemand.yml
├── CLAUDE.md            # 이 파일 (자동 로드용)
└── README.md            # 프로젝트 문서
```

---

## ⚙️ 환경 설정

### Docker 상태
- **라우터 포트**: 3100 (외부 접근용)
- **네트워크**: mcp-network (컨테이너 간 통신)
- **온디맨드**: 60초 유휴 시 자동 종료
- **리소스**: 필요시에만 서비스 시작

### API 키 설정 (MCP별로 필요시)
```bash
# 각 MCP 서비스별 환경 변수 설정
export SERVICE_API_KEY="your-api-key"
export ANOTHER_SERVICE_TOKEN="your-token"
# 서비스별로 필요한 환경 변수 추가
```

---

## 📝 현재 인프라 상태

### 완료된 기반 시스템
- [x] Docker 인프라 준비 완료
- [x] MCP Router 구동 중 (포트 3100)
- [x] 온디맨드 아키텍처 구현 완료
- [x] 컨테이너 간 네트워킹 설정 완료

### 사용자 추가 영역
- [ ] 원하는 MCP 서비스 Docker 설치
- [ ] 개별 프로젝트에서 MCP 연결 설정

---

## 🎯 인프라 활용 방법

### 터미널 점유 AI로 MCP 추가
```bash
You> [원하는 MCP명] 설치해줘
GitHub: [해당 MCP의 GitHub URL]

# Claude가 자동으로:
# 1. 저장소 클론
# 2. Docker 컨테이너화  
# 3. 포트 3100 라우터 연결
# 4. 사용 준비 완료 (설정 후 사용)
```

### 개발 프로젝트 MCP 설정 (중요!)
```bash
# ⚠️ 반드시 이 인프라 폴더에서 실행
cd enterprise-mcp-infrastructure
claude

# 프로젝트 설정 요청
You> 내 프로젝트 /path/to/my-project에 MCP 설정해줘

# Claude가 자동으로 .clauderc 생성 및 설정
```

### 개발 프로젝트에서 활용
- **Claude Code**: 각 프로젝트에 `.clauderc` 설정 (위 방법으로)
- **Claude Desktop**: 전역 config 1회 설정 후 모든 프로젝트 사용
- **공통**: 설치된 MCP들을 http://localhost:3100 통해 접근

---

**💡 Tip**: 이 파일을 프로젝트에 맞게 수정하세요. Claude Code가 더 나은 컨텍스트를 가질 수 있습니다.