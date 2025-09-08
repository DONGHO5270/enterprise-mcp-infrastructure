/**
 * Phase 2B - Retry Logic with Exponential Backoff
 * 예상 일시적 장애 대응 개선: 10%
 *
 * 재시도 전략:
 * - 지수 백오프
 * - 지터(Jitter) 추가
 * - 재시도 가능 에러 분류
 */
import { EventEmitter } from 'events';
interface RetryConfig {
    maxRetries: number;
    initialDelay: number;
    maxDelay: number;
    backoffMultiplier: number;
    jitterRange: number;
    retryableErrors: string[];
    timeout: number;
}
interface RetryAttempt {
    attemptNumber: number;
    delay: number;
    error?: Error;
    timestamp: number;
}
interface RetryResult<T> {
    success: boolean;
    result?: T;
    error?: Error;
    attempts: RetryAttempt[];
    totalDuration: number;
}
export declare class RetryManager extends EventEmitter {
    private static instance;
    private configs;
    private stats;
    private constructor();
    static getInstance(): RetryManager;
    /**
     * 재시도 로직 실행
     */
    executeWithRetry<T>(serviceName: string, operation: () => Promise<T>, customConfig?: Partial<RetryConfig>): Promise<RetryResult<T>>;
    /**
     * 지연 시간 계산 (지수 백오프 + 지터)
     */
    private calculateDelay;
    /**
     * 재시도 가능한 에러인지 확인
     */
    private isRetryableError;
    /**
     * 설정 가져오기
     */
    private getConfig;
    /**
     * 슬립 함수
     */
    private sleep;
    /**
     * 타임아웃 Promise
     */
    private timeoutPromise;
    /**
     * 통계 업데이트
     */
    private updateStats;
    /**
     * 통계 리포팅
     */
    private reportStats;
    /**
     * 설정 업데이트
     */
    updateConfig(serviceName: string, config: Partial<RetryConfig>): void;
    /**
     * 통계 조회
     */
    getStats(): {
        services: {
            attempts: number;
            successes: number;
            failures: number;
            service: string;
        }[];
        totalAttempts: number;
        successfulRetries: number;
        failedRetries: number;
        averageAttempts: number;
        serviceStats: Map<string, {
            attempts: number;
            successes: number;
            failures: number;
        }>;
    };
    /**
     * 통계 초기화
     */
    resetStats(): void;
}
export declare const retryManager: RetryManager;
/**
 * 헬퍼 함수: 재시도와 함께 실행
 */
export declare function withRetry<T>(serviceName: string, operation: () => Promise<T>, config?: Partial<RetryConfig>): Promise<T>;
export {};
//# sourceMappingURL=RetryManager.d.ts.map