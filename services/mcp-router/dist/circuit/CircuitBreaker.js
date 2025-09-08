"use strict";
/**
 * Phase 2A - Circuit Breaker Pattern
 * 예상 안정성 개선: 20% (장애 격리 및 빠른 실패)
 *
 * 서킷 브레이커 상태:
 * - CLOSED: 정상 작동
 * - OPEN: 호출 차단 (빠른 실패)
 * - HALF_OPEN: 복구 테스트
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.circuitManager = exports.CircuitBreakerManager = exports.CircuitBreaker = void 0;
const events_1 = require("events");
var CircuitState;
(function (CircuitState) {
    CircuitState["CLOSED"] = "CLOSED";
    CircuitState["OPEN"] = "OPEN";
    CircuitState["HALF_OPEN"] = "HALF_OPEN";
})(CircuitState || (CircuitState = {}));
class CircuitBreaker extends events_1.EventEmitter {
    serviceName;
    config;
    state = CircuitState.CLOSED;
    stats = {
        successCount: 0,
        failureCount: 0,
        slowCallCount: 0,
        totalCount: 0,
        averageResponseTime: 0
    };
    halfOpenCalls = 0;
    maxHalfOpenCalls = 3;
    stateChangeTime = Date.now();
    resetTimer;
    // 서비스별 서킷 브레이커 설정
    static configs = new Map([
        ['clear-thought', {
                failureThreshold: 50,
                failureCount: 5,
                timeout: 45000,
                resetTimeout: 30000,
                volumeThreshold: 10,
                slowCallDuration: 20000,
                slowCallThreshold: 50
            }],
        ['stochastic-thinking', {
                failureThreshold: 50,
                failureCount: 5,
                timeout: 60000,
                resetTimeout: 30000,
                volumeThreshold: 10,
                slowCallDuration: 30000,
                slowCallThreshold: 50
            }],
        ['default', {
                failureThreshold: 60,
                failureCount: 3,
                timeout: 30000,
                resetTimeout: 20000,
                volumeThreshold: 5,
                slowCallDuration: 10000,
                slowCallThreshold: 60
            }]
    ]);
    constructor(serviceName, config) {
        super();
        this.serviceName = serviceName;
        this.config = config;
        if (!config) {
            this.config = CircuitBreaker.configs.get(serviceName)
                || CircuitBreaker.configs.get('default');
        }
        // 메트릭 리포팅 (1분마다)
        setInterval(() => this.reportMetrics(), 60000);
    }
    /**
     * 서킷 브레이커를 통한 호출 실행
     */
    async execute(fn) {
        // 서킷이 OPEN 상태면 즉시 실패
        if (this.state === CircuitState.OPEN) {
            const error = new Error(`Circuit breaker is OPEN for ${this.serviceName}`);
            error.circuitBreakerOpen = true;
            this.emit('circuit:rejected', { service: this.serviceName });
            throw error;
        }
        // HALF_OPEN 상태에서 제한된 호출만 허용
        if (this.state === CircuitState.HALF_OPEN) {
            if (this.halfOpenCalls >= this.maxHalfOpenCalls) {
                const error = new Error(`Circuit breaker HALF_OPEN limit reached for ${this.serviceName}`);
                error.circuitBreakerHalfOpen = true;
                this.emit('circuit:rejected', { service: this.serviceName });
                throw error;
            }
            this.halfOpenCalls++;
        }
        const startTime = Date.now();
        try {
            // 타임아웃 적용
            const result = await Promise.race([
                fn(),
                this.timeoutPromise(this.config.timeout)
            ]);
            const duration = Date.now() - startTime;
            this.recordSuccess(duration);
            return result;
        }
        catch (error) {
            const duration = Date.now() - startTime;
            this.recordFailure(duration);
            throw error;
        }
    }
    /**
     * 성공 기록
     */
    recordSuccess(duration) {
        this.stats.successCount++;
        this.stats.totalCount++;
        // 평균 응답 시간 업데이트
        this.updateAverageResponseTime(duration);
        // 느린 호출 체크
        if (duration > this.config.slowCallDuration) {
            this.stats.slowCallCount++;
        }
        // HALF_OPEN에서 성공하면 CLOSED로 전환
        if (this.state === CircuitState.HALF_OPEN) {
            if (this.halfOpenCalls >= this.maxHalfOpenCalls) {
                this.transitionTo(CircuitState.CLOSED);
            }
        }
        this.emit('circuit:success', {
            service: this.serviceName,
            duration,
            state: this.state
        });
    }
    /**
     * 실패 기록
     */
    recordFailure(duration) {
        this.stats.failureCount++;
        this.stats.totalCount++;
        this.stats.lastFailureTime = Date.now();
        // 평균 응답 시간 업데이트
        this.updateAverageResponseTime(duration);
        // 실패 임계값 확인
        if (this.shouldOpen()) {
            this.transitionTo(CircuitState.OPEN);
        }
        // HALF_OPEN에서 실패하면 다시 OPEN으로
        if (this.state === CircuitState.HALF_OPEN) {
            this.transitionTo(CircuitState.OPEN);
        }
        this.emit('circuit:failure', {
            service: this.serviceName,
            duration,
            state: this.state,
            stats: this.getStats()
        });
    }
    /**
     * 서킷을 열어야 하는지 확인
     */
    shouldOpen() {
        // 최소 요청 수 미달
        if (this.stats.totalCount < this.config.volumeThreshold) {
            return false;
        }
        // 실패율 계산
        const failureRate = (this.stats.failureCount / this.stats.totalCount) * 100;
        // 느린 호출률 계산
        const slowCallRate = (this.stats.slowCallCount / this.stats.totalCount) * 100;
        return (failureRate >= this.config.failureThreshold ||
            slowCallRate >= this.config.slowCallThreshold ||
            this.stats.failureCount >= this.config.failureCount);
    }
    /**
     * 상태 전환
     */
    transitionTo(newState) {
        const oldState = this.state;
        this.state = newState;
        this.stateChangeTime = Date.now();
        // 상태별 처리
        switch (newState) {
            case CircuitState.OPEN:
                // 리셋 타이머 설정
                if (this.resetTimer) {
                    clearTimeout(this.resetTimer);
                }
                this.resetTimer = setTimeout(() => {
                    this.transitionTo(CircuitState.HALF_OPEN);
                }, this.config.resetTimeout);
                this.emit('circuit:open', {
                    service: this.serviceName,
                    stats: this.getStats()
                });
                break;
            case CircuitState.HALF_OPEN:
                this.halfOpenCalls = 0;
                this.resetStats();
                this.emit('circuit:half_open', {
                    service: this.serviceName
                });
                break;
            case CircuitState.CLOSED:
                this.halfOpenCalls = 0;
                this.resetStats();
                if (this.resetTimer) {
                    clearTimeout(this.resetTimer);
                    this.resetTimer = undefined;
                }
                this.emit('circuit:closed', {
                    service: this.serviceName
                });
                break;
        }
        console.log(`[🔌 Circuit Breaker] ${this.serviceName}: ${oldState} → ${newState}`);
    }
    /**
     * 통계 초기화
     */
    resetStats() {
        this.stats = {
            successCount: 0,
            failureCount: 0,
            slowCallCount: 0,
            totalCount: 0,
            averageResponseTime: 0
        };
    }
    /**
     * 평균 응답 시간 업데이트
     */
    updateAverageResponseTime(duration) {
        const total = this.stats.totalCount;
        const current = this.stats.averageResponseTime;
        this.stats.averageResponseTime = ((current * (total - 1)) + duration) / total;
    }
    /**
     * 타임아웃 Promise
     */
    timeoutPromise(ms) {
        return new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error(`Circuit breaker timeout after ${ms}ms`));
            }, ms);
        });
    }
    /**
     * 메트릭 리포팅
     */
    reportMetrics() {
        if (this.stats.totalCount === 0)
            return;
        const metrics = {
            service: this.serviceName,
            state: this.state,
            successRate: ((this.stats.successCount / this.stats.totalCount) * 100).toFixed(2) + '%',
            failureRate: ((this.stats.failureCount / this.stats.totalCount) * 100).toFixed(2) + '%',
            slowCallRate: ((this.stats.slowCallCount / this.stats.totalCount) * 100).toFixed(2) + '%',
            averageResponseTime: this.stats.averageResponseTime.toFixed(0) + 'ms',
            totalCalls: this.stats.totalCount,
            uptime: Date.now() - this.stateChangeTime
        };
        this.emit('circuit:metrics', metrics);
        console.log('[📊 Circuit Metrics]', metrics);
    }
    /**
     * 현재 상태 조회
     */
    getState() {
        return this.state;
    }
    /**
     * 통계 조회
     */
    getStats() {
        return {
            ...this.stats,
            state: this.state
        };
    }
    /**
     * 수동 리셋
     */
    reset() {
        this.transitionTo(CircuitState.CLOSED);
    }
    /**
     * 수동으로 서킷 열기
     */
    open() {
        this.transitionTo(CircuitState.OPEN);
    }
}
exports.CircuitBreaker = CircuitBreaker;
// 서킷 브레이커 관리자
class CircuitBreakerManager {
    static instance;
    breakers = new Map();
    constructor() { }
    static getInstance() {
        if (!CircuitBreakerManager.instance) {
            CircuitBreakerManager.instance = new CircuitBreakerManager();
        }
        return CircuitBreakerManager.instance;
    }
    /**
     * 서비스별 서킷 브레이커 가져오기
     */
    getBreaker(serviceName) {
        if (!this.breakers.has(serviceName)) {
            const breaker = new CircuitBreaker(serviceName);
            this.breakers.set(serviceName, breaker);
            // 이벤트 리스닝
            breaker.on('circuit:open', (data) => {
                console.error(`[⚠️ Circuit OPEN] Service ${data.service} is unavailable`);
            });
            breaker.on('circuit:closed', (data) => {
                console.log(`[✅ Circuit CLOSED] Service ${data.service} recovered`);
            });
        }
        return this.breakers.get(serviceName);
    }
    /**
     * 모든 서킷 브레이커 상태
     */
    getAllStatus() {
        return Array.from(this.breakers.entries()).map(([service, breaker]) => ({
            service,
            state: breaker.getState(),
            stats: breaker.getStats()
        }));
    }
    /**
     * 모든 서킷 리셋
     */
    resetAll() {
        for (const breaker of this.breakers.values()) {
            breaker.reset();
        }
    }
}
exports.CircuitBreakerManager = CircuitBreakerManager;
// 싱글톤 인스턴스 export
exports.circuitManager = CircuitBreakerManager.getInstance();
//# sourceMappingURL=CircuitBreaker.js.map