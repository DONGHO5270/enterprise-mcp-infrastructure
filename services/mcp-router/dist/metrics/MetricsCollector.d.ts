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
import { EventEmitter } from 'events';
interface RequestMetric {
    service: string;
    method: string;
    duration: number;
    success: boolean;
    error?: string;
    timestamp: number;
    cacheHit?: boolean;
    circuitState?: string;
}
interface ServiceMetrics {
    totalRequests: number;
    successCount: number;
    errorCount: number;
    averageDuration: number;
    p50Duration: number;
    p95Duration: number;
    p99Duration: number;
    rps: number;
    errorRate: number;
    cacheHitRate: number;
    durations: number[];
}
export declare class MetricsCollector extends EventEmitter {
    private static instance;
    private metrics;
    private serviceMetrics;
    private startTime;
    private windowSize;
    private maxMetricsSize;
    private requestCounter;
    private errorCounter;
    private cacheHitCounter;
    private cacheMissCounter;
    private constructor();
    static getInstance(): MetricsCollector;
    /**
     * 요청 메트릭 기록
     */
    recordRequest(metric: Omit<RequestMetric, 'timestamp'>): void;
    /**
     * 메트릭 집계
     */
    private aggregateMetrics;
    /**
     * 백분위수 계산
     */
    private percentile;
    /**
     * 오래된 메트릭 정리
     */
    private cleanupOldMetrics;
    /**
     * 시스템 메트릭 수집
     */
    private collectSystemMetrics;
    /**
     * 서비스별 메트릭 조회
     */
    getServiceMetrics(service?: string): ServiceMetrics | Map<string, ServiceMetrics>;
    /**
     * 전체 요약 통계
     */
    getSummary(): {
        uptime: number;
        totalRequests: number;
        totalErrors: number;
        errorRate: string;
        cacheHitRate: string;
        averageResponseTime: string;
        averageP95: string;
        rps: string;
        services: number;
        activeMetrics: number;
    };
    /**
     * 상위 에러 서비스
     */
    getTopErrors(limit?: number): Array<{
        service: string;
        errorRate: number;
        errorCount: number;
    }>;
    /**
     * 상위 느린 서비스
     */
    getTopSlow(limit?: number): Array<{
        service: string;
        p95: number;
        average: number;
    }>;
    /**
     * 빈 메트릭 생성
     */
    private createEmptyMetrics;
    /**
     * 메트릭 리셋
     */
    reset(): void;
    /**
     * 대시보드용 포맷된 데이터
     */
    getDashboardData(): {
        summary: {
            uptime: number;
            totalRequests: number;
            totalErrors: number;
            errorRate: string;
            cacheHitRate: string;
            averageResponseTime: string;
            averageP95: string;
            rps: string;
            services: number;
            activeMetrics: number;
        };
        services: {
            [k: string]: ServiceMetrics;
        };
        topErrors: {
            service: string;
            errorRate: number;
            errorCount: number;
        }[];
        topSlow: {
            service: string;
            p95: number;
            average: number;
        }[];
        recentErrors: RequestMetric[];
        timestamp: number;
    };
}
export declare const metricsCollector: MetricsCollector;
export declare function metricsMiddleware(): (req: any, res: any, next: any) => void;
export {};
//# sourceMappingURL=MetricsCollector.d.ts.map