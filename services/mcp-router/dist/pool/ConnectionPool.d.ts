/**
 * Phase 2B - Connection Pooling System
 * 예상 리소스 효율성 개선: 10%
 *
 * 커넥션 풀 특징:
 * - 재사용 가능한 프로세스 풀
 * - 자동 health check
 * - 동적 크기 조정
 */
import { ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
import { MCPService } from '../types';
interface PooledConnection {
    id: string;
    process: ChildProcess;
    service: MCPService;
    inUse: boolean;
    lastUsed: number;
    created: number;
    requestCount: number;
    healthCheckFailures: number;
    buffer: string;
    pendingRequests: Map<string | number, (response: any) => void>;
}
export declare class ConnectionPool extends EventEmitter {
    private connections;
    private waitingQueue;
    private healthCheckTimers;
    private static configs;
    constructor();
    /**
     * 연결 획득
     */
    acquire(serviceName: string, service: MCPService): Promise<PooledConnection>;
    /**
     * 연결 반환
     */
    release(serviceName: string, connection: PooledConnection): void;
    /**
     * 풀 초기화
     */
    private initializePool;
    /**
     * 연결 생성
     */
    private createConnection;
    /**
     * 연결 초기화
     */
    private initializeConnection;
    /**
     * 버퍼 처리
     */
    private processBuffer;
    /**
     * 헬스체크 시작
     */
    private startHealthCheck;
    /**
     * 헬스체크 실행
     */
    private healthCheck;
    /**
     * 연결 에러 처리
     */
    private handleConnectionError;
    /**
     * 연결 제거
     */
    private removeConnection;
    /**
     * 유휴 연결 정리
     */
    private cleanup;
    /**
     * 메트릭 리포팅
     */
    private reportMetrics;
    /**
     * 풀 상태 조회
     */
    getStatus(serviceName?: string): any;
    /**
     * 전체 풀 종료
     */
    shutdown(): Promise<void>;
}
export declare const connectionPool: ConnectionPool;
export {};
//# sourceMappingURL=ConnectionPool.d.ts.map