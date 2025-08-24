import { EventEmitter } from 'events';
import { ServiceMetrics, MonitoringConfig } from './types/monitoring';
export declare class MetricsCollector extends EventEmitter {
    private metrics;
    private collectionInterval;
    private config;
    private isRunning;
    private requestCounts;
    private responseTimes;
    private errorCounts;
    private lastActivity;
    constructor(config?: Partial<MonitoringConfig>);
    private logPhaseStatus;
    start(): void;
    stop(): void;
    recordRequest(serviceId: string, responseTime: number, isError?: boolean): void;
    getServiceMetrics(serviceId: string): ServiceMetrics | null;
    getAllMetrics(): Map<string, ServiceMetrics>;
    private collectMetrics;
    private calculateServiceMetrics;
    private calculateHealthStatus;
    enablePredictiveAnalysis(): void;
    enableWeightAdjustment(): void;
    private sanitizeMetricName;
    private validateUtf8;
    private createDataPoints;
    private getMonitoredServices;
    private getToolInfo;
    getPhaseStatus(): {
        phase1: import("./types/monitoring").MonitoringPhaseConfig;
        phase2: import("./types/monitoring").MonitoringPhaseConfig;
        phase3: import("./types/monitoring").MonitoringPhaseConfig;
        isRunning: boolean;
        servicesMonitored: number;
    };
    getHealthySummary(): {
        total: number;
        healthy: number;
        degraded: number;
        failing: number;
        dead: number;
        healthyPercentage: number;
    };
}
//# sourceMappingURL=MetricsCollector.d.ts.map