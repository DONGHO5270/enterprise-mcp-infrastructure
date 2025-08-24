import { WebSocket } from 'ws';
import { MCPRouter } from '../router/MCPRouter';
import { WebSocketRequest } from '../types';
export declare class StdioBridge {
    private router;
    private activeStreams;
    constructor(router: MCPRouter);
    handleWebSocketRequest(ws: WebSocket, request: WebSocketRequest): Promise<void>;
    private handleExecute;
    private handleStream;
    private handleCancel;
    private sendError;
    cleanup(): void;
}
//# sourceMappingURL=StdioBridge.d.ts.map