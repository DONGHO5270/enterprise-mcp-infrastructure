# 🚀 Stop Choosing. Start Building.

> **Only 3-5 MCPs in Claude Desktop? Token overflow in Cursor AI?**  
> **Build unified infrastructure for all your MCP services**
> 
> Massive token savings · On-demand execution · Docker-based unified infrastructure
> 
> ⚠️ **Note**: This is an infrastructure framework. MCP services are not included - you add your own.

[![Choice Liberation](https://img.shields.io/badge/Choice_Liberation-Stop_Choosing-brightgreen)](https://github.com/DONGHO5270/enterprise-mcp-infrastructure)
[![Token Savings](https://img.shields.io/badge/Token_Savings-Optimized-blue)](https://github.com/DONGHO5270/enterprise-mcp-infrastructure)
[![Unified Infrastructure](https://img.shields.io/badge/Unified_Infrastructure-Docker-success)](https://github.com/DONGHO5270/enterprise-mcp-infrastructure)

---

## 💔 **Have you experienced these problems?**

### **Claude Desktop Users**
```
😰 "Which MCP services should I choose from so many options?"
😤 "Can only activate a few due to token limits..."
🔄 "Constantly turning MCPs on and off is so tedious"
💭 "Found a new MCP but what should I give up?"
```

### **Cursor AI Users** 
```
💸 "Token overflow after installing MCPs"
📉 "AI response quality dropped significantly..."
⚠️ "Not enough tokens for actual coding"
😵 "Ended up disabling all MCPs, what's the point?"
```

### **General Developers**
```
🤯 "Too many MCPs, where do I even start?"
📚 "Installing and configuring each one is too complex"
🎯 "What's the perfect MCP combination for my project?"
```

---

## ✅ **No More Selection Fatigue**

### **🎯 Before: Choice Paralysis**
```
❌ Agonizing over which MCP services to choose
❌ Limited to a few MCPs due to token constraints
❌ Need to change settings every time
❌ Have to give up existing ones for new MCPs
❌ Trial and error to find optimal combination
```

### **🚀 After: Liberation from Choice**
```
✅ Unified management for all MCP services you add
✅ Maximize token efficiency for more work
✅ On-demand execution activates only needed services
✅ Isolated Docker containers prevent conflicts
✅ Instant access to your MCPs via API calls
```

---

## ⚡ **Detailed Installation Guide**

### **📋 Prerequisites**
```bash
# Check required software
docker --version  # Docker 20.10+ required
docker-compose --version  # Docker Compose 2.0+ required

# Verify Docker is running
docker ps  # Docker must be running
```

### **🚀 Step 1: Clone Repository & Basic Setup**
```bash
# 1. Clone repository
git clone https://github.com/DONGHO5270/enterprise-mcp-infrastructure
cd enterprise-mcp-infrastructure

# 2. Verify project structure
ls -la  # Should see docker/, services/, scripts/ folders

# 3. Configure environment variables (optional - for services requiring API keys)
cp configs/api-keys.env.example configs/api-keys.env
nano configs/api-keys.env  # Or use your preferred editor

# Example API key configuration:
# GITHUB_TOKEN=ghp_your_token_here
# ANTHROPIC_API_KEY=sk-ant-your_key_here
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_KEY=your_supabase_key
# VERCEL_TOKEN=your_vercel_token
# CLOUDFLARE_API_TOKEN=your_cloudflare_token
```

### **🐳 Step 2: Build and Run Docker Containers**
```bash
# 1. Build Docker images (5-10 minutes on first run)
docker-compose -f docker/compose/docker-compose-mcp-ondemand.yml build

# 2. Run services in background
docker-compose -f docker/compose/docker-compose-mcp-ondemand.yml up -d

# 3. Verify services are running (wait ~30 seconds)
docker-compose -f docker/compose/docker-compose-mcp-ondemand.yml ps
# All services should show "Up" status

# 4. Check logs (if issues occur)
docker-compose -f docker/compose/docker-compose-mcp-ondemand.yml logs -f mcp-router
```

### **✅ Step 3: Installation Verification**
```bash
# 1. Health check
curl http://localhost:3100/health
# Success response: {"status":"healthy","router":"running"} 

# 2. Infrastructure is ready - now add your MCP services
# See docs/ADDING-MCP-SERVICES.md for guide

# 3. After adding services, test them:
curl -X POST http://localhost:3100/mcp/{your-service} \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":"test","method":"tools/list","params":{}}'
# Returns tools list if service is properly configured

```

### **🎯 Step 4: Platform-Specific Integration**

#### **Claude Desktop Users (Windows/Mac)**
```bash
# 1. Backup existing MCP configuration
cp ~/.claude/config.json ~/.claude/config.json.backup

# 2. Find config file location
# Mac/Linux: ~/.claude/config.json
# Windows: %APPDATA%\Claude\config.json

# 3. Edit config.json
{
  "mcpServers": {
    "unified-mcp": {
      "command": "docker",
      "args": ["exec", "-i", "mcp-router", "node", "/app/stdio-bridge.js"]
    }
  }
}

# 4. Restart Claude Desktop
# 5. Test: Type "List available MCP tools" in Claude
```

#### **Claude Code (WSL) Users**
```bash
# 1. Navigate to project directory
cd /mnt/c/claude-development/unified-mcp-infrastructure

# 2. Verify CLAUDE.md exists (auto-loaded)
ls CLAUDE.md  # File should exist

# 3. Run Claude Code
claude  # Running from current directory auto-loads CLAUDE.md

# 4. Test command
# In Claude: "Check available MCP services"
```

#### **Cursor AI Users**
```bash
# 1. Create .cursor folder in project root
mkdir -p .cursor

# 2. Create MCP configuration file
cat > .cursor/mcp.json << 'EOF'
{
  "servers": {
    "unified-mcp": {
      "url": "http://localhost:3100",
      "enabled": true
    }
  }
}
EOF

# 3. Restart Cursor
# 4. Verify in: Cursor Settings > MCP section
```

### **🔧 Step 5: Usage**

#### **Direct API Calls**
```bash
# List tools
curl -X POST http://localhost:3100/mcp/vercel \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":"1","method":"tools/list","params":{}}'

# Execute tool example (list Vercel projects)
curl -X POST http://localhost:3100/mcp/vercel \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "id":"2",
    "method":"tools/call",
    "params":{
      "name":"list_projects",
      "arguments":{}
    }
  }'
```

#### **Usage in Claude/Cursor**
```
User: "Use npm-sentinel to check vulnerabilities in my project"
AI: I'll check using npm-sentinel MCP service...

User: "Show Docker container list"  
AI: I'll check containers using Docker MCP...
```

---

## 🏆 **Why Selection Fatigue Disappears**

### **🧠 Power of On-Demand Architecture**
```
Traditional MCP approach:
- All MCPs always running → Massive token occupation
- Insufficient tokens for actual work → Degraded AI quality

Our infrastructure approach:
- Only services you need run → Minimal token usage
- More tokens for actual work → Improved AI quality
- Significant memory savings → Reduced system load
- Tested with 334 tools across 23 services → Proven scalability
```

### **🎯 Real-World Usage Scenarios**

#### **Web Development Project**
```bash
# Call required services
curl -X POST http://localhost:3100/mcp/vercel    # Deployment
curl -X POST http://localhost:3100/mcp/supabase  # Database
curl -X POST http://localhost:3100/mcp/github    # Code management

# Benefits:
- On-demand: Only needed services activate
- Traditional: All services always running
- Massive improvement in token efficiency
```

#### **DevOps Tasks**
```bash
# Activate only required services
curl -X POST http://localhost:3100/mcp/docker      # Containers
curl -X POST http://localhost:3100/mcp/cloudflare  # DNS/CDN

# Benefits:
- Minimal resource usage
- Services activate only when needed
- Auto-cleanup after task completion
```

#### **Mobile Development**
```bash
# Mobile testing services
curl -X POST http://localhost:3100/mcp/mobile     # App testing
curl -X POST http://localhost:3100/mcp/playwright # UI testing

# Benefits:
- Lightweight execution
- Fast response time
- Efficient resource management
```

---

## 📊 **Benefits of On-Demand Architecture**

### **💡 Key Benefits**
- **Token Efficiency**: Dramatically reduced token usage with on-demand execution
- **Memory Savings**: Resource optimization by running only needed services
- **Fast Response**: Quick service response with lightweight architecture
- **Flexible Extension**: Easily add new MCP services

### **🚀 User Experience**
```
"No more agonizing over which MCP to choose.
Just call what you need via API."

"I can now use all the MCPs I gave up due to token overflow."

"Managing MCPs is so much easier with unified infrastructure."
```

---

## 🛠️ **Unified MCP Service Structure**

### **📦 Example MCP Services You Can Add**

**Note**: These are examples of services tested with this infrastructure. You need to add the ones you want to use.

#### **Development Tools**
- **Vercel**: Web app deployment and hosting
- **Docker**: Container management
- **GitHub**: Source code management
- **npm-sentinel**: Package security scanning

#### **Database & Backend**
- **Supabase**: Database, authentication, storage
- **Cloudflare**: DNS, CDN, cache management

#### **Testing & Automation**
- **Playwright**: Browser automation
- **Mobile**: Mobile app testing
- **Desktop Commander**: Desktop automation

#### **AI & Analytics**
- **Clear Thought**: Structured thinking analysis
- **Taskmaster AI**: AI-based task management
- **Serena**: Code search and analysis

**All services you add become accessible via `/mcp/{service-name}` endpoints**

---

## 🎯 **How It Actually Works**

### **Scenario: Deploy React App to Vercel with Supabase**

#### **Traditional MCP Usage (Token Overload)**
```
1. 🤔 Can only select 3-5 MCPs in Claude Desktop
2. 🔍 Configure Vercel MCP → Give up other MCPs
3. 🔧 Need to restart every configuration change
4. 💭 Need Supabase too but have to sacrifice another
5. 😰 Massive token occupation limits actual work
6. ⏰ Takes 20+ minutes just for MCP selection and setup
```

#### **Unified Infrastructure (Token Efficiency)**
```bash
# 1. Run unified infrastructure with Docker (once)
docker-compose up -d

# 2. Call needed service APIs
curl -X POST http://localhost:3100/mcp/vercel \
  -d '{"method":"tools/call","params":{"name":"deploy"}}'

curl -X POST http://localhost:3100/mcp/supabase \
  -d '{"method":"tools/call","params":{"name":"create_database"}}'

# Results:
✅ On-demand execution of only needed services
✅ Token usage: Significantly reduced
✅ Memory: Minimal usage vs traditional approach
✅ Instantly available (no configuration changes)
```

---

## 🏗️ **On-Demand Architecture**

### **🧠 Efficient Resource Management**
```
┌─────────────────────────────────────────────────┐
│           MCP Router (Port 3100)                 │
│         Unified API Endpoint                     │
├─────────────────────────────────────────────────┤
│         On-Demand Process Manager                │
│      Start/Stop Services Only When Needed        │
├─────────────────────────────────────────────────┤
│   Active: Only Required  |  Idle: Rest          │
│   Memory: Minimal        |  Memory: 0           │
│   Tokens: Minimal        |  Tokens: 0           │
└─────────────────────────────────────────────────┘
```

### **⚡ Performance Optimization**
- **Fast Response**: Millisecond-level response
- **Memory Savings**: Massive reduction vs always-on
- **Instant Start**: Services activate immediately when needed
- **Auto Cleanup**: Automatic resource release after use

---

## 🚀 **Get Started Now**

### **⚡ Quick Start (10-15 minutes)**
```bash
# 1. Clone repository
git clone https://github.com/DONGHO5270/enterprise-mcp-infrastructure
cd enterprise-mcp-infrastructure

# 2. Build and run Docker
docker-compose -f docker/compose/docker-compose-mcp-ondemand.yml build
docker-compose -f docker/compose/docker-compose-mcp-ondemand.yml up -d

# 3. Verify (after 30 seconds)
curl http://localhost:3100/health

# 4. Configure for your platform (see Step 4 above)
```

### **❓ Troubleshooting**
```bash
# Docker permission issues
sudo usermod -aG docker $USER  # Linux/WSL
# Logout and login again

# Port 3100 conflict
lsof -i :3100  # Mac/Linux
netstat -ano | findstr :3100  # Windows
# Kill conflicting process and restart

# Restart services
docker-compose -f docker/compose/docker-compose-mcp-ondemand.yml down
docker-compose -f docker/compose/docker-compose-mcp-ondemand.yml up -d
```

---

## 📈 **Expected Benefits**

### **Immediate Improvements**
- ✅ **No More MCP Selection Anxiety**: All services integrated
- ✅ **Token Efficiency**: On-demand execution saves tokens
- ✅ **Faster Installation**: Docker-based batch installation
- ✅ **Easier Management**: Single endpoint for all services

### **Long-term Benefits**
- 📊 **Increased Productivity**: Save time on MCP selection/configuration
- 🚀 **Scalability**: Easily add new MCPs
- ⏰ **Simplified Maintenance**: Docker-based unified management
- 😊 **Better Developer Experience**: Use any tool instantly

---

## 🤝 **Community & Support**

### **Get Help**
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/DONGHO5270/enterprise-mcp-infrastructure/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/DONGHO5270/enterprise-mcp-infrastructure/discussions)
- 📖 **Documentation**: See `/docs` folder in project

### **Contributing**
- Add new MCP services
- Bug fixes and improvements
- Documentation improvements
- Pull Requests welcome!

---

<div align="center">

## 🎉 **Stop Choosing. Start Building.**

```bash
git clone https://github.com/DONGHO5270/enterprise-mcp-infrastructure
cd enterprise-mcp-infrastructure && docker-compose up -d
```

**[📖 GitHub](https://github.com/DONGHO5270/enterprise-mcp-infrastructure) | [🐛 Issues](https://github.com/DONGHO5270/enterprise-mcp-infrastructure/issues) | [💬 Discussions](https://github.com/DONGHO5270/enterprise-mcp-infrastructure/discussions)**

### 💡 *"Stop choosing. Start building."*

⭐ **If this infrastructure saved you time, please consider giving it a star to help others discover it.**

</div>

---

## 📄 **License**

### **🆓 Open Source (MIT)**
- Personal projects ✅
- Education and research ✅  
- Small teams (≤5 developers) ✅

### **🏢 Commercial License**
- Enterprise use (>5 developers)
- SaaS platform integration
- Private modifications and redistribution
- Annual license (contact for pricing)

**Contact**: [GitHub Discussions](https://github.com/DONGHO5270/enterprise-mcp-infrastructure/discussions) or create an Issue

---

*This project is a unified MCP infrastructure that allows you to use various MCP services and tools without the burden of choice.*

---
---

# 🚀 Stop Choosing. Start Building.

> **Claude Desktop에서 3-5개만? Cursor AI에서 토큰 오버플로우?**  
> **모든 MCP 서비스를 위한 통합 인프라를 구축하세요**
> 
> 토큰 대폭 절약 · 온디맨드 실행 · Docker 기반 통합 인프라
> 
> ⚠️ **참고**: 이것은 인프라 프레임워크입니다. MCP 서비스는 포함되지 않으며 직접 추가해야 합니다.

[![선택 해방](https://img.shields.io/badge/Choice_Liberation-Stop_Choosing-brightgreen)](https://github.com/DONGHO5270/enterprise-mcp-infrastructure)
[![토큰 절약](https://img.shields.io/badge/Token_Savings-Optimized-blue)](https://github.com/DONGHO5270/enterprise-mcp-infrastructure)
[![통합 인프라](https://img.shields.io/badge/Unified_Infrastructure-Docker-success)](https://github.com/DONGHO5270/enterprise-mcp-infrastructure)

---

## 💔 **이런 고민 해본 적 있으세요?**

### **Claude Desktop 사용자**
```
😰 "수많은 MCP 서비스 중 어떤 걸 선택해야 할까?"
😤 "토큰 한계 때문에 몇 개만 활성화 가능한데..."
🔄 "필요할 때마다 MCP 켜고 끄고... 너무 번거로워"
💭 "새로운 MCP 발견했는데 뭘 포기해야 하지?"
```

### **Cursor AI 사용자** 
```
💸 "MCP 설치했더니 토큰 오버플로우 발생"
📉 "AI 응답 품질이 너무 떨어져..."
⚠️ "실제 코딩할 토큰이 부족해"
😵 "결국 MCP 다 껐는데 의미가 있나?"
```

### **일반 개발자**
```
🤯 "MCP가 너무 많아서 뭐부터 시작해야 할지..."
📚 "각각 설치하고 설정하는 게 너무 복잡해"
🎯 "내 프로젝트에 딱 맞는 MCP 조합은?"
```

---

## ✅ **이제 선택 고민은 끝**

### **🎯 Before: 선택의 피로감**
```
❌ 수많은 MCP 서비스 중 어떤 것을 선택할까 고민
❌ 토큰 한계로 몇 개 MCP만 사용 가능
❌ 필요할 때마다 설정 변경 필요
❌ 새로운 MCP 발견 시 기존 것 포기
❌ 최적 조합 찾기 위한 시행착오
```

### **🚀 After: 선택 해방**
```
✅ 추가한 모든 MCP 서비스를 통합 관리
✅ 토큰 효율성 극대화로 더 많은 작업 가능
✅ 온디맨드 실행으로 필요한 서비스만 활성화
✅ Docker 컨테이너로 충돌 없는 격리 환경
✅ API 호출로 추가한 MCP 서비스 즉시 사용
```

---

## ⚡ **상세 설치 가이드**

### **📋 사전 준비사항**
```bash
# 필수 소프트웨어 확인
docker --version  # Docker 20.10+ 필요
docker-compose --version  # Docker Compose 2.0+ 필요

# Docker 실행 상태 확인
docker ps  # Docker가 실행 중이어야 함
```

### **🚀 Step 1: 저장소 클론 및 기본 설정**
```bash
# 1. 저장소 클론
git clone https://github.com/DONGHO5270/enterprise-mcp-infrastructure
cd enterprise-mcp-infrastructure

# 2. 프로젝트 구조 확인
ls -la  # docker/, services/, scripts/ 폴더가 보여야 함

# 3. 환경 변수 설정 (선택사항 - API 키가 필요한 서비스용)
cp configs/api-keys.env.example configs/api-keys.env
nano configs/api-keys.env  # 또는 원하는 편집기 사용

# 필요한 API 키 설정 예시:
# GITHUB_TOKEN=ghp_your_token_here
# ANTHROPIC_API_KEY=sk-ant-your_key_here
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_KEY=your_supabase_key
# VERCEL_TOKEN=your_vercel_token
# CLOUDFLARE_API_TOKEN=your_cloudflare_token
```

### **🐳 Step 2: Docker 컨테이너 빌드 및 실행**
```bash
# 1. Docker 이미지 빌드 (첫 실행 시 5-10분 소요)
docker-compose -f docker/compose/docker-compose-mcp-ondemand.yml build

# 2. 백그라운드에서 서비스 실행
docker-compose -f docker/compose/docker-compose-mcp-ondemand.yml up -d

# 3. 서비스 시작 확인 (30초 정도 대기 필요)
docker-compose -f docker/compose/docker-compose-mcp-ondemand.yml ps
# 모든 서비스가 "Up" 상태여야 함

# 4. 로그 확인 (문제 발생 시)
docker-compose -f docker/compose/docker-compose-mcp-ondemand.yml logs -f mcp-router
```

### **✅ Step 3: 설치 검증**
```bash
# 1. 헬스 체크
curl http://localhost:3100/health
# 성공 응답: {"status":"healthy","router":"running"} 

# 2. 인프라 준비 완료 - 이제 MCP 서비스를 추가하세요
# docs/ADDING-MCP-SERVICES.md 가이드 참조

# 3. 서비스 추가 후 테스트:
curl -X POST http://localhost:3100/mcp/{your-service} \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":"test","method":"tools/list","params":{}}'
# 서비스가 제대로 설정되면 도구 목록 반환

```

### **🎯 Step 4: 플랫폼별 연동 설정**

#### **Claude Desktop 사용자 (Windows/Mac)**
```bash
# 1. 기존 MCP 설정 백업
cp ~/.claude/config.json ~/.claude/config.json.backup

# 2. 설정 파일 위치 찾기
# Mac/Linux: ~/.claude/config.json
# Windows: %APPDATA%\Claude\config.json

# 3. config.json 수정
{
  "mcpServers": {
    "unified-mcp": {
      "command": "docker",
      "args": ["exec", "-i", "mcp-router", "node", "/app/stdio-bridge.js"]
    }
  }
}

# 4. Claude Desktop 재시작
# 5. 테스트: Claude에서 "List available MCP tools" 입력
```

#### **Claude Code (WSL) 사용자**
```bash
# 1. 프로젝트 디렉토리로 이동
cd /mnt/c/claude-development/unified-mcp-infrastructure

# 2. CLAUDE.md 파일 확인 (자동 로드됨)
ls CLAUDE.md  # 파일이 있어야 함

# 3. Claude Code 실행
claude  # 현재 디렉토리에서 실행하면 CLAUDE.md 자동 로드

# 4. 테스트 명령
# Claude에서: "mcp 서비스 목록 확인해줘" 입력
```

#### **Cursor AI 사용자**
```bash
# 1. 프로젝트 루트에 .cursor 폴더 생성
mkdir -p .cursor

# 2. MCP 설정 파일 생성
cat > .cursor/mcp.json << 'EOF'
{
  "servers": {
    "unified-mcp": {
      "url": "http://localhost:3100",
      "enabled": true
    }
  }
}
EOF

# 3. Cursor 재시작
# 4. 설정 확인: Cursor Settings > MCP 섹션
```

### **🔧 Step 5: 사용 방법**

#### **API 직접 호출**
```bash
# 도구 목록 확인
curl -X POST http://localhost:3100/mcp/vercel \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":"1","method":"tools/list","params":{}}'

# 도구 실행 예시 (Vercel 프로젝트 목록)
curl -X POST http://localhost:3100/mcp/vercel \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "id":"2",
    "method":"tools/call",
    "params":{
      "name":"list_projects",
      "arguments":{}
    }
  }'
```

#### **Claude/Cursor에서 사용**
```
사용자: "npm-sentinel을 사용해서 현재 프로젝트의 취약점을 검사해줘"
AI: npm-sentinel MCP 서비스를 통해 검사하겠습니다...

사용자: "Docker 컨테이너 목록을 보여줘"  
AI: Docker MCP를 사용하여 컨테이너 목록을 확인하겠습니다...
```

---

## 🏆 **왜 선택 고민이 사라지는가?**

### **🧠 온디맨드 아키텍처의 힘**
```
기존 MCP 방식:
- 모든 MCP가 상시 실행 → 대량의 토큰 상시 점유
- 실제 작업용 토큰 부족 → AI 품질 저하

우리 인프라 방식:
- 필요한 서비스만 실행 → 최소한의 토큰만 사용
- 더 많은 작업용 토큰 확보 → AI 품질 향상
- 메모리 대폭 절약 → 시스템 부담 감소
- 23개 서비스 334개 도구로 테스트 → 확장성 입증
```

### **🎯 실제 사용 시나리오**

#### **웹 개발 프로젝트**
```bash
# 필요한 서비스 호출
curl -X POST http://localhost:3100/mcp/vercel    # 배포용
curl -X POST http://localhost:3100/mcp/supabase  # DB용
curl -X POST http://localhost:3100/mcp/github    # 코드 관리

# 효과:
- 온디맨드: 필요한 서비스만 활성화
- 기존 방식: 모든 서비스 상시 실행
- 토큰 효율성 대폭 개선
```

#### **DevOps 작업**
```bash
# 필요한 서비스만 활성화
curl -X POST http://localhost:3100/mcp/docker      # 컨테이너
curl -X POST http://localhost:3100/mcp/cloudflare  # DNS/CDN

# 효과:
- 최소한의 리소스 사용
- 필요시에만 서비스 활성화
- 작업 완료 후 자동 정리
```

#### **모바일 개발**
```bash
# 모바일 테스트 서비스
curl -X POST http://localhost:3100/mcp/mobile     # 앱 테스트
curl -X POST http://localhost:3100/mcp/playwright # UI 테스트

# 효과:
- 경량 실행 환경
- 빠른 응답 속도
- 효율적인 리소스 관리
```

---

## 📊 **온디맨드 아키텍처의 장점**

### **💡 주요 효과**
- **토큰 효율성**: 온디맨드 실행으로 토큰 사용량 대폭 절감
- **메모리 절약**: 필요한 서비스만 실행하여 리소스 최적화
- **빠른 응답**: 경량 아키텍처로 빠른 서비스 응답
- **유연한 확장**: 새로운 MCP 서비스 쉽게 추가 가능

### **🚀 사용 편의성**
```
"더 이상 어떤 MCP를 선택할지 고민하지 않아요.
필요한 건 API로 호출하면 됩니다."

"토큰 오버플로우 때문에 포기했던 MCP들을 
이제 모두 사용할 수 있어요."

"통합 인프라 덕분에 MCP 관리가 훨씬 쉬워졌습니다."
```

---

## 🛠️ **통합 MCP 서비스 구조**

### **📦 추가 가능한 MCP 서비스 예시**

**참고**: 이것은 인프라와 호환되는 서비스 예시입니다. 원하는 서비스를 직접 추가해야 합니다.

#### **개발 도구**
- **Vercel**: 웹 앱 배포 및 호스팅
- **Docker**: 컨테이너 관리
- **GitHub**: 소스 코드 관리
- **npm-sentinel**: 패키지 보안 검사

#### **데이터베이스 & 백엔드**
- **Supabase**: 데이터베이스, 인증, 스토리지
- **Cloudflare**: DNS, CDN, 캐시 관리

#### **테스트 & 자동화**
- **Playwright**: 브라우저 자동화
- **Mobile**: 모바일 앱 테스트
- **Desktop Commander**: 데스크톱 자동화

#### **AI & 분석**
- **Clear Thought**: 구조화된 사고 분석
- **Taskmaster AI**: AI 기반 작업 관리
- **Serena**: 코드 검색 및 분석

**추가한 모든 서비스는 `/mcp/{service-name}` 엔드포인트로 접근 가능**

---

## 🎯 **실제 작동 방식**

### **시나리오: React 앱을 Vercel에 배포하고 Supabase 연동**

#### **기존 MCP 사용 방식 (토큰 과부하)**
```
1. 🤔 Claude Desktop에 3-5개 MCP만 선택 가능
2. 🔍 Vercel MCP 설정 → 다른 MCP 포기
3. 🔧 설정 변경 시마다 재시작 필요
4. 💭 Supabase 추가하려면 또 다른 것 포기
5. 😰 대량의 토큰 점유로 실제 작업 제한
6. ⏰ MCP 선택과 설정에 20분 이상 소요
```

#### **통합 인프라 방식 (토큰 효율화)**
```bash
# 1. Docker로 통합 인프라 실행 (한 번만)
docker-compose up -d

# 2. 필요한 서비스 API 호출
curl -X POST http://localhost:3100/mcp/vercel \
  -d '{"method":"tools/call","params":{"name":"deploy"}}'

curl -X POST http://localhost:3100/mcp/supabase \
  -d '{"method":"tools/call","params":{"name":"create_database"}}'

# 결과:
✅ 온디맨드로 필요한 서비스만 실행
✅ 토큰 사용: 대폭 절감
✅ 메모리: 최소 사용
✅ 즉시 사용 가능 (설정 변경 불필요)
```

---

## 🏗️ **온디맨드 아키텍처**

### **🧠 효율적인 리소스 관리**
```
┌─────────────────────────────────────────────────┐
│           MCP Router (Port 3100)                 │
│        통합 API 엔드포인트 제공                  │
├─────────────────────────────────────────────────┤
│         온디맨드 프로세스 매니저                 │
│      요청 시에만 서비스 시작/종료                │
├─────────────────────────────────────────────────┤
│   활성: 필요한 서비스만  |  대기: 나머지 서비스  │
│   메모리: 최소 사용      |  메모리: 0            │
│   토큰: 최소 점유        |  토큰: 0              │
└─────────────────────────────────────────────────┘
```

### **⚡ 성능 최적화**
- **빠른 응답**: 밀리초 단위 응답
- **메모리 절약**: 상시 실행 대비 대폭 절감
- **즉시 시작**: 필요시 즉시 서비스 활성화
- **자동 정리**: 사용 완료 후 자동 리소스 해제

---

## 🚀 **지금 바로 시작하기**

### **⚡ 빠른 시작 (10-15분 소요)**
```bash
# 1. 저장소 클론
git clone https://github.com/DONGHO5270/enterprise-mcp-infrastructure
cd enterprise-mcp-infrastructure

# 2. Docker 빌드 및 실행
docker-compose -f docker/compose/docker-compose-mcp-ondemand.yml build
docker-compose -f docker/compose/docker-compose-mcp-ondemand.yml up -d

# 3. 확인 (30초 대기 후)
curl http://localhost:3100/health

# 4. 플랫폼별 연동 설정 (위 Step 4 참조)
```

### **❓ 문제 해결**
```bash
# Docker 권한 문제 시
sudo usermod -aG docker $USER  # Linux/WSL
# 로그아웃 후 다시 로그인

# 포트 충돌 시 (3100 포트 사용 중)
lsof -i :3100  # Mac/Linux
netstat -ano | findstr :3100  # Windows
# 충돌 프로세스 종료 후 재시작

# 서비스 재시작
docker-compose -f docker/compose/docker-compose-mcp-ondemand.yml down
docker-compose -f docker/compose/docker-compose-mcp-ondemand.yml up -d
```

---

## 📈 **기대 효과**

### **즉시 체감할 수 있는 변화**
- ✅ **MCP 선택 고민 해결**: 모든 서비스 통합 제공
- ✅ **토큰 효율성 개선**: 온디맨드 실행으로 토큰 절약
- ✅ **설치 시간 단축**: Docker 기반 일괄 설치
- ✅ **관리 편의성 증대**: 단일 엔드포인트로 모든 서비스 접근

### **장기적 이점**
- 📊 **생산성 향상**: MCP 선택/설정 시간 절약
- 🚀 **확장성 확보**: 새로운 MCP 쉽게 추가
- ⏰ **유지보수 간소화**: Docker 기반 통합 관리
- 😊 **개발 경험 개선**: 필요한 도구 즉시 사용

---

## 🤝 **커뮤니티 & 지원**

### **도움 받기**
- 🐛 **버그 리포트**: [GitHub Issues](https://github.com/DONGHO5270/enterprise-mcp-infrastructure/issues)
- 💬 **토론**: [GitHub Discussions](https://github.com/DONGHO5270/enterprise-mcp-infrastructure/discussions)
- 📖 **문서**: 프로젝트 내 `/docs` 폴더 참조

### **기여하기**
- 새로운 MCP 서비스 추가
- 버그 수정 및 개선
- 문서화 개선
- Pull Request 환영!

---

<div align="center">

## 🎉 **선택 고민 끝. 빌딩 시작.**

```bash
git clone https://github.com/DONGHO5270/enterprise-mcp-infrastructure
cd enterprise-mcp-infrastructure && docker-compose up -d
```

**[📖 GitHub](https://github.com/DONGHO5270/enterprise-mcp-infrastructure) | [🐛 Issues](https://github.com/DONGHO5270/enterprise-mcp-infrastructure/issues) | [💬 Discussions](https://github.com/DONGHO5270/enterprise-mcp-infrastructure/discussions)**

### 💡 *"Stop choosing. Start building."*

⭐ **이 인프라가 도움이 되었다면, 다른 개발자들도 발견할 수 있도록 star를 주시면 감사하겠습니다.**

</div>

---

## 📄 **라이선스**

### **🆓 오픈소스 (MIT)**
- 개인 프로젝트 ✅
- 교육 및 연구 ✅  
- 소규모 팀 (≤5명) ✅

### **🏢 상용 라이선스**
- 기업 사용 (>5명)
- SaaS 플랫폼 통합
- 프라이빗 수정 및 재배포
- 연간 라이선스 (문의 필요)

**문의**: [GitHub Discussions](https://github.com/DONGHO5270/enterprise-mcp-infrastructure/discussions) 또는 Issue 생성

---

*이 프로젝트는 다양한 MCP 서비스와 도구들을 선택 고민 없이 사용할 수 있게 해주는 통합 MCP 인프라입니다.*