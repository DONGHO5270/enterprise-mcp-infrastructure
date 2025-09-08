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
  maxRetries: number;           // 최대 재시도 횟수
  initialDelay: number;          // 초기 지연 시간 (ms)
  maxDelay: number;              // 최대 지연 시간 (ms)
  backoffMultiplier: number;     // 백오프 배수
  jitterRange: number;           // 지터 범위 (0-1)
  retryableErrors: string[];     // 재시도 가능 에러 패턴
  timeout: number;               // 전체 타임아웃
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

export class RetryManager extends EventEmitter {
  private static instance: RetryManager;
  
  // 서비스별 재시도 설정
  private configs: Map<string, RetryConfig> = new Map([
    ['clear-thought', {
      maxRetries: 3,
      initialDelay: 1000,      // 1초
      maxDelay: 10000,         // 10초
      backoffMultiplier: 2,
      jitterRange: 0.3,
      retryableErrors: ['ETIMEDOUT', 'ECONNRESET', 'ECONNREFUSED', 'timeout'],
      timeout: 60000           // 1분
    }],
    ['stochastic-thinking', {
      maxRetries: 3,
      initialDelay: 2000,      // 2초
      maxDelay: 15000,         // 15초
      backoffMultiplier: 2,
      jitterRange: 0.3,
      retryableErrors: ['ETIMEDOUT', 'ECONNRESET', 'ECONNREFUSED', 'timeout'],
      timeout: 90000           // 1.5분
    }],
    ['default', {
      maxRetries: 2,
      initialDelay: 500,       // 0.5초
      maxDelay: 5000,          // 5초
      backoffMultiplier: 2,
      jitterRange: 0.2,
      retryableErrors: ['ETIMEDOUT', 'ECONNRESET', 'ECONNREFUSED'],
      timeout: 30000           // 30초
    }]
  ]);
  
  // 재시도 통계
  private stats = {
    totalAttempts: 0,
    successfulRetries: 0,
    failedRetries: 0,
    averageAttempts: 0,
    serviceStats: new Map<string, {
      attempts: number;
      successes: number;
      failures: number;
    }>()
  };
  
  private constructor() {
    super();
    
    // 통계 리포팅 (5분마다)
    setInterval(() => this.reportStats(), 300000);
  }
  
  static getInstance(): RetryManager {
    if (!RetryManager.instance) {
      RetryManager.instance = new RetryManager();
    }
    return RetryManager.instance;
  }
  
  /**
   * 재시도 로직 실행
   */
  async executeWithRetry<T>(
    serviceName: string,
    operation: () => Promise<T>,
    customConfig?: Partial<RetryConfig>
  ): Promise<RetryResult<T>> {
    const config = this.getConfig(serviceName, customConfig);
    const attempts: RetryAttempt[] = [];
    const startTime = Date.now();
    
    let lastError: Error | undefined;
    
    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      const attemptStart = Date.now();
      
      // 타임아웃 체크
      if (attemptStart - startTime > config.timeout) {
        lastError = new Error(`Retry timeout exceeded after ${attempt} attempts`);
        break;
      }
      
      try {
        // 재시도 전 지연 (첫 시도는 지연 없음)
        if (attempt > 0) {
          const delay = this.calculateDelay(attempt, config);
          attempts.push({
            attemptNumber: attempt,
            delay,
            timestamp: attemptStart
          });
          
          this.emit('retry:delay', {
            service: serviceName,
            attempt,
            delay
          });
          
          await this.sleep(delay);
        }
        
        // 작업 실행
        const result = await Promise.race([
          operation(),
          this.timeoutPromise(config.timeout - (Date.now() - startTime))
        ]);
        
        // 성공
        this.updateStats(serviceName, true, attempt + 1);
        
        this.emit('retry:success', {
          service: serviceName,
          attempts: attempt + 1,
          duration: Date.now() - startTime
        });
        
        return {
          success: true,
          result,
          attempts,
          totalDuration: Date.now() - startTime
        };
        
      } catch (error: any) {
        lastError = error;
        
        attempts.push({
          attemptNumber: attempt + 1,
          delay: 0,
          error,
          timestamp: attemptStart
        });
        
        // 재시도 가능한 에러인지 확인
        if (!this.isRetryableError(error, config)) {
          this.emit('retry:non_retryable', {
            service: serviceName,
            error: error.message,
            attempt: attempt + 1
          });
          break;
        }
        
        // 마지막 시도가 아니면 계속
        if (attempt < config.maxRetries) {
          this.emit('retry:attempt', {
            service: serviceName,
            attempt: attempt + 1,
            error: error.message,
            nextDelay: this.calculateDelay(attempt + 1, config)
          });
          continue;
        }
      }
    }
    
    // 모든 재시도 실패
    this.updateStats(serviceName, false, attempts.length);
    
    this.emit('retry:failed', {
      service: serviceName,
      attempts: attempts.length,
      duration: Date.now() - startTime,
      error: lastError?.message
    });
    
    return {
      success: false,
      error: lastError,
      attempts,
      totalDuration: Date.now() - startTime
    };
  }
  
  /**
   * 지연 시간 계산 (지수 백오프 + 지터)
   */
  private calculateDelay(attempt: number, config: RetryConfig): number {
    // 지수 백오프
    let delay = config.initialDelay * Math.pow(config.backoffMultiplier, attempt - 1);
    
    // 최대 지연 시간 제한
    delay = Math.min(delay, config.maxDelay);
    
    // 지터 추가 (충돌 방지)
    const jitter = delay * config.jitterRange * Math.random();
    delay = delay + jitter;
    
    return Math.floor(delay);
  }
  
  /**
   * 재시도 가능한 에러인지 확인
   */
  private isRetryableError(error: Error, config: RetryConfig): boolean {
    const errorMessage = error.message.toLowerCase();
    const errorCode = (error as any).code;
    
    // 서킷 브레이커가 열려있으면 재시도하지 않음
    if ((error as any).circuitBreakerOpen) {
      return false;
    }
    
    // 재시도 가능한 에러 패턴 확인
    for (const pattern of config.retryableErrors) {
      if (errorCode === pattern || errorMessage.includes(pattern.toLowerCase())) {
        return true;
      }
    }
    
    // HTTP 상태 코드 확인 (5xx는 재시도)
    const statusCode = (error as any).statusCode;
    if (statusCode && statusCode >= 500 && statusCode < 600) {
      return true;
    }
    
    // 429 (Too Many Requests)도 재시도
    if (statusCode === 429) {
      return true;
    }
    
    return false;
  }
  
  /**
   * 설정 가져오기
   */
  private getConfig(serviceName: string, customConfig?: Partial<RetryConfig>): RetryConfig {
    const baseConfig = this.configs.get(serviceName) || this.configs.get('default')!;
    
    if (customConfig) {
      return { ...baseConfig, ...customConfig };
    }
    
    return baseConfig;
  }
  
  /**
   * 슬립 함수
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * 타임아웃 Promise
   */
  private timeoutPromise(ms: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        const error = new Error(`Operation timeout after ${ms}ms`);
        (error as any).code = 'ETIMEDOUT';
        reject(error);
      }, ms);
    });
  }
  
  /**
   * 통계 업데이트
   */
  private updateStats(serviceName: string, success: boolean, attempts: number): void {
    this.stats.totalAttempts += attempts;
    
    if (success) {
      this.stats.successfulRetries++;
    } else {
      this.stats.failedRetries++;
    }
    
    // 서비스별 통계
    if (!this.stats.serviceStats.has(serviceName)) {
      this.stats.serviceStats.set(serviceName, {
        attempts: 0,
        successes: 0,
        failures: 0
      });
    }
    
    const serviceStats = this.stats.serviceStats.get(serviceName)!;
    serviceStats.attempts += attempts;
    
    if (success) {
      serviceStats.successes++;
    } else {
      serviceStats.failures++;
    }
    
    // 평균 시도 횟수 계산
    const totalOperations = this.stats.successfulRetries + this.stats.failedRetries;
    this.stats.averageAttempts = this.stats.totalAttempts / totalOperations;
  }
  
  /**
   * 통계 리포팅
   */
  private reportStats(): void {
    const successRate = this.stats.successfulRetries / 
                       (this.stats.successfulRetries + this.stats.failedRetries) || 0;
    
    const report = {
      totalAttempts: this.stats.totalAttempts,
      successfulRetries: this.stats.successfulRetries,
      failedRetries: this.stats.failedRetries,
      successRate: (successRate * 100).toFixed(2) + '%',
      averageAttempts: this.stats.averageAttempts.toFixed(2),
      services: Array.from(this.stats.serviceStats.entries()).map(([service, stats]) => ({
        service,
        ...stats,
        successRate: ((stats.successes / (stats.successes + stats.failures)) * 100).toFixed(2) + '%'
      }))
    };
    
    this.emit('retry:stats', report);
    console.log('[📊 Retry Stats]', report);
  }
  
  /**
   * 설정 업데이트
   */
  updateConfig(serviceName: string, config: Partial<RetryConfig>): void {
    const current = this.configs.get(serviceName) || this.configs.get('default')!;
    this.configs.set(serviceName, { ...current, ...config });
    
    this.emit('retry:config_updated', { service: serviceName, config });
  }
  
  /**
   * 통계 조회
   */
  getStats() {
    return {
      ...this.stats,
      services: Array.from(this.stats.serviceStats.entries()).map(([service, stats]) => ({
        service,
        ...stats
      }))
    };
  }
  
  /**
   * 통계 초기화
   */
  resetStats(): void {
    this.stats = {
      totalAttempts: 0,
      successfulRetries: 0,
      failedRetries: 0,
      averageAttempts: 0,
      serviceStats: new Map()
    };
    
    this.emit('retry:stats_reset');
  }
}

// 싱글톤 인스턴스
export const retryManager = RetryManager.getInstance();

/**
 * 헬퍼 함수: 재시도와 함께 실행
 */
export async function withRetry<T>(
  serviceName: string,
  operation: () => Promise<T>,
  config?: Partial<RetryConfig>
): Promise<T> {
  const result = await retryManager.executeWithRetry(serviceName, operation, config);
  
  if (result.success) {
    return result.result!;
  } else {
    throw result.error;
  }
}