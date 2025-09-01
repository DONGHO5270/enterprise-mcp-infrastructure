# Language / 언어 선택

🇺🇸 [English](#english) | 🇰🇷 [한국어](#한국어)

---

<a name="english"></a>
# 🐳 Docker Desktop Setup Guide

> **Quick Fix**: Resolve Docker issues in WSL within 3 minutes

## 🚨 **Common Errors**

```bash
Cannot connect to the Docker daemon at unix:///var/run/docker.sock
# or
docker: command not found
```

## ✅ **Quick Solution (3 minutes)**

### **Step 1: Open Docker Desktop**
- Right-click Docker whale icon in system tray → "Dashboard"
- Or search "Docker Desktop" in Start menu

### **Step 2: Enable WSL Integration (Critical)**

#### **Settings → Resources → WSL Integration**

<div align="center">

| Setting | Required Value |
|---------|---------------|
| **Enable integration with my default WSL distro** | ✅ Check |
| **Ubuntu** (or your distro) | 🔄 Toggle ON |

</div>

### **Step 3: Verify WSL 2 Engine**

#### **Settings → General**

| Setting | Required Value |
|---------|---------------|
| **Use the WSL 2 based engine** | ✅ Check |
| **Start Docker Desktop when you log in** | ✅ Recommended |

### **Step 4: Apply and Restart**
1. Click **"Apply & restart"**
2. Wait for Docker Desktop restart (30 seconds)
3. Open new WSL terminal

---

## 🧪 **Verify Setup**

### **In Windows PowerShell**
```powershell
docker --version
# Expected: Docker version 20.x.x

docker ps
# Expected: CONTAINER ID  IMAGE  COMMAND...
```

### **In WSL/Ubuntu**
```bash
docker --version
# Expected: Docker version 20.x.x

docker run hello-world
# Expected: Hello from Docker!
```

---

## 🔧 **Troubleshooting**

### **Issue 1: WSL Integration toggle not visible**

**Cause**: WSL not installed

**Solution**:
```powershell
# PowerShell as Administrator
wsl --install
# PC restart required
```

### **Issue 2: Docker commands still not working**

**Solution steps**:
1. **Restart WSL**
   ```powershell
   wsl --shutdown
   wsl
   ```

2. **Restart Docker Desktop**
   - System tray → Right-click Docker → "Quit Docker Desktop"
   - Start Docker Desktop again

3. **Restart Windows** (last resort)

### **Issue 3: "Docker Desktop - WSL distro terminated abruptly"**

**Solution**:
```powershell
# PowerShell as Administrator
wsl --update
wsl --set-default-version 2
```

---

## ✅ **Automated Verification**

Run the included verification script:

```powershell
# Windows PowerShell
.\verify-docker.ps1

# WSL/Linux
./verify-docker.sh
```

**Verification items**:
- Docker installation status
- WSL Integration settings
- Network connectivity
- Container run capability

---

## 📋 **Checklist**

Confirm setup completion:

- [ ] Docker Desktop installed
- [ ] WSL 2 Engine enabled
- [ ] WSL Integration toggle ON
- [ ] `docker ps` works in PowerShell
- [ ] `docker ps` works in WSL
- [ ] `hello-world` container runs successfully

---

## 🚀 **Next Steps**

After Docker setup is complete:

```powershell
# Start MCP infrastructure
.\start.ps1

# Check status
curl http://localhost:3100/health
```

---

## 📚 **References**

- [Docker Desktop WSL 2 backend](https://docs.docker.com/desktop/wsl/)
- [WSL 2 Installation Guide](https://docs.microsoft.com/windows/wsl/install)
- [Project README](./README.md)

---

<div align="center">

**💡 Key Point**

> Enabling WSL Integration solves 95% of all issues!

**For issues**: [GitHub Issues](https://github.com/DONGHO5270/enterprise-mcp-infrastructure/issues)

</div>

---

<a name="한국어"></a>
# 🐳 Docker Desktop 설정 가이드

> **즉시 해결**: WSL에서 Docker 사용 문제를 3분 내 해결

## 🚨 **일반적인 오류**

```bash
Cannot connect to the Docker daemon at unix:///var/run/docker.sock
# 또는
docker: command not found
```

## ✅ **즉시 해결 방법 (3분)**

### **1단계: Docker Desktop 열기**
- 시스템 트레이에서 Docker 고래 아이콘 우클릭 → "Dashboard"
- 또는 시작 메뉴에서 "Docker Desktop" 검색

### **2단계: WSL Integration 활성화 (핵심)**

#### **Settings → Resources → WSL Integration**

<div align="center">

| 설정 항목 | 필수 설정값 |
|----------|------------|
| **Enable integration with my default WSL distro** | ✅ 체크 |
| **Ubuntu** (또는 사용 중인 배포판) | 🔄 토글 ON |

</div>

### **3단계: WSL 2 Engine 확인**

#### **Settings → General**

| 설정 항목 | 필수 설정값 |
|----------|------------|
| **Use the WSL 2 based engine** | ✅ 체크 |
| **Start Docker Desktop when you log in** | ✅ 권장 |

### **4단계: 적용 및 재시작**
1. **"Apply & restart"** 클릭
2. Docker Desktop 재시작 대기 (30초)
3. WSL 터미널 새로 열기

---

## 🧪 **설정 확인**

### **Windows PowerShell에서**
```powershell
docker --version
# 예상: Docker version 20.x.x

docker ps
# 예상: CONTAINER ID  IMAGE  COMMAND...
```

### **WSL/Ubuntu에서**
```bash
docker --version
# 예상: Docker version 20.x.x

docker run hello-world
# 예상: Hello from Docker!
```

---

## 🔧 **추가 문제 해결**

### **문제 1: WSL Integration 토글이 보이지 않음**

**원인**: WSL이 설치되지 않음

**해결**:
```powershell
# PowerShell 관리자 권한
wsl --install
# PC 재시작 필요
```

### **문제 2: Docker 명령어가 여전히 작동하지 않음**

**해결 순서**:
1. **WSL 재시작**
   ```powershell
   wsl --shutdown
   wsl
   ```

2. **Docker Desktop 재시작**
   - 시스템 트레이 → Docker 우클릭 → "Quit Docker Desktop"
   - Docker Desktop 다시 실행

3. **Windows 재시작** (최후의 수단)

### **문제 3: "Docker Desktop - WSL distro terminated abruptly"**

**해결**:
```powershell
# PowerShell 관리자 권한
wsl --update
wsl --set-default-version 2
```

---

## ✅ **자동 검증 스크립트**

프로젝트에 포함된 검증 스크립트 실행:

```powershell
# Windows PowerShell
.\verify-docker.ps1

# WSL/Linux
./verify-docker.sh
```

**검증 항목**:
- Docker 설치 상태
- WSL Integration 설정
- 네트워크 연결
- 컨테이너 실행 가능 여부

---

## 📋 **체크리스트**

설정 완료 확인:

- [ ] Docker Desktop 설치 완료
- [ ] WSL 2 Engine 활성화
- [ ] WSL Integration 토글 ON
- [ ] PowerShell에서 `docker ps` 작동
- [ ] WSL에서 `docker ps` 작동
- [ ] `hello-world` 컨테이너 실행 성공

---

## 🚀 **다음 단계**

Docker 설정이 완료되면:

```powershell
# MCP 인프라 시작
.\start.ps1

# 상태 확인
curl http://localhost:3100/health
```

---

## 📚 **참고 자료**

- [Docker Desktop WSL 2 backend](https://docs.docker.com/desktop/wsl/)
- [WSL 2 설치 가이드](https://docs.microsoft.com/windows/wsl/install)
- [프로젝트 README](./README.md)

---

<div align="center">

**💡 핵심 포인트**

> WSL Integration 활성화가 전체 문제의 95% 해결!

**문제 발생 시**: [GitHub Issues](https://github.com/DONGHO5270/enterprise-mcp-infrastructure/issues)

</div>