import { EventEmitter } from 'events';
import { RouterConfig } from '../types';
export declare class MCPRouter extends EventEmitter {
    private services;
    private activeProcesses;
    private requestQueue;
    private config;
    constructor(config: RouterConfig);
    private loadServices;
    execute(serviceName: string, method: string, params: any): Promise<any>;
    private spawnMCPProcess;
    private waitForProcessReady;
    private sendRequest;
    private terminateProcess;
    shutdown(): Promise<void>;
    getStats(): {
        services: string[];
        activeProcesses: number;
        queueSize: number;
        queuePending: number;
    };
}
//# sourceMappingURL=MCPRouter.d.ts.map