import { MCPService } from '../types';
export declare class MCPSimpleRouter {
    private config;
    constructor(config: Record<string, MCPService>);
    executeMCP(serviceName: string, mcpRequest: any): Promise<any>;
    executeSimple(serviceName: string, method: string, params: any): Promise<any>;
}
//# sourceMappingURL=MCPSimpleRouter.d.ts.map