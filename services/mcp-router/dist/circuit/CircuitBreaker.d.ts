/**
 * Phase 2A - Circuit Breaker Pattern
 * 예상 안정성 개선: 20% (장애 격리 및 빠른 실패)
 *
 * 서킷 브레이커 상태:
 * - CLOSED: 정상 작동
 * - OPEN: 호출 차단 (빠른 실패)
 * - HALF_OPEN: 복구 테스트
 */
import { EventEmitter } from 'events';
declare enum CircuitState {
    CLOSED = "CLOSED",
    OPEN = "OPEN",
    HALF_OPEN = "HALF_OPEN"
}
interface CircuitConfig {
    failureThreshold: number;
    failureCount: number;
    timeout: number;
    resetTimeout: number;
    volumeThreshold: number;
    slowCallDuration: number;
    slowCallThreshold: number;
}
interface CallStats {
    successCount: number;
    failureCount: number;
    slowCallCount: number;
    totalCount: number;
    lastFailureTime?: number;
    averageResponseTime: number;
}
export declare class CircuitBreaker extends EventEmitter {
    private serviceName;
    private config?;
    private state;
    private stats;
    private halfOpenCalls;
    private maxHalfOpenCalls;
    private stateChangeTime;
    private resetTimer?;
    private static configs;
    constructor(serviceName: string, config?: CircuitConfig | undefined);
    /**
     * 서킷 브레이커를 통한 호출 실행
     */
    execute<T>(fn: () => Promise<T>): Promise<T>;
    /**
     * 성공 기록
     */
    private recordSuccess;
    /**
     * 실패 기록
     */
    private recordFailure;
    /**
     * 서킷을 열어야 하는지 확인
     */
    private shouldOpen;
    /**
     * 상태 전환
     */
    private transitionTo;
    /**
     * 통계 초기화
     */
    private resetStats;
    /**
     * 평균 응답 시간 업데이트
     */
    private updateAverageResponseTime;
    /**
     * 타임아웃 Promise
     */
    private timeoutPromise;
    /**
     * 메트릭 리포팅
     */
    private reportMetrics;
    /**
     * 현재 상태 조회
     */
    getState(): CircuitState;
    /**
     * 통계 조회
     */
    getStats(): CallStats & {
        state: CircuitState;
    };
    /**
     * 수동 리셋
     */
    reset(): void;
    /**
     * 수동으로 서킷 열기
     */
    open(): void;
}
export declare class CircuitBreakerManager {
    private static instance;
    private breakers;
    private constructor();
    static getInstance(): CircuitBreakerManager;
    /**
     * 서비스별 서킷 브레이커 가져오기
     */
    getBreaker(serviceName: string): CircuitBreaker;
    /**
     * 모든 서킷 브레이커 상태
     */
    getAllStatus(): Array<{
        service: string;
        state: CircuitState;
        stats: any;
    }>;
    /**
     * 모든 서킷 리셋
     */
    resetAll(): void;
}
export declare const circuitManager: CircuitBreakerManager;
export {};
//# sourceMappingURL=CircuitBreaker.d.ts.map