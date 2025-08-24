import { EventEmitter } from 'events';
import { Alert, ServiceHealthStatus, MonitoringConfig } from './types/monitoring';
export interface HealthCheckResult {
    serviceId: string;
    isHealthy: boolean;
    responseTime: number;
    error?: string;
    timestamp: string;
}
export interface HealthCheckConfig {
    interval: number;
    timeout: number;
    retries: number;
    alertThresholds: {
        responseTime: number;
        errorRate: number;
        consecutiveFailures: number;
    };
}
export declare class HealthChecker extends EventEmitter {
    private healthStatus;
    private consecutiveFailures;
    private alerts;
    private checkInterval;
    private isRunning;
    private config;
    private healthCheckConfig;
    private serviceCheckers;
    constructor(config?: Partial<MonitoringConfig>, healthConfig?: Partial<HealthCheckConfig>);
    start(): void;
    stop(): void;
    registerService(serviceId: string, checker: () => Promise<HealthCheckResult>): void;
    unregisterService(serviceId: string): void;
    private performHealthChecks;
    private performSingleHealthCheck;
    private processHealthCheckResult;
    private calculateHealthStatus;
    private checkForAlerts;
    private createAlert;
    enablePredictiveHealthChecks(): void;
    enableAdaptiveThresholds(): void;
    getServiceHealth(serviceId: string): ServiceHealthStatus | null;
    getAllHealthStatus(): Map<string, ServiceHealthStatus>;
    getServiceAlerts(serviceId: string): Alert[];
    getAllAlerts(): Alert[];
    getActiveAlerts(): Alert[];
    resolveAlert(alertId: string): boolean;
    getHealthSummary(): {
        total: number;
        healthy: number;
        degraded: number;
        failing: number;
        dead: number;
        healthyPercentage: number;
        activeAlerts: number;
    };
    private sanitizeServiceId;
    private validateUtf8;
}
//# sourceMappingURL=HealthChecker.d.ts.map