FROM node:18-slim

# Python 3 설치
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Deno 설치 (Code Runner MCP용)
RUN apt-get update && apt-get install -y curl unzip \
    && curl -fsSL https://deno.land/x/install/install.sh | sh \
    && mv /root/.deno/bin/deno /usr/local/bin/ \
    && rm -rf /var/lib/apt/lists/*

# Playwright 브라우저 설치 (Playwright MCP용)
RUN npx playwright install-deps chromium && \
    npx playwright install chromium && \
    # node 사용자를 위한 브라우저 캐시 설정
    mkdir -p /home/node/.cache && \
    cp -r /root/.cache/ms-playwright /home/node/.cache/ || true && \
    chown -R node:node /home/node/.cache || true

# Chromium 브라우저 설치 (Mermaid MCP용)
RUN apt-get update && apt-get install -y \
    chromium \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Docker CLI 설치 (Docker MCP용)
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    && mkdir -m 0755 -p /etc/apt/keyrings \
    && curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg \
    && echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
      $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null \
    && apt-get update \
    && apt-get install -y docker-ce-cli \
    && rm -rf /var/lib/apt/lists/*

# Python packages for MCP services (mem0, code-checker, serena)
RUN pip3 install --no-cache-dir --break-system-packages \
    mem0ai>=0.1.55 \
    PyYAML \
    pylint \
    python-dotenv \
    sensai-utils \
    agno \
    ruamel.yaml

WORKDIR /app

# 패키지 파일 복사
COPY package*.json ./

# 모든 의존성 설치 (TypeScript 컴파일을 위해)
RUN npm ci

# 소스 코드 복사
COPY . .

# TypeScript 컴파일
RUN npm run build

# Production dependencies만 재설치 (빌드 완료 후 크기 최적화)
RUN rm -rf node_modules && npm ci --only=production

# 간단한 시작 스크립트 생성 (권한 수정 제거)
RUN echo '#!/bin/bash\n\
echo "MCP Router starting..."\n\
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"\n\
export LANG=C.UTF-8\n\
export LC_ALL=C.UTF-8\n\
export PYTHONIOENCODING=utf-8\n\
exec node dist/index.js\n\
' > /app/start-router.sh && chmod +x /app/start-router.sh

# 테스트 MCP 생성
COPY test-simple-mcp.js /app/

EXPOSE 3000

CMD ["/app/start-router.sh"]