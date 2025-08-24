interface TaskMCPClientOptions {
    routerUrl?: string;
    timeout?: number;
    retryCount?: number;
    retryDelay?: number;
}
interface MCPTool {
    name: string;
    description?: string;
    inputSchema?: any;
}
interface MCPResource {
    name: string;
    uri: string;
    description?: string;
    mimeType?: string;
}
interface BatchCall {
    service: string;
    method: string;
    params?: any;
}
export declare class TaskMCPClient {
    private routerUrl;
    private timeout;
    private retryCount;
    private retryDelay;
    constructor(options?: TaskMCPClientOptions);
    /**
     * MCP 서비스를 호출합니다.
     */
    call<T = any>(serviceName: string, method: string, params?: any): Promise<T>;
    /**
     * MCP 도구를 호출합니다.
     */
    callTool<T = any>(serviceName: string, toolName: string, args?: any): Promise<T>;
    /**
     * MCP 서비스의 도구 목록을 가져옵니다.
     */
    listTools(serviceName: string): Promise<MCPTool[]>;
    /**
     * MCP 서비스의 리소스 목록을 가져옵니다.
     */
    listResources(serviceName: string): Promise<MCPResource[]>;
    /**
     * 여러 MCP 서비스를 병렬로 호출합니다.
     */
    batchCall(calls: BatchCall[]): Promise<Array<any | {
        error: string;
    }>>;
    private _makeRequest;
    private _delay;
}
export declare const defaultClient: TaskMCPClient;
export declare const callMCP: <T = any>(serviceName: string, method: string, params?: any) => Promise<T>;
export declare const callTool: <T = any>(serviceName: string, toolName: string, args?: any) => Promise<T>;
export declare const listTools: (serviceName: string) => Promise<MCPTool[]>;
export declare const listResources: (serviceName: string) => Promise<MCPResource[]>;
export declare const batchCall: (calls: BatchCall[]) => Promise<Array<any | {
    error: string;
}>>;
export default TaskMCPClient;
//# sourceMappingURL=task-mcp-client.d.ts.map