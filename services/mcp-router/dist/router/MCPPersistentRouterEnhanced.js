"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCPPersistentRouterEnhanced = void 0;
const child_process_1 = require("child_process");
const logger_1 = require("../utils/logger");
const uuid_1 = require("uuid");
// Phase 2 컴포넌트 통합
const MCPResponseCache_1 = require("../cache/MCPResponseCache");
const CircuitBreaker_1 = require("../circuit/CircuitBreaker");
const MetricsCollector_1 = require("../metrics/MetricsCollector");
const ConnectionPool_1 = require("../pool/ConnectionPool");
const RetryManager_1 = require("../retry/RetryManager");
// Phase 3: Dynamic Service Discovery
const service_manager_1 = require("../config/service-manager");
const taskMCPRouter = {
    routeMCPCall: async (tool, directive) => ({
        allowed: true,
        reason: '',
        modifiedDirective: directive
    })
}; // Temporary mock
class MCPPersistentRouterEnhanced {
    config;
    processes = new Map();
    cleanupInterval;
    idleTimeout;
    serviceManager;
    isInitialized = false;
    constructor(config) {
        this.config = config; // Keep for backward compatibility
        this.idleTimeout = parseInt(process.env.PROCESS_IDLE_TIMEOUT || '60000');
        // Phase 3: Initialize Hybrid Service Manager
        this.serviceManager = new service_manager_1.HybridServiceManager();
        // Cleanup idle processes every 30 seconds
        this.cleanupInterval = setInterval(() => {
            this.cleanupIdleProcesses();
        }, 30000);
        // Phase 2: 메트릭 컬렉터 초기화
        logger_1.logger.info('[Phase 2] Metrics collector initialized');
        // Phase 3: Dynamic Service Discovery 초기화
        logger_1.logger.info('[Phase 3] Dynamic Service Discovery initialized');
    }
    /**
     * Initialize the router with dynamic services
     */
    async initialize() {
        if (this.isInitialized) {
            logger_1.logger.info('[Phase 3] Router already initialized, skipping');
            return;
        }
        logger_1.logger.info('[Phase 3] Starting Dynamic Service Discovery initialization...');
        logger_1.logger.info(`[Phase 3] ENABLE_DYNAMIC_DISCOVERY = ${process.env.ENABLE_DYNAMIC_DISCOVERY}`);
        logger_1.logger.info(`[Phase 3] MCP_DIRECTORY = ${process.env.MCP_DIRECTORY}`);
        try {
            // Phase 3: Load all services (static + dynamic)
            const allServices = await this.serviceManager.initialize();
            // Update config with all services
            this.config = {};
            const serviceNames = [];
            for (const service of allServices) {
                this.config[service.name] = service;
                serviceNames.push(service.name);
            }
            // Register for hot reload updates
            this.serviceManager.onServicesUpdated((services) => {
                logger_1.logger.info('[Phase 3] Services updated via hot reload');
                this.config = {};
                for (const service of services) {
                    this.config[service.name] = service;
                }
            });
            this.isInitialized = true;
            logger_1.logger.info(`[Phase 3] ✅ Router initialized with ${allServices.length} services: ${serviceNames.join(', ')}`);
        }
        catch (error) {
            logger_1.logger.error('[Phase 3] ❌ Failed to initialize:', error);
            throw error;
        }
    }
    async executeMCP(serviceName, mcpRequest, envFromHeaders) {
        const startTime = Date.now();
        // Phase 3: Ensure router is initialized
        if (!this.isInitialized) {
            await this.initialize();
        }
        // Phase 2: 메트릭 기록 시작
        const requestId = `${serviceName}-${mcpRequest.id}-${Date.now()}`;
        const service = this.config[serviceName];
        if (!service) {
            const errorResponse = {
                jsonrpc: '2.0',
                id: mcpRequest.id,
                error: {
                    code: -32601,
                    message: `Unknown service: ${serviceName}`
                }
            };
            // Phase 2: 에러 메트릭 기록
            MetricsCollector_1.metricsCollector.recordRequest({
                service: serviceName,
                method: mcpRequest.method,
                duration: Date.now() - startTime,
                success: false,
                error: 'Unknown service'
            });
            return errorResponse;
        }
        logger_1.logger.info(`Executing MCP ${serviceName}.${mcpRequest.method}`);
        // Phase 2: 캐시 확인 (읽기 작업만)
        if (mcpRequest.method === 'tools/list' || mcpRequest.method === 'resources/list') {
            const cached = await MCPResponseCache_1.mcpCache.get(serviceName, mcpRequest.method, mcpRequest.params);
            if (cached) {
                logger_1.logger.info(`[Cache HIT] ${serviceName}.${mcpRequest.method}`);
                // Phase 2: 캐시 히트 메트릭
                MetricsCollector_1.metricsCollector.recordRequest({
                    service: serviceName,
                    method: mcpRequest.method,
                    duration: Date.now() - startTime,
                    success: true,
                    cacheHit: true
                });
                return cached;
            }
        }
        // Task 도구의 MCP 호출 처리
        if (serviceName === 'taskmaster-ai' && mcpRequest.method === 'tools/call') {
            const toolName = mcpRequest.params?.name;
            const mcpDirective = mcpRequest.params?.arguments?.mcpDirective;
            if (mcpDirective && this.isTaskToolWithMCPSupport(toolName)) {
                return await this.handleTaskMCPCall(toolName, mcpDirective, mcpRequest);
            }
        }
        // Handle prompts/list for services that don't implement it
        if (mcpRequest.method === 'prompts/list') {
            logger_1.logger.info(`Handling prompts/list for ${serviceName} - returning empty`);
            return {
                jsonrpc: '2.0',
                id: mcpRequest.id,
                result: {
                    prompts: []
                }
            };
        }
        try {
            // Phase 2: 서킷 브레이커 확인
            const breaker = CircuitBreaker_1.circuitManager.getBreaker(serviceName);
            // Phase 2: 서킷 브레이커와 재시도 로직으로 실행
            const response = await breaker.execute(async () => {
                return await (0, RetryManager_1.withRetry)(serviceName, async () => {
                    // Merge environment variables from headers if provided
                    const mergedService = envFromHeaders ? {
                        ...service,
                        env: { ...service.env, ...envFromHeaders }
                    } : service;
                    // Phase 2: 커넥션 풀 사용 (가능한 경우)
                    let mcpProcess;
                    let isPooledConnection = false;
                    if (process.env.ENABLE_CONNECTION_POOL === 'true') {
                        mcpProcess = await ConnectionPool_1.connectionPool.acquire(serviceName, mergedService);
                        isPooledConnection = true;
                    }
                    else {
                        mcpProcess = await this.getOrCreateProcess(serviceName, mergedService);
                    }
                    // Send request to the appropriate process
                    const response = await this.sendRequest(mcpProcess, mcpRequest);
                    // Phase 2: 커넥션 풀 반환
                    if (process.env.ENABLE_CONNECTION_POOL === 'true' && isPooledConnection) {
                        ConnectionPool_1.connectionPool.release(serviceName, mcpProcess);
                    }
                    return response;
                }, {
                    maxRetries: 3,
                    initialDelay: 1000
                });
            });
            // Phase 2: 캐시 저장 (성공한 읽기 작업)
            if (!response.error && (mcpRequest.method === 'tools/list' || mcpRequest.method === 'resources/list')) {
                await MCPResponseCache_1.mcpCache.set(serviceName, mcpRequest.method, mcpRequest.params, response);
                logger_1.logger.info(`[Cache SET] ${serviceName}.${mcpRequest.method}`);
            }
            // Phase 2: 성공 메트릭 기록
            MetricsCollector_1.metricsCollector.recordRequest({
                service: serviceName,
                method: mcpRequest.method,
                duration: Date.now() - startTime,
                success: true,
                cacheHit: false,
                circuitState: breaker.getState()
            });
            return response;
        }
        catch (error) {
            logger_1.logger.error(`Error executing ${serviceName}:`, error);
            // Phase 2: 실패 메트릭 기록
            MetricsCollector_1.metricsCollector.recordRequest({
                service: serviceName,
                method: mcpRequest.method,
                duration: Date.now() - startTime,
                success: false,
                error: error.message
            });
            return {
                jsonrpc: '2.0',
                id: mcpRequest.id,
                error: {
                    code: -32603,
                    message: error.message || 'Internal error'
                }
            };
        }
    }
    async getOrCreateProcess(serviceName, service) {
        let mcpProcess = this.processes.get(serviceName);
        if (!mcpProcess || mcpProcess.process.killed) {
            // Create new process
            const childProcess = (0, child_process_1.spawn)(service.command, service.args || [], {
                cwd: service.cwd,
                env: {
                    PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
                    LANG: 'C.UTF-8',
                    LC_ALL: 'C.UTF-8',
                    PYTHONIOENCODING: 'utf-8',
                    HOME: process.env.HOME || '/root',
                    USER: process.env.USER || 'root',
                    ...service.env
                },
                stdio: ['pipe', 'pipe', 'pipe']
            });
            mcpProcess = {
                process: childProcess,
                service,
                lastUsed: Date.now(),
                buffer: '',
                pendingRequests: new Map()
            };
            // Set up event handlers
            childProcess.stdout?.on('data', (data) => {
                mcpProcess.buffer += data.toString();
                this.processBuffer(mcpProcess);
            });
            childProcess.stderr?.on('data', (data) => {
                logger_1.logger.debug(`${serviceName} stderr:`, data.toString());
            });
            childProcess.on('error', (error) => {
                logger_1.logger.error(`Process error for ${serviceName}:`, error);
                // Reject all pending requests
                for (const [id, resolve] of mcpProcess.pendingRequests) {
                    resolve({
                        jsonrpc: '2.0',
                        id,
                        error: {
                            code: -32603,
                            message: error.message
                        }
                    });
                }
                mcpProcess.pendingRequests.clear();
            });
            childProcess.on('exit', (code) => {
                logger_1.logger.info(`${serviceName} process exited with code ${code}`);
                this.processes.delete(serviceName);
                // Reject all pending requests
                for (const [id, resolve] of mcpProcess.pendingRequests) {
                    resolve({
                        jsonrpc: '2.0',
                        id,
                        error: {
                            code: -32603,
                            message: `Process exited with code ${code} without responding`
                        }
                    });
                }
            });
            this.processes.set(serviceName, mcpProcess);
            // Initialize the process
            try {
                const initRequest = {
                    jsonrpc: '2.0',
                    id: 'auto-init-' + Date.now(),
                    method: 'initialize',
                    params: {
                        protocolVersion: '2024-11-05',
                        capabilities: {},
                        clientInfo: {
                            name: 'mcp-router-enhanced',
                            version: '2.0.0'
                        }
                    }
                };
                await this.sendRequest(mcpProcess, initRequest);
                logger_1.logger.info(`Successfully initialized ${serviceName}`);
            }
            catch (error) {
                logger_1.logger.warn(`Failed to initialize ${serviceName}:`, error);
            }
            // Wait for process to be ready after initialization
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        mcpProcess.lastUsed = Date.now();
        return mcpProcess;
    }
    processBuffer(mcpProcess) {
        const lines = mcpProcess.buffer.split('\n');
        mcpProcess.buffer = lines.pop() || ''; // Keep incomplete line in buffer
        for (const line of lines) {
            if (line.trim()) {
                logger_1.logger.debug(`Raw line received: ${line}`);
                try {
                    // Enhanced JSON parsing with recovery (Phase 1 fix)
                    let cleanedLine = line.trim();
                    // Fix common JSON issues
                    cleanedLine = cleanedLine
                        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
                        .replace(/,\s*}/g, '}') // Remove trailing commas
                        .replace(/,\s*]/g, ']'); // Remove trailing commas in arrays
                    const response = JSON.parse(cleanedLine);
                    logger_1.logger.info(`Received response with ID: ${response.id}, pending IDs: ${Array.from(mcpProcess.pendingRequests.keys())}`);
                    logger_1.logger.debug(`Full response: ${JSON.stringify(response, null, 2)}`);
                    if (response.id !== undefined && mcpProcess.pendingRequests.has(response.id)) {
                        const resolve = mcpProcess.pendingRequests.get(response.id);
                        mcpProcess.pendingRequests.delete(response.id);
                        logger_1.logger.info(`✅ Successfully matched and resolved request ID: ${response.id}`);
                        resolve(response);
                    }
                    else {
                        logger_1.logger.warn(`❌ Response ID ${response.id} not found in pending requests. Pending: [${Array.from(mcpProcess.pendingRequests.keys()).join(', ')}]`);
                    }
                }
                catch (e) {
                    // Try to recover partial JSON
                    logger_1.logger.warn(`Failed to parse line as JSON: ${line} - Error: ${e}`);
                    // Attempt to extract partial response
                    const idMatch = line.match(/"id"\s*:\s*(\d+)/);
                    if (idMatch) {
                        const id = parseInt(idMatch[1]);
                        if (mcpProcess.pendingRequests.has(id)) {
                            logger_1.logger.info(`Attempting to recover request ${id} with error response`);
                            const resolve = mcpProcess.pendingRequests.get(id);
                            mcpProcess.pendingRequests.delete(id);
                            resolve({ id, error: { message: `JSON parse error: ${e}` } });
                        }
                    }
                }
            }
        }
    }
    async sendRequest(mcpProcess, request) {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                mcpProcess.pendingRequests.delete(request.id);
                reject(new Error('Request timeout'));
            }, parseInt(process.env.REQUEST_TIMEOUT || '600000')); // 10 minutes (Phase 1 fix)
            logger_1.logger.info(`Sending request with ID: ${request.id}, method: ${request.method}`);
            mcpProcess.pendingRequests.set(request.id, (response) => {
                clearTimeout(timeout);
                resolve(response);
            });
            const requestStr = JSON.stringify(request) + '\n';
            mcpProcess.process.stdin?.write(requestStr);
        });
    }
    cleanupIdleProcesses() {
        const now = Date.now();
        for (const [serviceName, mcpProcess] of this.processes) {
            if (now - mcpProcess.lastUsed > this.idleTimeout) {
                logger_1.logger.info(`Cleaning up idle process: ${serviceName}`);
                mcpProcess.process.kill('SIGTERM');
                this.processes.delete(serviceName);
            }
        }
    }
    isTaskToolWithMCPSupport(toolName) {
        const supportedTools = [
            'parse_prd', 'expand_task', 'analyze_project_complexity',
            'generate_files', 'next_task', 'update_task'
        ];
        return supportedTools.includes(toolName);
    }
    async handleTaskMCPCall(taskTool, directive, originalRequest) {
        try {
            // Task MCP 라우터를 통해 호출 검증
            const routingResult = await taskMCPRouter.routeMCPCall(taskTool, directive);
            if (!routingResult.allowed) {
                return {
                    jsonrpc: '2.0',
                    id: originalRequest.id,
                    error: {
                        code: -32602,
                        message: `MCP call not allowed: ${routingResult.reason}`
                    }
                };
            }
            // 대상 MCP 서비스로 요청 전달
            const targetRequest = {
                jsonrpc: '2.0',
                id: (0, uuid_1.v4)(),
                method: directive.method,
                params: directive.params
            };
            // 메타데이터 추가
            if (routingResult.modifiedDirective?.metadata) {
                targetRequest.params = {
                    ...targetRequest.params,
                    _metadata: routingResult.modifiedDirective.metadata
                };
            }
            // 대상 서비스 호출
            const response = await this.executeMCP(directive.targetService, targetRequest);
            // Task 도구에 응답 반환
            return {
                jsonrpc: '2.0',
                id: originalRequest.id,
                result: {
                    mcpResponse: response,
                    routing: {
                        tool: taskTool,
                        targetService: directive.targetService,
                        method: directive.method,
                        timestamp: new Date().toISOString()
                    }
                }
            };
        }
        catch (error) {
            logger_1.logger.error(`Error in Task MCP routing:`, error);
            return {
                jsonrpc: '2.0',
                id: originalRequest.id,
                error: {
                    code: -32603,
                    message: `Task MCP routing error: ${error.message}`
                }
            };
        }
    }
    async shutdown() {
        clearInterval(this.cleanupInterval);
        // Phase 2: 커넥션 풀 종료
        if (process.env.ENABLE_CONNECTION_POOL === 'true') {
            await ConnectionPool_1.connectionPool.shutdown();
        }
        // Phase 3: Service Manager 종료
        if (this.serviceManager) {
            this.serviceManager.shutdown();
        }
        for (const [serviceName, mcpProcess] of this.processes) {
            logger_1.logger.info(`Shutting down process: ${serviceName}`);
            mcpProcess.process.kill('SIGTERM');
        }
        this.processes.clear();
        // Phase 2: 메트릭 최종 리포트
        const finalMetrics = MetricsCollector_1.metricsCollector.getSummary();
        logger_1.logger.info('[Phase 2] Final metrics:', finalMetrics);
        // Phase 3: Dynamic Discovery 종료
        logger_1.logger.info('[Phase 3] Dynamic Service Discovery shutdown complete');
    }
    // Phase 2 + Phase 3: 상태 조회 메서드
    async getStatus() {
        // Ensure initialized for Phase 3
        if (!this.isInitialized) {
            await this.initialize();
        }
        return {
            processes: Array.from(this.processes.keys()),
            cache: MCPResponseCache_1.mcpCache.getStatus(),
            metrics: MetricsCollector_1.metricsCollector.getSummary(),
            circuitBreakers: CircuitBreaker_1.circuitManager.getAllStatus(),
            connectionPool: process.env.ENABLE_CONNECTION_POOL === 'true' ?
                ConnectionPool_1.connectionPool.getStatus() : 'disabled',
            // Phase 3: Dynamic Service Discovery status
            dynamicDiscovery: {
                enabled: process.env.ENABLE_DYNAMIC_DISCOVERY !== 'false',
                services: this.serviceManager ? this.serviceManager.getServiceStatus() : null,
                count: this.serviceManager ? this.serviceManager.getServiceCount() : null
            }
        };
    }
}
exports.MCPPersistentRouterEnhanced = MCPPersistentRouterEnhanced;
//# sourceMappingURL=MCPPersistentRouterEnhanced.js.map