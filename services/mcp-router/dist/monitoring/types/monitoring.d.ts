export interface MonitoringPhaseConfig {
    enabled: boolean;
    completed: boolean;
    features: string[];
}
export interface MonitoringConfig {
    phases: {
        PHASE_1: MonitoringPhaseConfig;
        PHASE_2: MonitoringPhaseConfig;
        PHASE_3: MonitoringPhaseConfig;
    };
    encoding: {
        validateUtf8: boolean;
        fallbackEncoding: string;
    };
    metrics: {
        collectionInterval: number;
        retentionDays: number;
        maxMetricsPerService: number;
    };
}
export interface ServiceHealthStatus {
    status: 'healthy' | 'degraded' | 'failing' | 'dead';
    responseTime: number;
    errorRate: number;
    trend: 'improving' | 'stable' | 'worsening';
    lastIncident?: string;
    uptime: number;
}
export interface MetricDataPoint {
    timestamp: string;
    value: number;
    unit: string;
}
export interface ServiceMetrics {
    serviceId: string;
    health: ServiceHealthStatus;
    requestCount: number;
    errorCount: number;
    avgResponseTime: number;
    requestsPerSecond?: number;
    errorRate?: number;
    cpuUsage?: number;
    memoryUsage?: number;
    uptime?: number;
    performance: {
        avgResponseTime: MetricDataPoint[];
        requestsPerMinute: MetricDataPoint[];
        errorCount: MetricDataPoint[];
        cpuUsage?: MetricDataPoint[];
        memoryUsage?: MetricDataPoint[];
    };
    tools: {
        totalCount: number;
        activeCount: number;
        usageDistribution: Record<string, number>;
    };
    lastUpdated: string;
}
export interface SystemMetrics {
    totalServices: number;
    healthyServices: number;
    degradedServices: number;
    unhealthyServices: number;
    systemLoad: number;
    uptime: number;
    timestamp: string;
}
export interface Alert {
    id: string;
    serviceId: string;
    type: 'performance' | 'error' | 'availability' | 'resource';
    severity: 'info' | 'warning' | 'error' | 'critical';
    message: string;
    timestamp: string;
    resolved: boolean;
    resolvedAt?: string;
    metadata?: Record<string, any>;
}
export interface PredictiveMetrics {
    serviceId: string;
    predictions: {
        nextHourLoad: number;
        anomalyProbability: number;
        recommendedActions: string[];
        confidence: number;
    };
    trends: {
        performanceTrend: 'up' | 'down' | 'stable';
        usageTrend: 'up' | 'down' | 'stable';
        errorTrend: 'up' | 'down' | 'stable';
    };
    patterns: {
        peakHours: string[];
        weeklyPattern: Record<string, number>;
        seasonality?: string;
    };
}
export interface AnomalyDetection {
    serviceId: string;
    anomalies: Array<{
        timestamp: string;
        metric: string;
        value: number;
        expected: number;
        severity: number;
        description: string;
    }>;
    lastAnalysis: string;
}
export interface ServiceWeight {
    serviceId?: string;
    current: number;
    min: number;
    max: number;
    history: Array<{
        timestamp: string;
        value: number;
        reason: string;
    }>;
    priority?: number;
    allocation?: number;
    factors?: {
        toolCount: number;
        usageFrequency: number;
        errorHistory: number;
        resourceImpact: number;
    };
    autoAdjust?: boolean;
    lastAdjusted: string;
}
export interface LoadBalancingConfig {
    strategy: 'round_robin' | 'weighted' | 'least_connections' | 'adaptive' | 'weighted-round-robin';
    weights?: Record<string, ServiceWeight>;
    healthCheckInterval?: number;
    failoverThreshold?: number;
    weightUpdateInterval?: number;
    thresholds?: {
        responseTimeThreshold: number;
        errorRateThreshold: number;
        resourceThreshold: number;
    };
}
export interface OptimizationRecommendation {
    serviceId: string;
    action?: 'scale-up' | 'scale-down' | 'health-check' | 'monitor';
    type?: 'scale_up' | 'scale_down' | 'redistribute' | 'cache' | 'optimize';
    priority: 'low' | 'medium' | 'high' | 'critical' | number;
    expectedImprovement?: number;
    confidence?: number;
    description: string;
    estimatedImpact?: string;
    autoApply?: boolean;
    implementation?: {
        automated: boolean;
        steps: string[];
        estimatedTime: number;
    };
}
export interface PredictiveConfig {
    enabled: boolean;
    modelUpdateInterval?: number;
    anomalyThreshold?: number;
}
export interface HistoricalDataPoint {
    timestamp: string;
    metrics: any;
}
export interface TrendAnalysis {
    performanceTrend: 'up' | 'down' | 'stable';
    usageTrend: 'up' | 'down' | 'stable';
    errorTrend: 'up' | 'down' | 'stable';
    details?: any;
}
export interface PatternRecognition {
    peakHours: string[];
    weeklyPattern: Record<string, number>;
    seasonality: string;
    details?: any;
}
export interface WeightConfig {
    enabled: boolean;
    adjustmentInterval?: number;
    autoAdjustEnabled?: boolean;
}
export interface MonitoringData {
    basic: ServiceMetrics;
    systemMetrics: SystemMetrics;
    alerts: Alert[];
    predictive?: PredictiveMetrics;
    anomalies?: AnomalyDetection;
    weights?: ServiceWeight;
    recommendations?: OptimizationRecommendation[];
}
export interface MonitoringEvent {
    type: 'metric_update' | 'alert' | 'prediction' | 'optimization';
    serviceId?: string;
    data: any;
    timestamp: string;
    phase: 1 | 2 | 3;
}
export interface MonitoringApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    phase: number;
    timestamp: string;
}
export interface MonitoringStatus {
    phases: Record<string, MonitoringPhaseConfig>;
    activeServices: number;
    dataRetentionDays: number;
    lastUpdate: string;
}
export type MetricSanitizer = (name: string) => string;
export interface MetricNamingConfig {
    allowUnicode: boolean;
    maxLength: number;
    sanitizeFunction: MetricSanitizer;
}
export declare const DEFAULT_METRIC_NAMING: MetricNamingConfig;
export declare const DEFAULT_MONITORING_CONFIG: MonitoringConfig;
//# sourceMappingURL=monitoring.d.ts.map