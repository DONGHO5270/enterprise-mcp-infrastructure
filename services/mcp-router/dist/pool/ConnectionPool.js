"use strict";
/**
 * Phase 2B - Connection Pooling System
 * 예상 리소스 효율성 개선: 10%
 *
 * 커넥션 풀 특징:
 * - 재사용 가능한 프로세스 풀
 * - 자동 health check
 * - 동적 크기 조정
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionPool = exports.ConnectionPool = void 0;
const child_process_1 = require("child_process");
const events_1 = require("events");
const logger_1 = require("../utils/logger");
class ConnectionPool extends events_1.EventEmitter {
    connections = new Map();
    waitingQueue = new Map();
    healthCheckTimers = new Map();
    // 서비스별 풀 설정
    static configs = new Map([
        ['clear-thought', {
                minSize: 2,
                maxSize: 5,
                acquireTimeout: 5000,
                idleTimeout: 120000, // 2분
                healthCheckInterval: 30000, // 30초
                maxRequestsPerConnection: 100
            }],
        ['stochastic-thinking', {
                minSize: 2,
                maxSize: 5,
                acquireTimeout: 5000,
                idleTimeout: 180000, // 3분
                healthCheckInterval: 30000,
                maxRequestsPerConnection: 50
            }],
        ['default', {
                minSize: 1,
                maxSize: 3,
                acquireTimeout: 3000,
                idleTimeout: 60000, // 1분
                healthCheckInterval: 60000, // 1분
                maxRequestsPerConnection: 200
            }]
    ]);
    constructor() {
        super();
        // 주기적 정리 (30초마다)
        setInterval(() => this.cleanup(), 30000);
        // 메트릭 리포팅 (1분마다)
        setInterval(() => this.reportMetrics(), 60000);
    }
    /**
     * 연결 획득
     */
    async acquire(serviceName, service) {
        const config = ConnectionPool.configs.get(serviceName)
            || ConnectionPool.configs.get('default');
        // 서비스별 풀 초기화
        if (!this.connections.has(serviceName)) {
            this.connections.set(serviceName, []);
            this.waitingQueue.set(serviceName, []);
            await this.initializePool(serviceName, service, config);
        }
        const pool = this.connections.get(serviceName);
        // 사용 가능한 연결 찾기
        let connection = pool.find(conn => !conn.inUse &&
            conn.healthCheckFailures < 3 &&
            conn.requestCount < config.maxRequestsPerConnection);
        if (connection) {
            connection.inUse = true;
            connection.lastUsed = Date.now();
            this.emit('pool:acquired', { service: serviceName, id: connection.id });
            return connection;
        }
        // 풀 크기가 최대치 미만이면 새 연결 생성
        if (pool.length < config.maxSize) {
            connection = await this.createConnection(serviceName, service);
            connection.inUse = true;
            pool.push(connection);
            this.emit('pool:created', { service: serviceName, id: connection.id });
            return connection;
        }
        // 대기열에 추가
        return new Promise((resolve, reject) => {
            const queue = this.waitingQueue.get(serviceName);
            const timer = setTimeout(() => {
                const index = queue.indexOf(resolve);
                if (index > -1) {
                    queue.splice(index, 1);
                }
                reject(new Error(`Connection acquire timeout for ${serviceName}`));
            }, config.acquireTimeout);
            const wrappedResolve = (conn) => {
                clearTimeout(timer);
                resolve(conn);
            };
            queue.push(wrappedResolve);
            this.emit('pool:waiting', { service: serviceName, queueSize: queue.length });
        });
    }
    /**
     * 연결 반환
     */
    release(serviceName, connection) {
        connection.inUse = false;
        connection.lastUsed = Date.now();
        // 대기 중인 요청이 있으면 즉시 할당
        const queue = this.waitingQueue.get(serviceName);
        if (queue && queue.length > 0) {
            const waiting = queue.shift();
            connection.inUse = true;
            waiting(connection);
            this.emit('pool:reused', { service: serviceName, id: connection.id });
            return;
        }
        this.emit('pool:released', { service: serviceName, id: connection.id });
    }
    /**
     * 풀 초기화
     */
    async initializePool(serviceName, service, config) {
        const pool = this.connections.get(serviceName);
        // 최소 연결 수만큼 생성
        const promises = [];
        for (let i = 0; i < config.minSize; i++) {
            promises.push(this.createConnection(serviceName, service));
        }
        const connections = await Promise.all(promises);
        pool.push(...connections);
        // 헬스체크 시작
        this.startHealthCheck(serviceName, config);
        logger_1.logger.info(`[🏊 Pool] Initialized ${serviceName} with ${config.minSize} connections`);
    }
    /**
     * 연결 생성
     */
    async createConnection(serviceName, service) {
        const id = `${serviceName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const childProcess = (0, child_process_1.spawn)(service.command, service.args || [], {
            cwd: service.cwd,
            env: {
                ...process.env,
                ...service.env
            },
            stdio: ['pipe', 'pipe', 'pipe']
        });
        const connection = {
            id,
            process: childProcess,
            service,
            inUse: false,
            lastUsed: Date.now(),
            created: Date.now(),
            requestCount: 0,
            healthCheckFailures: 0,
            buffer: '',
            pendingRequests: new Map()
        };
        // stdout 핸들러
        childProcess.stdout?.on('data', (data) => {
            connection.buffer += data.toString();
            this.processBuffer(connection);
        });
        // stderr 핸들러
        childProcess.stderr?.on('data', (data) => {
            logger_1.logger.debug(`[Pool ${id}] stderr: ${data.toString()}`);
        });
        // 에러 핸들러
        childProcess.on('error', (error) => {
            logger_1.logger.error(`[Pool ${id}] Process error:`, error);
            connection.healthCheckFailures++;
            this.handleConnectionError(serviceName, connection);
        });
        // 종료 핸들러
        childProcess.on('exit', (code) => {
            logger_1.logger.info(`[Pool ${id}] Process exited with code ${code}`);
            this.removeConnection(serviceName, connection);
        });
        // 초기화 요청
        await this.initializeConnection(connection);
        return connection;
    }
    /**
     * 연결 초기화
     */
    async initializeConnection(connection) {
        const initRequest = {
            jsonrpc: '2.0',
            id: `init-${Date.now()}`,
            method: 'initialize',
            params: {
                protocolVersion: '2024-11-05',
                capabilities: {},
                clientInfo: {
                    name: 'mcp-router-pool',
                    version: '2.0.0'
                }
            }
        };
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                connection.pendingRequests.delete(initRequest.id);
                reject(new Error('Initialize timeout'));
            }, 5000);
            connection.pendingRequests.set(initRequest.id, (response) => {
                clearTimeout(timeout);
                if (response.error) {
                    reject(new Error(response.error.message));
                }
                else {
                    resolve();
                }
            });
            connection.process.stdin?.write(JSON.stringify(initRequest) + '\n');
        });
    }
    /**
     * 버퍼 처리
     */
    processBuffer(connection) {
        const lines = connection.buffer.split('\n');
        connection.buffer = lines.pop() || '';
        for (const line of lines) {
            if (line.trim()) {
                try {
                    const response = JSON.parse(line.trim());
                    if (response.id !== undefined && connection.pendingRequests.has(response.id)) {
                        const resolve = connection.pendingRequests.get(response.id);
                        connection.pendingRequests.delete(response.id);
                        resolve(response);
                    }
                }
                catch (error) {
                    logger_1.logger.warn(`[Pool ${connection.id}] JSON parse error:`, error);
                }
            }
        }
    }
    /**
     * 헬스체크 시작
     */
    startHealthCheck(serviceName, config) {
        const timer = setInterval(async () => {
            const pool = this.connections.get(serviceName);
            if (!pool)
                return;
            for (const connection of pool) {
                if (!connection.inUse) {
                    try {
                        await this.healthCheck(connection);
                        connection.healthCheckFailures = 0;
                    }
                    catch (error) {
                        connection.healthCheckFailures++;
                        logger_1.logger.warn(`[Pool ${connection.id}] Health check failed:`, error);
                        if (connection.healthCheckFailures >= 3) {
                            this.removeConnection(serviceName, connection);
                        }
                    }
                }
            }
        }, config.healthCheckInterval);
        this.healthCheckTimers.set(serviceName, timer);
    }
    /**
     * 헬스체크 실행
     */
    async healthCheck(connection) {
        const healthRequest = {
            jsonrpc: '2.0',
            id: `health-${Date.now()}`,
            method: 'tools/list',
            params: {}
        };
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                connection.pendingRequests.delete(healthRequest.id);
                reject(new Error('Health check timeout'));
            }, 3000);
            connection.pendingRequests.set(healthRequest.id, (response) => {
                clearTimeout(timeout);
                if (response.error) {
                    reject(new Error(response.error.message));
                }
                else {
                    resolve();
                }
            });
            connection.process.stdin?.write(JSON.stringify(healthRequest) + '\n');
        });
    }
    /**
     * 연결 에러 처리
     */
    handleConnectionError(serviceName, connection) {
        // 보류 중인 요청 모두 거부
        for (const [id, resolve] of connection.pendingRequests) {
            resolve({
                jsonrpc: '2.0',
                id,
                error: {
                    code: -32603,
                    message: 'Connection error'
                }
            });
        }
        connection.pendingRequests.clear();
        // 연결 제거
        this.removeConnection(serviceName, connection);
    }
    /**
     * 연결 제거
     */
    removeConnection(serviceName, connection) {
        const pool = this.connections.get(serviceName);
        if (!pool)
            return;
        const index = pool.indexOf(connection);
        if (index > -1) {
            pool.splice(index, 1);
            // 프로세스 종료
            if (!connection.process.killed) {
                connection.process.kill('SIGTERM');
            }
            this.emit('pool:removed', {
                service: serviceName,
                id: connection.id,
                requestCount: connection.requestCount
            });
        }
    }
    /**
     * 유휴 연결 정리
     */
    cleanup() {
        const now = Date.now();
        for (const [serviceName, pool] of this.connections) {
            const config = ConnectionPool.configs.get(serviceName)
                || ConnectionPool.configs.get('default');
            // 최소 크기 이상의 유휴 연결 제거
            const idleConnections = pool.filter(conn => !conn.inUse &&
                now - conn.lastUsed > config.idleTimeout &&
                pool.length > config.minSize);
            for (const connection of idleConnections) {
                this.removeConnection(serviceName, connection);
                logger_1.logger.info(`[🧹 Pool] Removed idle connection ${connection.id}`);
            }
        }
    }
    /**
     * 메트릭 리포팅
     */
    reportMetrics() {
        const metrics = [];
        for (const [serviceName, pool] of this.connections) {
            const inUse = pool.filter(c => c.inUse).length;
            const idle = pool.filter(c => !c.inUse).length;
            const totalRequests = pool.reduce((sum, c) => sum + c.requestCount, 0);
            const avgRequests = pool.length > 0 ? totalRequests / pool.length : 0;
            metrics.push({
                service: serviceName,
                total: pool.length,
                inUse,
                idle,
                waiting: this.waitingQueue.get(serviceName)?.length || 0,
                totalRequests,
                avgRequestsPerConnection: avgRequests.toFixed(1)
            });
        }
        this.emit('pool:metrics', metrics);
        console.log('[📊 Pool Metrics]', metrics);
    }
    /**
     * 풀 상태 조회
     */
    getStatus(serviceName) {
        if (serviceName) {
            const pool = this.connections.get(serviceName) || [];
            return {
                service: serviceName,
                connections: pool.length,
                inUse: pool.filter(c => c.inUse).length,
                idle: pool.filter(c => !c.inUse).length,
                waiting: this.waitingQueue.get(serviceName)?.length || 0
            };
        }
        const status = [];
        for (const [service, pool] of this.connections) {
            status.push(this.getStatus(service));
        }
        return status;
    }
    /**
     * 전체 풀 종료
     */
    async shutdown() {
        // 헬스체크 타이머 정리
        for (const timer of this.healthCheckTimers.values()) {
            clearInterval(timer);
        }
        // 모든 연결 종료
        for (const [serviceName, pool] of this.connections) {
            for (const connection of pool) {
                connection.process.kill('SIGTERM');
            }
            logger_1.logger.info(`[Pool] Shutdown ${serviceName}: ${pool.length} connections closed`);
        }
        this.connections.clear();
        this.waitingQueue.clear();
        this.healthCheckTimers.clear();
    }
}
exports.ConnectionPool = ConnectionPool;
// 싱글톤 인스턴스
exports.connectionPool = new ConnectionPool();
//# sourceMappingURL=ConnectionPool.js.map