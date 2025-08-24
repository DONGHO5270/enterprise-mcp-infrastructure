"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StdioBridge = void 0;
const logger_1 = require("../utils/logger");
class StdioBridge {
    router;
    activeStreams;
    constructor(router) {
        this.router = router;
        this.activeStreams = new Map();
    }
    async handleWebSocketRequest(ws, request) {
        const { id, type, service, method, params } = request;
        try {
            switch (type) {
                case 'execute':
                    await this.handleExecute(ws, id, service, method, params);
                    break;
                case 'stream':
                    await this.handleStream(ws, id, service, method, params);
                    break;
                case 'cancel':
                    this.handleCancel(id);
                    break;
                default:
                    throw new Error(`Unknown request type: ${type}`);
            }
        }
        catch (error) {
            this.sendError(ws, id, error);
        }
    }
    async handleExecute(ws, id, service, method, params) {
        try {
            const result = await this.router.execute(service, method, params);
            const response = {
                id,
                type: 'result',
                result
            };
            ws.send(JSON.stringify(response));
        }
        catch (error) {
            this.sendError(ws, id, error);
        }
    }
    async handleStream(ws, id, service, method, params) {
        this.activeStreams.set(id, ws);
        try {
            // Create a custom event emitter for this stream
            const streamHandler = (data) => {
                if (this.activeStreams.has(id)) {
                    const response = {
                        id,
                        type: 'stream',
                        data
                    };
                    ws.send(JSON.stringify(response));
                }
            };
            // Register stream handler
            this.router.on(`stream:${id}`, streamHandler);
            // Execute with streaming
            const result = await this.router.execute(service, method, {
                ...params,
                _stream: true,
                _streamId: id
            });
            // Send completion
            const response = {
                id,
                type: 'complete',
                result
            };
            ws.send(JSON.stringify(response));
        }
        catch (error) {
            this.sendError(ws, id, error);
        }
        finally {
            this.activeStreams.delete(id);
            this.router.removeAllListeners(`stream:${id}`);
        }
    }
    handleCancel(id) {
        const ws = this.activeStreams.get(id);
        if (ws) {
            const response = {
                id,
                type: 'cancelled'
            };
            ws.send(JSON.stringify(response));
            this.activeStreams.delete(id);
        }
    }
    sendError(ws, id, error) {
        const response = {
            id,
            type: 'error',
            error: {
                message: error instanceof Error ? error.message : String(error),
                code: error.code || 'INTERNAL_ERROR'
            }
        };
        ws.send(JSON.stringify(response));
        logger_1.logger.error(`WebSocket error for request ${id}:`, error);
    }
    cleanup() {
        // Close all active streams
        for (const [id, ws] of this.activeStreams) {
            try {
                const response = {
                    id,
                    type: 'cancelled'
                };
                ws.send(JSON.stringify(response));
            }
            catch (e) {
                // Ignore send errors during cleanup
            }
        }
        this.activeStreams.clear();
    }
}
exports.StdioBridge = StdioBridge;
//# sourceMappingURL=StdioBridge.js.map