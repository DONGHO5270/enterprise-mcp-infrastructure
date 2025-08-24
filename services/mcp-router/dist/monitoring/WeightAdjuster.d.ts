import { EventEmitter } from 'events';
import { ServiceWeight, OptimizationRecommendation, ServiceMetrics, MonitoringConfig, WeightConfig } from './types/monitoring';
interface WeightAdjustmentResult {
    serviceId: string;
    currentWeight: number;
    newWeight: number;
    shouldAdjust: boolean;
    reason: string;
    impact: string;
    confidence: number;
    timestamp: string;
}
export interface WeightAdjustmentConfig {
    enabled: boolean;
    adjustmentInterval: number;
    autoAdjustEnabled: boolean;
    thresholds: {
        responseTimeThreshold: number;
        errorRateThreshold: number;
        resourceThreshold: number;
        trafficThreshold: number;
    };
    weights: {
        toolCountWeight: number;
        usageFrequencyWeight: number;
        errorHistoryWeight: number;
        resourceImpactWeight: number;
    };
}
export declare class WeightAdjuster extends EventEmitter {
    private config;
    private weightConfig;
    private serviceWeights;
    private loadBalancingConfig;
    private recommendations;
    private adjustmentInterval;
    private isRunning;
    private qTable;
    private neuralNetwork;
    private historicalPerformance;
    private performanceHistory;
    private readonly LEARNING_RATE;
    private readonly DISCOUNT_FACTOR;
    private readonly EXPLORATION_RATE;
    private optimizationObjectives;
    constructor(config?: WeightConfig | Partial<MonitoringConfig>, weightConfig?: Partial<WeightAdjustmentConfig>);
    private initialize;
    private showSkeletonFeatures;
    private initializeNeuralNetwork;
    private initializeDefaultWeights;
    start(): void;
    stop(): void;
    adjustWeights(metrics: Map<string, ServiceMetrics>): Promise<Map<string, WeightAdjustmentResult>>;
    private calculateOptimalWeight;
    private reinforcementLearningDecision;
    private encodeState;
    private getRandomAction;
    private getBestAction;
    private calculateReward;
    private updateQValue;
    private getMaxFutureQValue;
    private applyAction;
    private neuralNetworkPrediction;
    private geneticAlgorithmOptimization;
    private simulatePerformance;
    private paretoOptimization;
    private findParetoFront;
    private dominates;
    private ensembleDecision;
    private performAutoAdjustment;
    private collectCurrentMetrics;
    generateScalingRecommendations(metrics: Map<string, ServiceMetrics>): OptimizationRecommendation[];
    private applyRecommendation;
    private createDefaultWeight;
    private applyWeightAdjustment;
    private generateAdjustmentReason;
    private calculateConfidence;
    private predictPerformanceImpact;
    private balanceSystemWeights;
    private generateSkeletonAdjustments;
    private generateDefaultAdjustment;
    private generateSkeletonRecommendations;
    trainModels(historicalData: any[]): Promise<boolean>;
    private encodeOptimalAction;
    private updateQTableFromHistory;
    private inferAction;
    private calculateRewardFromHistory;
    getWeights(): Map<string, ServiceWeight>;
    getRecommendations(serviceId?: string): OptimizationRecommendation[];
    private saveState;
}
export {};
//# sourceMappingURL=WeightAdjuster.d.ts.map