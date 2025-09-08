import { MCPService } from '../types';
export declare class MCPPersistentRouterEnhanced {
    private config;
    private processes;
    private cleanupInterval;
    private idleTimeout;
    private serviceManager;
    private isInitialized;
    constructor(config: Record<string, MCPService>);
    /**
     * Initialize the router with dynamic services
     */
    initialize(): Promise<void>;
    executeMCP(serviceName: string, mcpRequest: any, envFromHeaders?: Record<string, string>): Promise<any>;
    private getOrCreateProcess;
    private processBuffer;
    private sendRequest;
    private cleanupIdleProcesses;
    private isTaskToolWithMCPSupport;
    private handleTaskMCPCall;
    shutdown(): Promise<void>;
    getStatus(): Promise<any>;
}
//# sourceMappingURL=MCPPersistentRouterEnhanced.d.ts.map