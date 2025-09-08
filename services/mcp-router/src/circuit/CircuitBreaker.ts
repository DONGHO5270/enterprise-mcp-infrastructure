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

enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN'
}

interface CircuitConfig {
  failureThreshold: number;      // 실패 임계값 (%)
  failureCount: number;          // 최소 실패 횟수
  timeout: number;               // 타임아웃 (ms)
  resetTimeout: number;          // 리셋 대기 시간 (ms)
  volumeThreshold: number;       // 최소 요청 수
  slowCallDuration: number;      // 느린 호출 기준 (ms)
  slowCallThreshold: number;     // 느린 호출 임계값 (%)
}

interface CallStats {
  successCount: number;
  failureCount: number;
  slowCallCount: number;
  totalCount: number;
  lastFailureTime?: number;
  averageResponseTime: number;
}

export class CircuitBreaker extends EventEmitter {
  private state: CircuitState = CircuitState.CLOSED;
  private stats: CallStats = {
    successCount: 0,
    failureCount: 0,
    slowCallCount: 0,
    totalCount: 0,
    averageResponseTime: 0
  };
  
  private halfOpenCalls: number = 0;
  private maxHalfOpenCalls: number = 3;
  private stateChangeTime: number = Date.now();
  private resetTimer?: NodeJS.Timeout;
  
  // 서비스별 서킷 브레이커 설정
  private static configs: Map<string, CircuitConfig> = new Map([
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
  
  constructor(
    private serviceName: string,
    private config?: CircuitConfig
  ) {
    super();
    
    if (!config) {
      this.config = CircuitBreaker.configs.get(serviceName) 
                 || CircuitBreaker.configs.get('default')!;
    }
    
    // 메트릭 리포팅 (1분마다)
    setInterval(() => this.reportMetrics(), 60000);
  }
  
  /**
   * 서킷 브레이커를 통한 호출 실행
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // 서킷이 OPEN 상태면 즉시 실패
    if (this.state === CircuitState.OPEN) {
      const error = new Error(`Circuit breaker is OPEN for ${this.serviceName}`);
      (error as any).circuitBreakerOpen = true;
      this.emit('circuit:rejected', { service: this.serviceName });
      throw error;
    }
    
    // HALF_OPEN 상태에서 제한된 호출만 허용
    if (this.state === CircuitState.HALF_OPEN) {
      if (this.halfOpenCalls >= this.maxHalfOpenCalls) {
        const error = new Error(`Circuit breaker HALF_OPEN limit reached for ${this.serviceName}`);
        (error as any).circuitBreakerHalfOpen = true;
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
        this.timeoutPromise(this.config!.timeout)
      ]);
      
      const duration = Date.now() - startTime;
      this.recordSuccess(duration);
      
      return result as T;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      this.recordFailure(duration);
      throw error;
    }
  }
  
  /**
   * 성공 기록
   */
  private recordSuccess(duration: number): void {
    this.stats.successCount++;
    this.stats.totalCount++;
    
    // 평균 응답 시간 업데이트
    this.updateAverageResponseTime(duration);
    
    // 느린 호출 체크
    if (duration > this.config!.slowCallDuration) {
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
  private recordFailure(duration: number): void {
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
  private shouldOpen(): boolean {
    // 최소 요청 수 미달
    if (this.stats.totalCount < this.config!.volumeThreshold) {
      return false;
    }
    
    // 실패율 계산
    const failureRate = (this.stats.failureCount / this.stats.totalCount) * 100;
    
    // 느린 호출률 계산
    const slowCallRate = (this.stats.slowCallCount / this.stats.totalCount) * 100;
    
    return (
      failureRate >= this.config!.failureThreshold ||
      slowCallRate >= this.config!.slowCallThreshold ||
      this.stats.failureCount >= this.config!.failureCount
    );
  }
  
  /**
   * 상태 전환
   */
  private transitionTo(newState: CircuitState): void {
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
        }, this.config!.resetTimeout);
        
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
  private resetStats(): void {
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
  private updateAverageResponseTime(duration: number): void {
    const total = this.stats.totalCount;
    const current = this.stats.averageResponseTime;
    
    this.stats.averageResponseTime = ((current * (total - 1)) + duration) / total;
  }
  
  /**
   * 타임아웃 Promise
   */
  private timeoutPromise(ms: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Circuit breaker timeout after ${ms}ms`));
      }, ms);
    });
  }
  
  /**
   * 메트릭 리포팅
   */
  private reportMetrics(): void {
    if (this.stats.totalCount === 0) return;
    
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
  getState(): CircuitState {
    return this.state;
  }
  
  /**
   * 통계 조회
   */
  getStats(): CallStats & { state: CircuitState } {
    return {
      ...this.stats,
      state: this.state
    };
  }
  
  /**
   * 수동 리셋
   */
  reset(): void {
    this.transitionTo(CircuitState.CLOSED);
  }
  
  /**
   * 수동으로 서킷 열기
   */
  open(): void {
    this.transitionTo(CircuitState.OPEN);
  }
}

// 서킷 브레이커 관리자
export class CircuitBreakerManager {
  private static instance: CircuitBreakerManager;
  private breakers: Map<string, CircuitBreaker> = new Map();
  
  private constructor() {}
  
  static getInstance(): CircuitBreakerManager {
    if (!CircuitBreakerManager.instance) {
      CircuitBreakerManager.instance = new CircuitBreakerManager();
    }
    return CircuitBreakerManager.instance;
  }
  
  /**
   * 서비스별 서킷 브레이커 가져오기
   */
  getBreaker(serviceName: string): CircuitBreaker {
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
    
    return this.breakers.get(serviceName)!;
  }
  
  /**
   * 모든 서킷 브레이커 상태
   */
  getAllStatus(): Array<{ service: string; state: CircuitState; stats: any }> {
    return Array.from(this.breakers.entries()).map(([service, breaker]) => ({
      service,
      state: breaker.getState(),
      stats: breaker.getStats()
    }));
  }
  
  /**
   * 모든 서킷 리셋
   */
  resetAll(): void {
    for (const breaker of this.breakers.values()) {
      breaker.reset();
    }
  }
}

// 싱글톤 인스턴스 export
export const circuitManager = CircuitBreakerManager.getInstance();