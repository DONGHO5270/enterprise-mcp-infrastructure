"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCPSimpleRouter = void 0;
const child_process_1 = require("child_process");
const logger_1 = require("../utils/logger");
const uuid_1 = require("uuid");
class MCPSimpleRouter {
    config;
    constructor(config) {
        this.config = config;
    }
    async executeMCP(serviceName, mcpRequest) {
        const service = this.config[serviceName];
        if (!service) {
            return {
                jsonrpc: '2.0',
                id: mcpRequest.id,
                error: {
                    code: -32601,
                    message: `Unknown service: ${serviceName}`
                }
            };
        }
        logger_1.logger.info(`Executing MCP ${serviceName}.${mcpRequest.method}`);
        return new Promise((resolve, reject) => {
            const childProcess = (0, child_process_1.spawn)(service.command, service.args || [], {
                cwd: service.cwd,
                env: {
                    ...process.env,
                    ...service.env,
                    LANG: 'C.UTF-8',
                    LC_ALL: 'C.UTF-8'
                },
                stdio: ['pipe', 'pipe', 'pipe']
            });
            let stdout = '';
            let stderr = '';
            let responded = false;
            // Send MCP request
            childProcess.stdin?.write(JSON.stringify(mcpRequest) + '\n');
            // Don't close stdin immediately - MCP servers need to stay running
            childProcess.stdout?.on('data', (data) => {
                stdout += data.toString();
                logger_1.logger.debug(`${serviceName} stdout:`, data.toString().trim());
                // Try to parse response
                if (!responded) {
                    const lines = stdout.split('\n');
                    for (const line of lines) {
                        if (line.trim()) {
                            try {
                                const response = JSON.parse(line);
                                if (response.id === mcpRequest.id || response.jsonrpc) {
                                    responded = true;
                                    resolve(response);
                                    childProcess.kill();
                                    return;
                                }
                            }
                            catch (e) {
                                // Continue if not valid JSON
                            }
                        }
                    }
                }
            });
            childProcess.stderr?.on('data', (data) => {
                stderr += data.toString();
                logger_1.logger.error(`${serviceName} stderr:`, data.toString());
            });
            childProcess.on('error', (error) => {
                logger_1.logger.error(`Process error for ${serviceName}:`, error);
                if (!responded) {
                    resolve({
                        jsonrpc: '2.0',
                        id: mcpRequest.id,
                        error: {
                            code: -32603,
                            message: error.message
                        }
                    });
                }
            });
            childProcess.on('exit', (code) => {
                if (!responded) {
                    logger_1.logger.error(`${serviceName} exited with code ${code}`);
                    logger_1.logger.error(`stdout: ${stdout}`);
                    logger_1.logger.error(`stderr: ${stderr}`);
                    resolve({
                        jsonrpc: '2.0',
                        id: mcpRequest.id,
                        error: {
                            code: -32603,
                            message: `Process exited with code ${code} without responding`
                        }
                    });
                }
            });
            // Timeout
            setTimeout(() => {
                if (!responded) {
                    childProcess.kill();
                    resolve({
                        jsonrpc: '2.0',
                        id: mcpRequest.id,
                        error: {
                            code: -32603,
                            message: `Timeout waiting for response from ${serviceName}`
                        }
                    });
                }
            }, 30000);
        });
    }
    async executeSimple(serviceName, method, params) {
        const service = this.config[serviceName];
        if (!service) {
            throw new Error(`Unknown service: ${serviceName}`);
        }
        logger_1.logger.info(`Executing ${serviceName}.${method}`);
        return new Promise((resolve, reject) => {
            const childProcess = (0, child_process_1.spawn)(service.command, service.args || [], {
                cwd: service.cwd,
                env: {
                    ...process.env,
                    ...service.env,
                    LANG: 'C.UTF-8',
                    LC_ALL: 'C.UTF-8'
                },
                stdio: ['pipe', 'pipe', 'pipe']
            });
            let stdout = '';
            let stderr = '';
            let responded = false;
            // Send MCP request immediately
            const request = {
                jsonrpc: '2.0',
                id: (0, uuid_1.v4)(),
                method,
                params
            };
            childProcess.stdin?.write(JSON.stringify(request) + '\n');
            childProcess.stdin?.end();
            childProcess.stdout?.on('data', (data) => {
                stdout += data.toString();
                logger_1.logger.debug(`${serviceName} stdout:`, data.toString().trim());
                // Try to parse response
                if (!responded) {
                    const lines = stdout.split('\n');
                    for (const line of lines) {
                        if (line.trim()) {
                            try {
                                const response = JSON.parse(line);
                                if (response.id === request.id) {
                                    responded = true;
                                    if (response.error) {
                                        reject(new Error(response.error.message));
                                    }
                                    else {
                                        resolve(response.result);
                                    }
                                    childProcess.kill();
                                    return;
                                }
                            }
                            catch (e) {
                                // Continue if not valid JSON
                            }
                        }
                    }
                }
            });
            childProcess.stderr?.on('data', (data) => {
                stderr += data.toString();
                logger_1.logger.error(`${serviceName} stderr:`, data.toString());
            });
            childProcess.on('error', (error) => {
                logger_1.logger.error(`Process error for ${serviceName}:`, error);
                reject(error);
            });
            childProcess.on('exit', (code) => {
                if (!responded) {
                    logger_1.logger.error(`${serviceName} exited with code ${code}`);
                    logger_1.logger.error(`stdout: ${stdout}`);
                    logger_1.logger.error(`stderr: ${stderr}`);
                    reject(new Error(`Process exited with code ${code} without responding`));
                }
            });
            // Timeout
            setTimeout(() => {
                if (!responded) {
                    childProcess.kill();
                    reject(new Error(`Timeout waiting for response from ${serviceName}`));
                }
            }, 30000);
        });
    }
}
exports.MCPSimpleRouter = MCPSimpleRouter;
//# sourceMappingURL=MCPSimpleRouter.js.map