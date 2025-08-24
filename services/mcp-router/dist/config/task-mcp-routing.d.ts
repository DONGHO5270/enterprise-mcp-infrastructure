/**
 * Task MCP Routing Configuration
 *
 * 이 파일은 TaskMaster AI가 다른 MCP 서비스를 호출할 때 사용하는
 * 라우팅 규칙과 지침을 정의합니다.
 */
import { z } from 'zod';
export declare const MCPDirectiveSchema: z.ZodObject<{
    targetService: z.ZodString;
    method: z.ZodString;
    params: z.ZodOptional<z.ZodAny>;
    timeout: z.ZodOptional<z.ZodNumber>;
    retryPolicy: z.ZodOptional<z.ZodObject<{
        maxRetries: z.ZodDefault<z.ZodNumber>;
        backoffMs: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        maxRetries: number;
        backoffMs: number;
    }, {
        maxRetries?: number | undefined;
        backoffMs?: number | undefined;
    }>>;
    metadata: z.ZodOptional<z.ZodObject<{
        taskId: z.ZodOptional<z.ZodString>;
        purpose: z.ZodOptional<z.ZodString>;
        priority: z.ZodDefault<z.ZodOptional<z.ZodEnum<["high", "medium", "low"]>>>;
        taskTool: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        priority: "low" | "medium" | "high";
        timestamp?: string | undefined;
        taskId?: string | undefined;
        purpose?: string | undefined;
        taskTool?: string | undefined;
    }, {
        timestamp?: string | undefined;
        priority?: "low" | "medium" | "high" | undefined;
        taskId?: string | undefined;
        purpose?: string | undefined;
        taskTool?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    method: string;
    targetService: string;
    metadata?: {
        priority: "low" | "medium" | "high";
        timestamp?: string | undefined;
        taskId?: string | undefined;
        purpose?: string | undefined;
        taskTool?: string | undefined;
    } | undefined;
    params?: any;
    timeout?: number | undefined;
    retryPolicy?: {
        maxRetries: number;
        backoffMs: number;
    } | undefined;
}, {
    method: string;
    targetService: string;
    metadata?: {
        timestamp?: string | undefined;
        priority?: "low" | "medium" | "high" | undefined;
        taskId?: string | undefined;
        purpose?: string | undefined;
        taskTool?: string | undefined;
    } | undefined;
    params?: any;
    timeout?: number | undefined;
    retryPolicy?: {
        maxRetries?: number | undefined;
        backoffMs?: number | undefined;
    } | undefined;
}>;
export type MCPDirective = z.infer<typeof MCPDirectiveSchema>;
export declare const TASK_MCP_MAPPINGS: Record<string, {
    description: string;
    allowedServices: string[];
    defaultDirectives?: Partial<MCPDirective>;
}>;
export declare const MCP_SERVICE_CONSTRAINTS: Record<string, {
    maxConcurrent: number;
    cooldownMs: number;
    requiredEnvVars?: string[];
}>;
export declare class TaskMCPRouter {
    private callHistory;
    /**
     * Task 도구의 MCP 호출 요청을 검증하고 라우팅
     */
    routeMCPCall(taskTool: string, directive: MCPDirective): Promise<{
        allowed: boolean;
        reason?: string;
        modifiedDirective?: MCPDirective;
    }>;
    private getActiveCalls;
    private checkCooldown;
    private recordCall;
}
export declare const taskMCPRouter: TaskMCPRouter;
//# sourceMappingURL=task-mcp-routing.d.ts.map