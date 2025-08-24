/**
 * WebSocket Handler for Real-time Communication
 * 실시간 통신을 위한 WebSocket 핸들러
 */
import { WebSocket } from 'ws';
import { Server } from 'http';
import { EventEmitter } from 'events';
export interface WSClient {
    id: string;
    ws: WebSocket;
    subscriptions: Set<string>;
    authenticated: boolean;
}
export interface LogEntry {
    id: string;
    timestamp: string;
    level: string;
    service: string;
    message: string;
    metadata?: any;
}
export interface ServiceUpdate {
    serviceId: string;
    status: string;
    timestamp: string;
}
export interface SystemAlert {
    id: string;
    type: string;
    source: string;
    title: string;
    message: string;
    severity: string;
    timestamp: string;
    metadata?: any;
}
export declare class WebSocketHandler extends EventEmitter {
    private wss;
    private clients;
    private serviceSubscriptions;
    constructor(server: Server);
    private setupHandlers;
    private handleLogMessage;
    private handleServiceMessage;
    private handleAlertMessage;
    private subscribeToService;
    private unsubscribeFromService;
    private handleClientDisconnect;
    broadcastLogEntry(serviceId: string, log: LogEntry): void;
    broadcastServiceUpdate(update: ServiceUpdate): void;
    broadcastSystemAlert(alert: SystemAlert): void;
    private generateClientId;
    shutdown(): void;
}
//# sourceMappingURL=WebSocketHandler.d.ts.map