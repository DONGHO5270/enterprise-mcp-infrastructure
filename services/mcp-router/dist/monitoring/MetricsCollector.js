"use strict";
// ============================================================================
// Phase 1: 실시간 메트릭 수집기 - 핵심 구현
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsCollector = void 0;
const events_1 = require("events");
const logger_1 = require("../utils/logger");
const monitoring_1 = require("./types/monitoring");
class MetricsCollector extends events_1.EventEmitter {
    metrics = new Map();
    collectionInterval = null;
    config;
    isRunning = false;
    // Phase 1 구현용 임시 데이터 저장소
    requestCounts = new Map();
    responseTimes = new Map();
    errorCounts = new Map();
    lastActivity = new Map();
    constructor(config = {}) {
        super();
        this.config = { ...monitoring_1.DEFAULT_MONITORING_CONFIG, ...config };
        logger_1.logger.info('🎯 MetricsCollector initialized - Phase 1 Active');
        this.logPhaseStatus();
    }
    logPhaseStatus() {
        console.log(`
    ========================================
    MCP Monitoring System v1.0
    ========================================
    ✅ Phase 1: Basic Monitoring - ACTIVE
    🔧 Phase 2: Predictive Analysis - READY (disabled)
    🔧 Phase 3: Weight Adjustment - READY (disabled)
    ========================================
    `);
    }
    // ============================================================================
    // Phase 1: 핵심 메트릭 수집 구현
    // ============================================================================
    start() {
        if (this.isRunning) {
            logger_1.logger.warn('MetricsCollector is already running');
            return;
        }
        this.isRunning = true;
        logger_1.logger.info('🚀 Starting MetricsCollector with Phase 1 implementation');
        // 메트릭 수집 간격 설정
        this.collectionInterval = setInterval(() => {
            this.collectMetrics();
        }, this.config.metrics.collectionInterval);
        // 초기 메트릭 수집
        this.collectMetrics();
    }
    stop() {
        if (!this.isRunning)
            return;
        this.isRunning = false;
        if (this.collectionInterval) {
            clearInterval(this.collectionInterval);
            this.collectionInterval = null;
        }
        logger_1.logger.info('🛑 MetricsCollector stopped');
    }
    // ============================================================================
    // Phase 1: 실시간 메트릭 수집
    // ============================================================================
    recordRequest(serviceId, responseTime, isError = false) {
        try {
            // 메트릭 이름 정제 (UTF-8 안전성)
            const sanitizedServiceId = this.sanitizeMetricName(serviceId);
            // 요청 수 증가
            const currentCount = this.requestCounts.get(sanitizedServiceId) || 0;
            this.requestCounts.set(sanitizedServiceId, currentCount + 1);
            // 응답 시간 기록 (최근 100개만 유지)
            const responseTimes = this.responseTimes.get(sanitizedServiceId) || [];
            responseTimes.push(responseTime);
            if (responseTimes.length > 100) {
                responseTimes.shift();
            }
            this.responseTimes.set(sanitizedServiceId, responseTimes);
            // 에러 수 증가
            if (isError) {
                const errorCount = this.errorCounts.get(sanitizedServiceId) || 0;
                this.errorCounts.set(sanitizedServiceId, errorCount + 1);
            }
            // 마지막 활동 시간 업데이트
            this.lastActivity.set(sanitizedServiceId, Date.now());
            // 실시간 이벤트 발송
            this.emit('requestRecorded', {
                serviceId: sanitizedServiceId,
                responseTime,
                isError,
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            logger_1.logger.error('Failed to record request metric:', error);
        }
    }
    getServiceMetrics(serviceId) {
        const sanitizedServiceId = this.sanitizeMetricName(serviceId);
        return this.metrics.get(sanitizedServiceId) || null;
    }
    getAllMetrics() {
        return new Map(this.metrics);
    }
    // ============================================================================
    // Phase 1: 메트릭 계산 및 헬스 상태 결정
    // ============================================================================
    collectMetrics() {
        try {
            const services = this.getMonitoredServices();
            for (const serviceId of services) {
                const metrics = this.calculateServiceMetrics(serviceId);
                this.metrics.set(serviceId, metrics);
                // 실시간 업데이트 이벤트 발송
                this.emit('metricsUpdated', {
                    serviceId,
                    metrics,
                    timestamp: new Date().toISOString()
                });
            }
            logger_1.logger.debug(`Collected metrics for ${services.length} services`);
        }
        catch (error) {
            logger_1.logger.error('Failed to collect metrics:', error);
        }
    }
    calculateServiceMetrics(serviceId) {
        const now = new Date().toISOString();
        const requestCount = this.requestCounts.get(serviceId) || 0;
        const responseTimes = this.responseTimes.get(serviceId) || [];
        const errorCount = this.errorCounts.get(serviceId) || 0;
        const lastActivity = this.lastActivity.get(serviceId) || 0;
        // 응답 시간 통계 계산
        const avgResponseTime = responseTimes.length > 0
            ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
            : 0;
        // 에러율 계산
        const errorRate = requestCount > 0 ? (errorCount / requestCount) * 100 : 0;
        // 헬스 상태 결정
        const health = this.calculateHealthStatus(avgResponseTime, errorRate, lastActivity);
        // 도구 정보 (Phase 1에서는 정적 데이터)
        const toolInfo = this.getToolInfo(serviceId);
        return {
            serviceId,
            health,
            requestCount,
            errorCount,
            avgResponseTime,
            requestsPerSecond: requestCount / 60,
            errorRate,
            performance: {
                avgResponseTime: this.createDataPoints([avgResponseTime]),
                requestsPerMinute: this.createDataPoints([requestCount]),
                errorCount: this.createDataPoints([errorCount])
            },
            tools: toolInfo,
            lastUpdated: now
        };
    }
    calculateHealthStatus(avgResponseTime, errorRate, lastActivity) {
        const timeSinceLastActivity = Date.now() - lastActivity;
        const fiveMinutesAgo = 5 * 60 * 1000;
        let status = 'healthy';
        let trend = 'stable';
        // 상태 결정 로직
        if (timeSinceLastActivity > fiveMinutesAgo) {
            status = 'dead';
        }
        else if (errorRate > 20 || avgResponseTime > 3000) {
            status = 'failing';
        }
        else if (errorRate > 5 || avgResponseTime > 1000) {
            status = 'degraded';
        }
        // 트렌드 분석 (Phase 1에서는 단순화)
        if (avgResponseTime > 1000) {
            trend = 'worsening';
        }
        else if (avgResponseTime < 300) {
            trend = 'improving';
        }
        return {
            status,
            responseTime: Math.round(avgResponseTime),
            errorRate: Math.round(errorRate * 100) / 100,
            trend,
            uptime: Math.floor((Date.now() - (lastActivity || Date.now())) / 1000)
        };
    }
    // ============================================================================
    // Phase 2 & 3: 스켈레톤 메서드 (미구현)
    // ============================================================================
    enablePredictiveAnalysis() {
        if (!this.config.phases.PHASE_2.enabled) {
            logger_1.logger.warn('[PHASE-2] Predictive analysis not enabled yet');
            console.log('🔧 Phase 2: Predictive Analysis - Implementation needed');
            return;
        }
        // TODO: Phase 2 구현 시 예측 분석 로직 추가
    }
    enableWeightAdjustment() {
        if (!this.config.phases.PHASE_3.enabled) {
            logger_1.logger.warn('[PHASE-3] Weight adjustment not enabled yet');
            console.log('🔧 Phase 3: Weight Adjustment - Implementation needed');
            return;
        }
        // TODO: Phase 3 구현 시 가중치 조정 로직 추가
    }
    // ============================================================================
    // 유틸리티 메서드
    // ============================================================================
    sanitizeMetricName(name) {
        return monitoring_1.DEFAULT_METRIC_NAMING.sanitizeFunction(name);
    }
    validateUtf8(text) {
        if (!this.config.encoding.validateUtf8)
            return true;
        try {
            const buffer = Buffer.from(text, 'utf8');
            return buffer.toString('utf8') === text;
        }
        catch {
            return false;
        }
    }
    createDataPoints(values) {
        const now = new Date().toISOString();
        return values.map((value, index) => ({
            timestamp: now,
            value,
            unit: 'count'
        }));
    }
    getMonitoredServices() {
        // 기본적으로 활동이 있었던 모든 서비스 반환
        return Array.from(new Set([
            ...this.requestCounts.keys(),
            ...this.responseTimes.keys(),
            ...this.lastActivity.keys()
        ]));
    }
    getToolInfo(serviceId) {
        // Phase 1에서는 정적 정보 반환 (실제 구현에서는 MCP 서비스에서 가져옴)
        const toolCounts = {
            'vercel': 82,
            'docker': 36,
            'taskmaster-ai': 25,
            'npm-sentinel': 19,
            'desktop-commander': 18,
            'nodejs-debugger': 13,
            'clear-thought': 11,
            'github': 8,
            'serena': 30,
            'supabase': 26,
            'mem0': 3,
            'mermaid': 2,
            'context7': 2,
            'stochastic-thinking': 1
        };
        const totalCount = toolCounts[serviceId] || 0;
        return {
            totalCount,
            activeCount: totalCount, // Phase 1에서는 모든 도구가 활성화됨
            usageDistribution: {} // Phase 2에서 구현 예정
        };
    }
    // ============================================================================
    // 상태 조회 메서드
    // ============================================================================
    getPhaseStatus() {
        return {
            phase1: this.config.phases.PHASE_1,
            phase2: this.config.phases.PHASE_2,
            phase3: this.config.phases.PHASE_3,
            isRunning: this.isRunning,
            servicesMonitored: this.metrics.size
        };
    }
    getHealthySummary() {
        const allMetrics = Array.from(this.metrics.values());
        const healthy = allMetrics.filter(m => m.health.status === 'healthy').length;
        const degraded = allMetrics.filter(m => m.health.status === 'degraded').length;
        const failing = allMetrics.filter(m => m.health.status === 'failing').length;
        const dead = allMetrics.filter(m => m.health.status === 'dead').length;
        return {
            total: allMetrics.length,
            healthy,
            degraded,
            failing,
            dead,
            healthyPercentage: allMetrics.length > 0 ? (healthy / allMetrics.length) * 100 : 0
        };
    }
}
exports.MetricsCollector = MetricsCollector;
//# sourceMappingURL=MetricsCollector.js.map