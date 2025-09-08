"use strict";
/**
 * Phase 2A - MCP Response Cache System
 * 예상 성능 개선: 25% (반복 요청 시 캐시 히트)
 *
 * 캐시 전략:
 * - LRU (Least Recently Used) 방식
 * - TTL (Time To Live) 기반 만료
 * - 서비스별 캐시 정책 차별화
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.mcpCache = exports.MCPResponseCache = void 0;
exports.cacheMiddleware = cacheMiddleware;
const crypto_1 = require("crypto");
const events_1 = require("events");
class MCPResponseCache extends events_1.EventEmitter {
    cache = new Map();
    totalSize = 0;
    maxTotalSize = 100 * 1024 * 1024; // 100MB
    hitCount = 0;
    missCount = 0;
    // 서비스별 캐시 정책
    policies = new Map([
        ['clear-thought', { ttl: 300000, maxSize: 20 * 1024 * 1024, enabled: true }], // 5분, 20MB
        ['stochastic-thinking', { ttl: 600000, maxSize: 30 * 1024 * 1024, enabled: true }], // 10분, 30MB
        ['github', { ttl: 60000, maxSize: 10 * 1024 * 1024, enabled: true }], // 1분, 10MB
        ['docker', { ttl: 30000, maxSize: 5 * 1024 * 1024, enabled: true }], // 30초, 5MB
        ['default', { ttl: 120000, maxSize: 10 * 1024 * 1024, enabled: true }] // 2분, 10MB
    ]);
    constructor() {
        super();
        // 주기적 캐시 정리 (1분마다)
        setInterval(() => this.cleanup(), 60000);
        // 메트릭 리포팅 (5분마다)
        setInterval(() => this.reportMetrics(), 300000);
    }
    /**
     * 캐시 키 생성 (요청 내용 기반 해시)
     */
    generateKey(service, method, params) {
        const data = JSON.stringify({ service, method, params });
        return (0, crypto_1.createHash)('sha256').update(data).digest('hex');
    }
    /**
     * 캐시에서 응답 조회
     */
    async get(service, method, params) {
        const key = this.generateKey(service, method, params);
        const entry = this.cache.get(key);
        if (!entry) {
            this.missCount++;
            this.emit('cache:miss', { service, method });
            return null;
        }
        // TTL 확인
        const now = Date.now();
        if (now - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            this.totalSize -= entry.size;
            this.missCount++;
            this.emit('cache:expired', { service, method, age: now - entry.timestamp });
            return null;
        }
        // 캐시 히트
        entry.hits++;
        this.hitCount++;
        this.emit('cache:hit', { service, method, hits: entry.hits });
        // LRU 업데이트 (재삽입으로 순서 변경)
        this.cache.delete(key);
        this.cache.set(key, entry);
        return entry.value;
    }
    /**
     * 캐시에 응답 저장
     */
    async set(service, method, params, value) {
        const policy = this.policies.get(service) || this.policies.get('default');
        if (!policy.enabled) {
            return;
        }
        const key = this.generateKey(service, method, params);
        const size = Buffer.byteLength(JSON.stringify(value));
        // 크기 제한 확인
        if (size > policy.maxSize) {
            this.emit('cache:rejected', { service, method, reason: 'size_limit', size });
            return;
        }
        // 전체 캐시 크기 관리
        if (this.totalSize + size > this.maxTotalSize) {
            await this.evictLRU(size);
        }
        const entry = {
            key,
            value,
            timestamp: Date.now(),
            ttl: policy.ttl,
            hits: 0,
            size,
            service,
            method
        };
        // 기존 엔트리가 있으면 크기 차감
        const existing = this.cache.get(key);
        if (existing) {
            this.totalSize -= existing.size;
        }
        this.cache.set(key, entry);
        this.totalSize += size;
        this.emit('cache:set', { service, method, size });
    }
    /**
     * LRU 방식으로 캐시 제거
     */
    async evictLRU(requiredSpace) {
        const entries = Array.from(this.cache.values())
            .sort((a, b) => a.timestamp - b.timestamp);
        let freedSpace = 0;
        for (const entry of entries) {
            if (freedSpace >= requiredSpace)
                break;
            this.cache.delete(entry.key);
            this.totalSize -= entry.size;
            freedSpace += entry.size;
            this.emit('cache:evicted', {
                service: entry.service,
                method: entry.method,
                age: Date.now() - entry.timestamp
            });
        }
    }
    /**
     * 만료된 캐시 항목 정리
     */
    cleanup() {
        const now = Date.now();
        let cleaned = 0;
        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > entry.ttl) {
                this.cache.delete(key);
                this.totalSize -= entry.size;
                cleaned++;
            }
        }
        if (cleaned > 0) {
            this.emit('cache:cleanup', { removed: cleaned, remaining: this.cache.size });
        }
    }
    /**
     * 캐시 메트릭 리포트
     */
    reportMetrics() {
        const hitRate = this.hitCount / (this.hitCount + this.missCount) || 0;
        const metrics = {
            hitRate: (hitRate * 100).toFixed(2) + '%',
            hits: this.hitCount,
            misses: this.missCount,
            entries: this.cache.size,
            totalSize: (this.totalSize / 1024 / 1024).toFixed(2) + 'MB',
            avgEntrySize: this.cache.size > 0
                ? ((this.totalSize / this.cache.size) / 1024).toFixed(2) + 'KB'
                : '0KB'
        };
        this.emit('cache:metrics', metrics);
        console.log('[📊 Cache Metrics]', metrics);
    }
    /**
     * 특정 서비스의 캐시 무효화
     */
    async invalidate(service) {
        if (!service) {
            // 전체 캐시 무효화
            const size = this.cache.size;
            this.cache.clear();
            this.totalSize = 0;
            this.emit('cache:invalidated', { service: 'all', entries: size });
            return;
        }
        // 특정 서비스 캐시 무효화
        let removed = 0;
        for (const [key, entry] of this.cache.entries()) {
            if (entry.service === service) {
                this.cache.delete(key);
                this.totalSize -= entry.size;
                removed++;
            }
        }
        this.emit('cache:invalidated', { service, entries: removed });
    }
    /**
     * 캐시 정책 업데이트
     */
    updatePolicy(service, policy) {
        const current = this.policies.get(service) || this.policies.get('default');
        this.policies.set(service, { ...current, ...policy });
        this.emit('cache:policy_updated', { service, policy });
    }
    /**
     * 현재 캐시 상태 조회
     */
    getStatus() {
        const hitRate = this.hitCount / (this.hitCount + this.missCount) || 0;
        return {
            enabled: true,
            entries: this.cache.size,
            totalSize: this.totalSize,
            maxSize: this.maxTotalSize,
            hitRate: hitRate,
            hitCount: this.hitCount,
            missCount: this.missCount,
            policies: Object.fromEntries(this.policies),
            topServices: this.getTopServices()
        };
    }
    /**
     * 가장 많이 캐시된 서비스 통계
     */
    getTopServices() {
        const stats = new Map();
        for (const entry of this.cache.values()) {
            const current = stats.get(entry.service) || { count: 0, size: 0 };
            stats.set(entry.service, {
                count: current.count + 1,
                size: current.size + entry.size
            });
        }
        return Array.from(stats.entries())
            .map(([service, data]) => ({ service, ...data }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }
}
exports.MCPResponseCache = MCPResponseCache;
// 싱글톤 인스턴스
exports.mcpCache = new MCPResponseCache();
// 캐시 미들웨어 (Express 용)
function cacheMiddleware() {
    return async (req, res, next) => {
        const { service, method, params } = req.body;
        // GET 요청만 캐시
        if (method && method.startsWith('tools/list') || method === 'resources/list') {
            const cached = await exports.mcpCache.get(service, method, params);
            if (cached) {
                res.json(cached);
                return;
            }
        }
        // 응답 인터셉트하여 캐시 저장
        const originalJson = res.json;
        res.json = function (data) {
            if (!data.error && method) {
                exports.mcpCache.set(service, method, params, data);
            }
            return originalJson.call(this, data);
        };
        next();
    };
}
//# sourceMappingURL=MCPResponseCache.js.map