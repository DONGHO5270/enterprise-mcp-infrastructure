import { MCPService } from '../types';
export declare class MCPPersistentRouter {
    private config;
    private processes;
    private cleanupInterval;
    private idleTimeout;
    constructor(config: Record<string, MCPService>);
    executeMCP(serviceName: string, mcpRequest: any, envFromHeaders?: Record<string, string>): Promise<any>;
    private getOrCreateProcess;
    private processBuffer;
    private sendRequest;
    private cleanupIdleProcesses;
    private isTaskToolWithMCPSupport;
    private handleTaskMCPCall;
    shutdown(): Promise<void>;
}
//# sourceMappingURL=MCPPersistentRouter.d.ts.map