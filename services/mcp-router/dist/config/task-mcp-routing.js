"use strict";
/**
 * Task MCP Routing Configuration
 *
 * 이 파일은 TaskMaster AI가 다른 MCP 서비스를 호출할 때 사용하는
 * 라우팅 규칙과 지침을 정의합니다.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskMCPRouter = exports.TaskMCPRouter = exports.MCP_SERVICE_CONSTRAINTS = exports.TASK_MCP_MAPPINGS = exports.MCPDirectiveSchema = void 0;
const zod_1 = require("zod");
// MCP 호출 지침 스키마
exports.MCPDirectiveSchema = zod_1.z.object({
    targetService: zod_1.z.string(),
    method: zod_1.z.string(),
    params: zod_1.z.any().optional(),
    timeout: zod_1.z.number().optional(),
    retryPolicy: zod_1.z.object({
        maxRetries: zod_1.z.number().default(3),
        backoffMs: zod_1.z.number().default(1000)
    }).optional(),
    metadata: zod_1.z.object({
        taskId: zod_1.z.string().optional(),
        purpose: zod_1.z.string().optional(),
        priority: zod_1.z.enum(['high', 'medium', 'low']).optional().default('medium'),
        taskTool: zod_1.z.string().optional(),
        timestamp: zod_1.z.string().optional()
    }).optional()
});
// Task 도구별 MCP 호출 매핑
exports.TASK_MCP_MAPPINGS = {
    // PRD 파싱시 코드 분석 도구 사용
    'parse_prd': {
        description: 'PRD 분석을 위해 코드 컨텍스트와 구조 분석 도구 사용',
        allowedServices: ['code-context-provider', 'serena', 'code-checker'],
        defaultDirectives: {
            timeout: 30000,
            metadata: {
                purpose: 'PRD analysis and code structure understanding',
                priority: 'medium'
            }
        }
    },
    // 작업 확장시 관련 코드 검색
    'expand_task': {
        description: '작업 확장을 위해 관련 코드와 문서 검색',
        allowedServices: ['serena', 'code-context-provider', 'github'],
        defaultDirectives: {
            timeout: 20000,
            metadata: {
                purpose: 'Find related code for task expansion',
                priority: 'medium'
            }
        }
    },
    // 복잡도 분석시 코드 품질 체크
    'analyze_project_complexity': {
        description: '프로젝트 복잡도 분석을 위한 코드 품질 및 의존성 체크',
        allowedServices: ['code-checker', 'npm-sentinel', 'docker'],
        defaultDirectives: {
            timeout: 45000,
            metadata: {
                purpose: 'Analyze code quality and dependencies',
                priority: 'medium'
            }
        }
    },
    // 파일 생성시 코드 생성 및 검증
    'generate_files': {
        description: '파일 생성을 위한 코드 작성 및 검증',
        allowedServices: ['code-runner', 'code-checker', 'nodejs-debugger'],
        defaultDirectives: {
            timeout: 60000,
            retryPolicy: {
                maxRetries: 2,
                backoffMs: 2000
            },
            metadata: {
                purpose: 'Generate and validate code files',
                priority: 'high'
            }
        }
    },
    // 다음 작업 선택시 프로젝트 상태 확인
    'next_task': {
        description: '다음 작업 선택을 위한 프로젝트 상태 확인',
        allowedServices: ['github', 'docker', 'vercel'],
        defaultDirectives: {
            timeout: 15000,
            metadata: {
                purpose: 'Check project status for next task',
                priority: 'low'
            }
        }
    },
    // 작업 업데이트시 변경사항 추적
    'update_task': {
        description: '작업 업데이트를 위한 변경사항 추적',
        allowedServices: ['github', 'mem0'],
        defaultDirectives: {
            timeout: 20000,
            metadata: {
                purpose: 'Track changes for task update',
                priority: 'medium'
            }
        }
    }
};
// MCP 서비스별 호출 제약사항
exports.MCP_SERVICE_CONSTRAINTS = {
    'github': {
        maxConcurrent: 3,
        cooldownMs: 1000,
        requiredEnvVars: ['GITHUB_TOKEN']
    },
    'code-runner': {
        maxConcurrent: 1,
        cooldownMs: 2000
    },
    'docker': {
        maxConcurrent: 2,
        cooldownMs: 500,
        requiredEnvVars: ['DOCKER_HOST']
    },
    'vercel': {
        maxConcurrent: 2,
        cooldownMs: 1500,
        requiredEnvVars: ['VERCEL_ACCESS_TOKEN']
    }
};
// Task 도구의 MCP 호출 인터셉터
class TaskMCPRouter {
    callHistory = new Map();
    /**
     * Task 도구의 MCP 호출 요청을 검증하고 라우팅
     */
    async routeMCPCall(taskTool, directive) {
        // 1. Task 도구가 해당 서비스를 호출할 수 있는지 확인
        const mapping = exports.TASK_MCP_MAPPINGS[taskTool];
        if (!mapping) {
            return {
                allowed: false,
                reason: `Task tool '${taskTool}' has no MCP mapping configured`
            };
        }
        if (!mapping.allowedServices.includes(directive.targetService)) {
            return {
                allowed: false,
                reason: `Task tool '${taskTool}' is not allowed to call service '${directive.targetService}'`
            };
        }
        // 2. 서비스 제약사항 확인
        const constraints = exports.MCP_SERVICE_CONSTRAINTS[directive.targetService];
        if (constraints) {
            // 동시 호출 제한 체크
            const currentCalls = this.getActiveCalls(directive.targetService);
            if (currentCalls >= constraints.maxConcurrent) {
                return {
                    allowed: false,
                    reason: `Service '${directive.targetService}' has reached max concurrent calls (${constraints.maxConcurrent})`
                };
            }
            // 쿨다운 체크
            if (!this.checkCooldown(directive.targetService, constraints.cooldownMs)) {
                return {
                    allowed: false,
                    reason: `Service '${directive.targetService}' is in cooldown period`
                };
            }
        }
        // 3. 기본 지침 병합
        const modifiedDirective = {
            ...mapping.defaultDirectives,
            ...directive,
            metadata: {
                priority: 'medium',
                ...mapping.defaultDirectives?.metadata,
                ...directive.metadata,
                taskTool,
                timestamp: new Date().toISOString()
            }
        };
        // 4. 호출 기록
        this.recordCall(directive.targetService);
        return {
            allowed: true,
            modifiedDirective
        };
    }
    getActiveCalls(service) {
        // 실제 구현에서는 진행 중인 호출 수를 추적
        return 0;
    }
    checkCooldown(service, cooldownMs) {
        const history = this.callHistory.get(service) || [];
        if (history.length === 0)
            return true;
        const lastCall = history[history.length - 1];
        return Date.now() - lastCall >= cooldownMs;
    }
    recordCall(service) {
        const history = this.callHistory.get(service) || [];
        history.push(Date.now());
        // 최근 100개 호출만 유지
        if (history.length > 100) {
            history.shift();
        }
        this.callHistory.set(service, history);
    }
}
exports.TaskMCPRouter = TaskMCPRouter;
// 싱글톤 인스턴스
exports.taskMCPRouter = new TaskMCPRouter();
//# sourceMappingURL=task-mcp-routing.js.map