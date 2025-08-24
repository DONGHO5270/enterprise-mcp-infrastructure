"use strict";
// ============================================================================
// MCP 모니터링 시스템 타입 정의 - 3 Phase 통합 스켈레톤
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_MONITORING_CONFIG = exports.DEFAULT_METRIC_NAMING = void 0;
exports.DEFAULT_METRIC_NAMING = {
    allowUnicode: false,
    maxLength: 64,
    sanitizeFunction: (name) => {
        return name
            .replace(/[^\w\-_.]/g, '_')
            .substring(0, 64)
            .toLowerCase();
    }
};
exports.DEFAULT_MONITORING_CONFIG = {
    phases: {
        PHASE_1: {
            enabled: true,
            completed: true,
            features: ['metrics', 'health', 'alerts']
        },
        PHASE_2: {
            enabled: true,
            completed: true,
            features: ['prediction', 'anomaly', 'trends']
        },
        PHASE_3: {
            enabled: true,
            completed: true,
            features: ['weights', 'optimization', 'auto_scaling']
        }
    },
    encoding: {
        validateUtf8: true,
        fallbackEncoding: 'utf8'
    },
    metrics: {
        collectionInterval: 30000, // 30 seconds
        retentionDays: 7,
        maxMetricsPerService: 1000
    }
};
//# sourceMappingURL=monitoring.js.map