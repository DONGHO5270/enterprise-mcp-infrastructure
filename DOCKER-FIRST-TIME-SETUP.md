# 🐳 Docker Desktop First-Time Setup Guide

## ⚠️ **First time installing Docker?**

If you've just installed Docker Desktop, **some essential configuration is required**!

---

## 🚀 **Run Automated Setup Script**

### **Windows Users**
```powershell
# Run PowerShell as Administrator
.\docker-setup.ps1
```

### **macOS/Linux Users**
```bash
chmod +x docker-setup.sh
./docker-setup.sh
```

---

## 📋 **Manual Configuration Checklist (Required!)**

### **1️⃣ Docker Desktop GUI Settings**

#### **Windows**
1. **Right-click Docker icon** in system tray → Settings
2. **General Tab**
   - ✅ Check "Start Docker Desktop when you log in"
   - ✅ Check "Use the WSL 2 based engine" (Windows 10/11)
3. **Resources → WSL Integration**
   - ✅ Check "Enable integration with my default WSL distro"
   - ✅ Toggle Ubuntu ON
4. **Resources → Advanced**
   - Memory: **4GB or more** recommended
   - CPUs: **2 or more** recommended
5. Click **Apply & Restart**

#### **macOS**
1. Click **Docker icon** in menu bar → Preferences
2. **General Tab**
   - ✅ Check "Start Docker Desktop when you log in"
3. **Resources → Advanced**
   - Memory: **4GB or more** recommended
   - CPUs: **2 or more** recommended
4. Click **Apply & Restart**

---

## 🔧 **WSL 2 Setup (Windows Only)**

### **If WSL 2 is not installed**
```powershell
# PowerShell as Administrator
wsl --install -d Ubuntu

# Restart required!
```

### **Memory Optimization (.wslconfig)**
```powershell
# Auto-created by docker-setup.ps1
# For manual creation:
notepad $env:USERPROFILE\.wslconfig
```

**.wslconfig contents:**
```ini
[wsl2]
memory=4GB
processors=2
swap=2GB
localhostForwarding=true

[experimental]
autoMemoryReclaim=gradual
```

---

## ✅ **Verify Configuration**

### **1. Check Docker**
```bash
docker --version
docker run hello-world
```

### **2. Check Docker Compose**
```bash
# Latest version
docker compose version

# Legacy version (may need separate installation)
docker-compose --version
```

### **3. Check Memory/CPU**
```bash
docker info | grep -E "CPUs|Memory"
```

---

## 🚨 **Common Issues**

### **"Cannot connect to the Docker daemon" error**
```bash
# Windows: Start Docker Desktop
"C:\Program Files\Docker\Docker\Docker Desktop.exe"

# macOS: Start Docker app
open -a Docker

# Linux: Start Docker service
sudo systemctl start docker
sudo systemctl enable docker
```

### **"docker-compose: command not found" error**
```bash
# Latest Docker Desktop uses integrated command
docker compose build  # (no hyphen)

# Instead of
docker-compose build  # (legacy style)
```

### **WSL 2 Memory Issues**
1. Stop Docker Desktop
2. Run `wsl --shutdown`
3. Edit `.wslconfig` file (see above)
4. Restart Docker Desktop

### **Permission denied (Linux)**
```bash
# Add current user to docker group
sudo usermod -aG docker $USER

# Logout and login required!
```

---

## 📊 **System Requirements**

| Item | Minimum | Recommended |
|------|---------|-------------|
| **RAM** | 4GB | 8GB+ |
| **CPU** | 2 cores | 4+ cores |
| **Disk** | 10GB | 20GB+ |
| **OS** | Win 10 | Win 11 / macOS 12+ / Ubuntu 20.04+ |

---

## 🎯 **After Setup Complete**

Once all configuration is done:

```bash
# 1. Clone project
git clone https://github.com/DONGHO5270/enterprise-mcp-infrastructure
cd enterprise-mcp-infrastructure

# 2. Build Docker image
docker compose build mcp-router  # or docker-compose build

# 3. Run
docker compose up -d mcp-router

# 4. Verify
curl http://localhost:3100/health
```

---

## 💡 **Pro Tips**

1. **Enable Docker Desktop auto-start** for convenience
2. **Allocate memory generously** (minimum 4GB)
3. **Use WSL 2** (Windows) for better performance
4. **Clean up regularly**: `docker system prune -a`

---

## ❓ **Need Help?**

- Docker Official Docs: https://docs.docker.com
- Project Issues: https://github.com/DONGHO5270/enterprise-mcp-infrastructure/issues

---

# 🐳 Docker Desktop 초기 설정 가이드

## ⚠️ **Docker를 처음 설치하셨나요?**

Docker Desktop을 처음 설치한 경우 **몇 가지 필수 설정**이 필요합니다!

---

## 🚀 **자동 설정 스크립트 실행**

### **Windows 사용자**
```powershell
# PowerShell을 관리자 권한으로 실행 후
.\docker-setup.ps1
```

### **macOS/Linux 사용자**
```bash
chmod +x docker-setup.sh
./docker-setup.sh
```

---

## 📋 **수동 설정 체크리스트 (필수!)**

### **1️⃣ Docker Desktop GUI 설정**

#### **Windows**
1. **시스템 트레이**에서 Docker 아이콘 우클릭 → Settings
2. **General 탭**
   - ✅ "Start Docker Desktop when you log in" 체크
   - ✅ "Use the WSL 2 based engine" 체크 (Windows 10/11)
3. **Resources → WSL Integration**
   - ✅ "Enable integration with my default WSL distro" 체크
   - ✅ Ubuntu 토글 ON
4. **Resources → Advanced**
   - Memory: **4GB 이상** 권장
   - CPUs: **2개 이상** 권장
5. **Apply & Restart** 클릭

#### **macOS**
1. **상단 메뉴바**에서 Docker 아이콘 → Preferences
2. **General 탭**
   - ✅ "Start Docker Desktop when you log in" 체크
3. **Resources → Advanced**
   - Memory: **4GB 이상** 권장
   - CPUs: **2개 이상** 권장
4. **Apply & Restart** 클릭

---

## 🔧 **WSL 2 설정 (Windows만)**

### **WSL 2가 설치되지 않은 경우**
```powershell
# PowerShell 관리자 권한
wsl --install -d Ubuntu

# 재부팅 필요!
```

### **메모리 최적화 (.wslconfig)**
```powershell
# 자동으로 생성됨 (docker-setup.ps1 실행 시)
# 수동 생성이 필요한 경우:
notepad $env:USERPROFILE\.wslconfig
```

**.wslconfig 내용:**
```ini
[wsl2]
memory=4GB
processors=2
swap=2GB
localhostForwarding=true

[experimental]
autoMemoryReclaim=gradual
```

---

## ✅ **설정 확인**

### **1. Docker 작동 확인**
```bash
docker --version
docker run hello-world
```

### **2. Docker Compose 확인**
```bash
# 최신 버전
docker compose version

# 구버전 (별도 설치 필요할 수 있음)
docker-compose --version
```

### **3. 메모리/CPU 확인**
```bash
docker info | grep -E "CPUs|Memory"
```

---

## 🚨 **자주 발생하는 문제**

### **"Cannot connect to the Docker daemon" 오류**
```bash
# Windows: Docker Desktop 시작
"C:\Program Files\Docker\Docker\Docker Desktop.exe"

# macOS: Docker 앱 시작
open -a Docker

# Linux: Docker 서비스 시작
sudo systemctl start docker
sudo systemctl enable docker
```

### **"docker-compose: command not found" 오류**
```bash
# 최신 Docker Desktop은 통합 명령 사용
docker compose build  # (하이픈 없음)

# 대신
docker-compose build  # (구버전 방식)
```

### **WSL 2 메모리 부족**
1. Docker Desktop 종료
2. `wsl --shutdown` 실행
3. `.wslconfig` 파일 수정 (위 참조)
4. Docker Desktop 재시작

### **Permission denied (Linux)**
```bash
# 현재 사용자를 docker 그룹에 추가
sudo usermod -aG docker $USER

# 로그아웃 후 다시 로그인 필요!
```

---

## 📊 **권장 사양**

| 항목 | 최소 | 권장 |
|-----|-----|-----|
| **RAM** | 4GB | 8GB+ |
| **CPU** | 2 cores | 4+ cores |
| **디스크** | 10GB | 20GB+ |
| **OS** | Win 10 | Win 11 / macOS 12+ / Ubuntu 20.04+ |

---

## 🎯 **설정 완료 후**

모든 설정이 완료되면:

```bash
# 1. 프로젝트 클론
git clone https://github.com/DONGHO5270/enterprise-mcp-infrastructure
cd enterprise-mcp-infrastructure

# 2. Docker 이미지 빌드
docker compose build mcp-router  # 또는 docker-compose build

# 3. 실행
docker compose up -d mcp-router

# 4. 확인
curl http://localhost:3100/health
```

---

## 💡 **프로 팁**

1. **Docker Desktop 자동 시작 설정**하면 편합니다
2. **메모리는 넉넉하게** 할당하세요 (최소 4GB)
3. **WSL 2 사용** (Windows)이 성능이 좋습니다
4. **주기적으로 정리**: `docker system prune -a`

---

## ❓ **도움이 필요하신가요?**

- Docker 공식 문서: https://docs.docker.com
- 프로젝트 이슈: https://github.com/DONGHO5270/enterprise-mcp-infrastructure/issues