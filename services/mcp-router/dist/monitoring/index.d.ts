import { EventEmitter } from 'events';
import { MetricsCollector } from './MetricsCollector';
import { HealthChecker } from './HealthChecker';
import { PredictiveAnalyzer } from './PredictiveAnalyzer';
import { WeightAdjuster } from './WeightAdjuster';
import { MonitoringConfig, MonitoringStatus, MonitoringApiResponse, ServiceMetrics } from './types/monitoring';
export interface MCPMonitoringSystemConfig {
    monitoring?: Partial<MonitoringConfig>;
    enableWebSocket?: boolean;
    enablePersistence?: boolean;
    mcpServices?: Record<string, any>;
}
export declare class MCPMonitoringSystem extends EventEmitter {
    private config;
    private isRunning;
    private startTime;
    private metricsCollector;
    private healthChecker;
    private predictiveAnalyzer;
    private weightAdjuster;
    private monitoringData;
    private events;
    constructor(config?: MCPMonitoringSystemConfig);
    private logSystemStatus;
    start(): Promise<void>;
    stop(): Promise<void>;
    private registerMCPServices;
    registerMCPService(serviceId: string): void;
    unregisterMCPService(serviceId: string): void;
    private setupEventHandlers;
    private handleMonitoringEvent;
    private updateMonitoringData;
    getMonitoringStatus(): MonitoringApiResponse<MonitoringStatus>;
    getServiceMetrics(serviceId: string): MonitoringApiResponse<ServiceMetrics | null>;
    getAllServiceMetrics(): MonitoringApiResponse<ServiceMetrics[]>;
    getSystemSummary(): MonitoringApiResponse<any>;
    getPhaseStatus(): {
        phase1: {
            implementation: string;
            enabled: boolean;
            completed: boolean;
            features: string[];
        };
        phase2: {
            implementation: string;
            enabled: boolean;
            completed: boolean;
            features: string[];
        };
        phase3: {
            implementation: string;
            enabled: boolean;
            completed: boolean;
            features: string[];
        };
    };
    enablePhase(phase: 2 | 3): MonitoringApiResponse<boolean>;
    disablePhase(phase: 2 | 3): MonitoringApiResponse<boolean>;
    getMetricsCollector(): MetricsCollector;
    getHealthChecker(): HealthChecker;
    getPredictiveAnalyzer(): PredictiveAnalyzer;
    getWeightAdjuster(): WeightAdjuster;
    getConfig(): MonitoringConfig;
}
export * from './types/monitoring';
export { MetricsCollector } from './MetricsCollector';
export { HealthChecker } from './HealthChecker';
export { PredictiveAnalyzer } from './PredictiveAnalyzer';
export { WeightAdjuster } from './WeightAdjuster';
//# sourceMappingURL=index.d.ts.map