"use strict";
/**
 * Phase 2A - Metrics Collection System
 * 모니터링 및 디버깅 향상
 *
 * 수집 메트릭:
 * - 응답 시간 (P50, P95, P99)
 * - 처리량 (RPS)
 * - 에러율
 * - 리소스 사용량
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsCollector = exports.MetricsCollector = void 0;
exports.metricsMiddleware = metricsMiddleware;
const events_1 = require("events");
const os = __importStar(require("os"));
class MetricsCollector extends events_1.EventEmitter {
    static instance;
    metrics = [];
    serviceMetrics = new Map();
    startTime = Date.now();
    windowSize = 300000; // 5분 윈도우
    maxMetricsSize = 10000; // 최대 저장 메트릭 수
    // 실시간 카운터
    requestCounter = 0;
    errorCounter = 0;
    cacheHitCounter = 0;
    cacheMissCounter = 0;
    constructor() {
        super();
        // 주기적 정리 (1분마다)
        setInterval(() => this.cleanupOldMetrics(), 60000);
        // 메트릭 집계 (10초마다)
        setInterval(() => this.aggregateMetrics(), 10000);
        // 시스템 메트릭 수집 (30초마다)
        setInterval(() => this.collectSystemMetrics(), 30000);
    }
    static getInstance() {
        if (!MetricsCollector.instance) {
            MetricsCollector.instance = new MetricsCollector();
        }
        return MetricsCollector.instance;
    }
    /**
     * 요청 메트릭 기록
     */
    recordRequest(metric) {
        const fullMetric = {
            ...metric,
            timestamp: Date.now()
        };
        this.metrics.push(fullMetric);
        this.requestCounter++;
        if (metric.success) {
            if (metric.cacheHit) {
                this.cacheHitCounter++;
            }
            else {
                this.cacheMissCounter++;
            }
        }
        else {
            this.errorCounter++;
        }
        // 크기 제한
        if (this.metrics.length > this.maxMetricsSize) {
            this.metrics.shift();
        }
        // 실시간 이벤트 발생
        this.emit('metric:request', fullMetric);
        // 에러 알림
        if (!metric.success) {
            this.emit('metric:error', {
                service: metric.service,
                method: metric.method,
                error: metric.error
            });
        }
        // 느린 요청 알림 (5초 이상)
        if (metric.duration > 5000) {
            this.emit('metric:slow_request', {
                service: metric.service,
                method: metric.method,
                duration: metric.duration
            });
        }
    }
    /**
     * 메트릭 집계
     */
    aggregateMetrics() {
        const now = Date.now();
        const windowStart = now - this.windowSize;
        // 윈도우 내 메트릭만 필터링
        const recentMetrics = this.metrics.filter(m => m.timestamp > windowStart);
        // 서비스별 집계
        const serviceGroups = new Map();
        for (const metric of recentMetrics) {
            const key = metric.service;
            if (!serviceGroups.has(key)) {
                serviceGroups.set(key, []);
            }
            serviceGroups.get(key).push(metric);
        }
        // 각 서비스 메트릭 계산
        for (const [service, metrics] of serviceGroups) {
            const durations = metrics.map(m => m.duration).sort((a, b) => a - b);
            const successCount = metrics.filter(m => m.success).length;
            const errorCount = metrics.filter(m => !m.success).length;
            const cacheHits = metrics.filter(m => m.cacheHit).length;
            const serviceMetric = {
                totalRequests: metrics.length,
                successCount,
                errorCount,
                averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length || 0,
                p50Duration: this.percentile(durations, 50),
                p95Duration: this.percentile(durations, 95),
                p99Duration: this.percentile(durations, 99),
                rps: metrics.length / (this.windowSize / 1000), // requests per second
                errorRate: (errorCount / metrics.length) * 100 || 0,
                cacheHitRate: (cacheHits / successCount) * 100 || 0,
                durations
            };
            this.serviceMetrics.set(service, serviceMetric);
        }
        this.emit('metrics:aggregated', this.getServiceMetrics());
    }
    /**
     * 백분위수 계산
     */
    percentile(sorted, percentile) {
        if (sorted.length === 0)
            return 0;
        const index = Math.ceil((percentile / 100) * sorted.length) - 1;
        return sorted[Math.max(0, Math.min(index, sorted.length - 1))];
    }
    /**
     * 오래된 메트릭 정리
     */
    cleanupOldMetrics() {
        const now = Date.now();
        const cutoff = now - this.windowSize * 2; // 10분 이상 된 메트릭 제거
        const before = this.metrics.length;
        this.metrics = this.metrics.filter(m => m.timestamp > cutoff);
        const after = this.metrics.length;
        if (before - after > 0) {
            this.emit('metrics:cleanup', { removed: before - after, remaining: after });
        }
    }
    /**
     * 시스템 메트릭 수집
     */
    collectSystemMetrics() {
        const cpus = os.cpus();
        const totalCpu = cpus.reduce((acc, cpu) => {
            const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
            const idle = cpu.times.idle;
            return acc + ((total - idle) / total);
        }, 0);
        const systemMetrics = {
            cpuUsage: (totalCpu / cpus.length) * 100,
            memoryUsage: ((os.totalmem() - os.freemem()) / os.totalmem()) * 100,
            totalMemory: os.totalmem(),
            freeMemory: os.freemem(),
            uptime: os.uptime(),
            loadAverage: os.loadavg(),
            processMemory: process.memoryUsage()
        };
        this.emit('metrics:system', systemMetrics);
        // 높은 메모리 사용 경고 (80% 이상)
        if (systemMetrics.memoryUsage > 80) {
            this.emit('metrics:warning', {
                type: 'high_memory',
                usage: systemMetrics.memoryUsage,
                free: systemMetrics.freeMemory
            });
        }
        // 높은 CPU 사용 경고 (90% 이상)
        if (systemMetrics.cpuUsage > 90) {
            this.emit('metrics:warning', {
                type: 'high_cpu',
                usage: systemMetrics.cpuUsage,
                loadAverage: systemMetrics.loadAverage
            });
        }
    }
    /**
     * 서비스별 메트릭 조회
     */
    getServiceMetrics(service) {
        if (service) {
            return this.serviceMetrics.get(service) || this.createEmptyMetrics();
        }
        return this.serviceMetrics;
    }
    /**
     * 전체 요약 통계
     */
    getSummary() {
        const uptime = Date.now() - this.startTime;
        const totalRequests = this.requestCounter;
        const totalErrors = this.errorCounter;
        const cacheHitRate = this.cacheHitCounter / (this.cacheHitCounter + this.cacheMissCounter) || 0;
        // 모든 서비스의 평균 계산
        let totalDuration = 0;
        let totalP95 = 0;
        let serviceCount = 0;
        for (const metrics of this.serviceMetrics.values()) {
            totalDuration += metrics.averageDuration;
            totalP95 += metrics.p95Duration;
            serviceCount++;
        }
        return {
            uptime: Math.floor(uptime / 1000), // seconds
            totalRequests,
            totalErrors,
            errorRate: ((totalErrors / totalRequests) * 100).toFixed(2) + '%',
            cacheHitRate: (cacheHitRate * 100).toFixed(2) + '%',
            averageResponseTime: serviceCount > 0 ? (totalDuration / serviceCount).toFixed(0) + 'ms' : '0ms',
            averageP95: serviceCount > 0 ? (totalP95 / serviceCount).toFixed(0) + 'ms' : '0ms',
            rps: (totalRequests / (uptime / 1000)).toFixed(2),
            services: this.serviceMetrics.size,
            activeMetrics: this.metrics.length
        };
    }
    /**
     * 상위 에러 서비스
     */
    getTopErrors(limit = 5) {
        return Array.from(this.serviceMetrics.entries())
            .map(([service, metrics]) => ({
            service,
            errorRate: metrics.errorRate,
            errorCount: metrics.errorCount
        }))
            .sort((a, b) => b.errorRate - a.errorRate)
            .slice(0, limit);
    }
    /**
     * 상위 느린 서비스
     */
    getTopSlow(limit = 5) {
        return Array.from(this.serviceMetrics.entries())
            .map(([service, metrics]) => ({
            service,
            p95: metrics.p95Duration,
            average: metrics.averageDuration
        }))
            .sort((a, b) => b.p95 - a.p95)
            .slice(0, limit);
    }
    /**
     * 빈 메트릭 생성
     */
    createEmptyMetrics() {
        return {
            totalRequests: 0,
            successCount: 0,
            errorCount: 0,
            averageDuration: 0,
            p50Duration: 0,
            p95Duration: 0,
            p99Duration: 0,
            rps: 0,
            errorRate: 0,
            cacheHitRate: 0,
            durations: []
        };
    }
    /**
     * 메트릭 리셋
     */
    reset() {
        this.metrics = [];
        this.serviceMetrics.clear();
        this.requestCounter = 0;
        this.errorCounter = 0;
        this.cacheHitCounter = 0;
        this.cacheMissCounter = 0;
        this.startTime = Date.now();
        this.emit('metrics:reset');
    }
    /**
     * 대시보드용 포맷된 데이터
     */
    getDashboardData() {
        return {
            summary: this.getSummary(),
            services: Object.fromEntries(this.serviceMetrics),
            topErrors: this.getTopErrors(),
            topSlow: this.getTopSlow(),
            recentErrors: this.metrics
                .filter(m => !m.success)
                .slice(-10)
                .reverse(),
            timestamp: Date.now()
        };
    }
}
exports.MetricsCollector = MetricsCollector;
// 싱글톤 인스턴스
exports.metricsCollector = MetricsCollector.getInstance();
// Express 미들웨어
function metricsMiddleware() {
    return (req, res, next) => {
        const startTime = Date.now();
        const { service, method } = req.body || req.params || {};
        // 응답 완료 시 메트릭 기록
        res.on('finish', () => {
            const duration = Date.now() - startTime;
            const success = res.statusCode < 400;
            exports.metricsCollector.recordRequest({
                service: service || 'unknown',
                method: method || req.method,
                duration,
                success,
                error: success ? undefined : `HTTP ${res.statusCode}`,
                cacheHit: res.getHeader('X-Cache-Hit') === 'true',
                circuitState: res.getHeader('X-Circuit-State')
            });
        });
        next();
    };
}
//# sourceMappingURL=MetricsCollector.js.map