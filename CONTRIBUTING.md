# Language / 언어 선택

🇺🇸 [English](#english) | 🇰🇷 [한국어](#한국어)

---

<a name="english"></a>
# 🤝 Contributing to Enterprise MCP Infrastructure

Thank you for your interest in contributing! This project provides **integrated management system for MCP services**. Users add their own MCP services to this management infrastructure.

## 🎯 Our Standards

### ✅ What We Accept
- **Infrastructure improvements** - Docker setup, routing optimization
- **Documentation improvements** - Installation guides, architecture docs
- **Bug fixes** - Router, container, or infrastructure issues
- **Cross-platform compatibility** - Improvements for Windows, Linux, macOS

### ❌ What We Don't Accept
- MCP service implementations (those belong in separate repositories)
- Business logic beyond infrastructure scope
- Service-specific code (this is a management system only)

## 🚀 Getting Started

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+
- Git
- Claude Code (for AI-managed workflow)

### Setup Development Environment
```bash
# 1. Fork and clone
git clone https://github.com/yourusername/enterprise-mcp-infrastructure
cd enterprise-mcp-infrastructure

# 2. Start infrastructure
docker-compose -f docker/compose/docker-compose-mcp-ondemand.yml up -d mcp-router

# 3. Verify router works
curl http://localhost:3100/health

# 4. Make your changes
```

## 🔧 Types of Contributions

### 1. Infrastructure Enhancement

#### Enhancement Checklist
- [ ] Enhancement improves reliability or performance
- [ ] Changes are compatible with existing architecture
- [ ] Docker configuration is optimized
- [ ] Cross-platform compatibility is maintained
- [ ] Documentation is updated
- [ ] No service-specific logic added

### 2. Documentation Improvements

- **Accuracy first** - All examples must work exactly as written
- **Clarity** - Assume users are new to MCP
- **Completeness** - Include all necessary setup steps

### 3. Bug Fixes
- Include reproduction steps
- Verify fix works across all supported platforms
- Add regression test if applicable

## 🧪 Testing

### Required Tests Before Submitting
```bash
# 1. Test infrastructure health
curl http://localhost:3100/health

# 2. Test router functionality
curl -X POST http://localhost:3100/services \
  -H "Content-Type: application/json"

# 3. Test cross-platform (if possible)
# Windows: Test with WSL and native Docker
# Linux: Test with standard Docker setup
```

## 📋 Pull Request Process

### 1. Before You Submit
- [ ] All tests pass
- [ ] Documentation updated
- [ ] No breaking changes to existing infrastructure
- [ ] Infrastructure changes are documented
- [ ] Cross-platform compatibility verified

### 2. PR Description Template
```markdown
## Summary
Brief description of changes

## Type of Change
- [ ] Infrastructure improvement
- [ ] Bug fix
- [ ] Performance improvement
- [ ] Documentation update

## Testing
- [ ] Tested on Linux/WSL
- [ ] Tested on Windows (if applicable)
- [ ] Infrastructure still works
- [ ] Added automated tests

## Infrastructure Changes
- Components affected: (list components)
- Performance impact: (describe if applicable)

## Breaking Changes
None / List any breaking changes
```

## 🔄 Quality Standards

### 🏆 Production Quality
- High reliability and uptime
- Efficient resource usage
- Comprehensive error handling
- Performance optimized

### 🛠️ Documentation Quality
- Clear setup instructions
- Step-by-step guides
- Troubleshooting sections
- API documentation

## 🌟 Recognition

Quality contributors will be:
- Listed in project README
- Given credit in release notes
- Invited to join the core team (for significant contributions)

## ❓ Questions?

### Getting Help
- Open a discussion on GitHub
- Check existing issues first
- Include environment details (OS, Docker version)

### Reporting Issues
- Include reproduction steps
- Specify which component is affected
- Provide environment details

## 📄 Code of Conduct

### Our Standards
- **Quality first** - No compromises on working functionality
- **Transparency** - All claims must be verifiable
- **Respect** - Professional communication
- **Collaboration** - Help others succeed

---

<a name="한국어"></a>
# 🤝 Enterprise MCP 인프라에 기여하기

기여에 관심을 가져주셔서 감사합니다! 이 프로젝트는 **MCP 서비스를 위한 통합 관리 시스템**을 제공합니다. 사용자는 자신의 MCP 서비스를 이 관리 인프라에 추가할 수 있습니다.

## 🎯 우리의 기준

### ✅ 받아들이는 것
- **인프라 개선** - Docker 설정, 라우팅 최적화
- **문서 개선** - 설치 가이드, 아키텍처 문서
- **버그 수정** - 라우터, 컨테이너 또는 인프라 문제
- **크로스 플랫폼 호환성** - Windows, Linux, macOS 개선

### ❌ 받아들이지 않는 것
- MCP 서비스 구현 (별도 저장소에 속함)
- 인프라 범위를 벗어난 비즈니스 로직
- 서비스별 코드 (이것은 관리 시스템만)

## 🚀 시작하기

### 필수 조건
- Docker 20.10+
- Docker Compose 2.0+
- Git
- Claude Code (AI 관리 워크플로우용)

### 개발 환경 설정
```bash
# 1. 포크 및 클론
git clone https://github.com/yourusername/enterprise-mcp-infrastructure
cd enterprise-mcp-infrastructure

# 2. 인프라 시작
docker-compose -f docker/compose/docker-compose-mcp-ondemand.yml up -d mcp-router

# 3. 라우터 작동 확인
curl http://localhost:3100/health

# 4. 변경 사항 작업
```

## 🔧 기여 유형

### 1. 인프라 개선

#### 개선 체크리스트
- [ ] 개선이 신뢰성이나 성능을 향상시킴
- [ ] 변경 사항이 기존 아키텍처와 호환됨
- [ ] Docker 구성이 최적화됨
- [ ] 크로스 플랫폼 호환성이 유지됨
- [ ] 문서가 업데이트됨
- [ ] 서비스별 로직이 추가되지 않음

### 2. 문서 개선

- **정확성 우선** - 모든 예제가 정확히 작동해야 함
- **명확성** - 사용자가 MCP를 처음 접한다고 가정
- **완전성** - 모든 필수 설정 단계 포함

### 3. 버그 수정
- 재현 단계 포함
- 모든 지원 플랫폼에서 수정이 작동하는지 확인
- 가능한 경우 회귀 테스트 추가

## 🧪 테스트

### 제출 전 필수 테스트
```bash
# 1. 인프라 상태 테스트
curl http://localhost:3100/health

# 2. 라우터 기능 테스트
curl -X POST http://localhost:3100/services \
  -H "Content-Type: application/json"

# 3. 크로스 플랫폼 테스트 (가능한 경우)
# Windows: WSL 및 네이티브 Docker로 테스트
# Linux: 표준 Docker 설정으로 테스트
```

## 📋 Pull Request 과정

### 1. 제출 전
- [ ] 모든 테스트 통과
- [ ] 문서 업데이트
- [ ] 기존 인프라에 대한 파괴적 변경 없음
- [ ] 인프라 변경 사항 문서화
- [ ] 크로스 플랫폼 호환성 확인

### 2. PR 설명 템플릿
```markdown
## 요약
변경 사항에 대한 간단한 설명

## 변경 유형
- [ ] 인프라 개선
- [ ] 버그 수정
- [ ] 성능 개선
- [ ] 문서 업데이트

## 테스트
- [ ] Linux/WSL에서 테스트됨
- [ ] Windows에서 테스트됨 (해당하는 경우)
- [ ] 인프라가 여전히 작동함
- [ ] 자동화된 테스트 추가됨

## 인프라 변경 사항
- 영향받는 구성 요소: (구성 요소 나열)
- 성능 영향: (해당하는 경우 설명)

## 파괴적 변경 사항
없음 / 파괴적 변경 사항 나열
```

## 🔄 품질 기준

### 🏆 프로덕션 품질
- 높은 신뢰성과 가동 시간
- 효율적인 리소스 사용
- 포괄적인 오류 처리
- 성능 최적화

### 🛠️ 문서 품질
- 명확한 설정 지침
- 단계별 가이드
- 문제 해결 섹션
- API 문서

## 🌟 인정

품질 기여자는 다음과 같이 인정받습니다:
- 프로젝트 README에 나열
- 릴리스 노트에 크레딧 제공
- 핵심 팀 가입 초대 (중요한 기여의 경우)

## ❓ 질문?

### 도움 받기
- GitHub에서 토론 열기
- 기존 이슈 먼저 확인
- 환경 세부 정보 포함 (OS, Docker 버전)

### 이슈 신고
- 재현 단계 포함
- 영향받는 구성 요소 명시
- 환경 세부 정보 제공

## 📄 행동 강령

### 우리의 기준
- **품질 우선** - 작동하는 기능에 대한 타협 없음
- **투명성** - 모든 주장이 검증 가능해야 함
- **존중** - 전문적인 의사소통
- **협력** - 다른 사람의 성공을 도움

---

**최고 품질의 MCP 인프라를 유지하는 데 도움을 주셔서 감사합니다!**

*양보다 질. 약속보다 투명성. 경쟁보다 커뮤니티.*