/**
 * Phase 2A - MCP Response Cache System
 * 예상 성능 개선: 25% (반복 요청 시 캐시 히트)
 *
 * 캐시 전략:
 * - LRU (Least Recently Used) 방식
 * - TTL (Time To Live) 기반 만료
 * - 서비스별 캐시 정책 차별화
 */
import { EventEmitter } from 'events';
interface CachePolicy {
    ttl: number;
    maxSize: number;
    enabled: boolean;
}
export declare class MCPResponseCache extends EventEmitter {
    private cache;
    private totalSize;
    private maxTotalSize;
    private hitCount;
    private missCount;
    private policies;
    constructor();
    /**
     * 캐시 키 생성 (요청 내용 기반 해시)
     */
    private generateKey;
    /**
     * 캐시에서 응답 조회
     */
    get(service: string, method: string, params: any): Promise<any | null>;
    /**
     * 캐시에 응답 저장
     */
    set(service: string, method: string, params: any, value: any): Promise<void>;
    /**
     * LRU 방식으로 캐시 제거
     */
    private evictLRU;
    /**
     * 만료된 캐시 항목 정리
     */
    private cleanup;
    /**
     * 캐시 메트릭 리포트
     */
    private reportMetrics;
    /**
     * 특정 서비스의 캐시 무효화
     */
    invalidate(service?: string): Promise<void>;
    /**
     * 캐시 정책 업데이트
     */
    updatePolicy(service: string, policy: Partial<CachePolicy>): void;
    /**
     * 현재 캐시 상태 조회
     */
    getStatus(): {
        enabled: boolean;
        entries: number;
        totalSize: number;
        maxSize: number;
        hitRate: number;
        hitCount: number;
        missCount: number;
        policies: {
            [k: string]: CachePolicy;
        };
        topServices: {
            service: string;
            count: number;
            size: number;
        }[];
    };
    /**
     * 가장 많이 캐시된 서비스 통계
     */
    private getTopServices;
}
export declare const mcpCache: MCPResponseCache;
export declare function cacheMiddleware(): (req: any, res: any, next: any) => Promise<void>;
export {};
//# sourceMappingURL=MCPResponseCache.d.ts.map