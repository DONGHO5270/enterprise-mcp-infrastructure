"use strict";
/**
 * WebSocket Handler for Real-time Communication
 * 실시간 통신을 위한 WebSocket 핸들러
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketHandler = void 0;
const ws_1 = require("ws");
const logger_1 = require("../utils/logger");
const events_1 = require("events");
class WebSocketHandler extends events_1.EventEmitter {
    wss;
    clients = new Map();
    serviceSubscriptions = new Map(); // serviceId -> clientIds
    constructor(server) {
        super();
        // 단일 WebSocket 서버로 모든 경로 처리
        this.wss = new ws_1.WebSocketServer({
            noServer: true
        });
        // HTTP 서버의 upgrade 이벤트를 직접 처리
        // 중복 호출 방지를 위한 플래그 추가
        const processedSockets = new WeakSet();
        server.on('upgrade', (request, socket, head) => {
            // 이미 처리된 소켓인지 확인
            if (processedSockets.has(socket)) {
                logger_1.logger.warn('Socket already processed, ignoring duplicate upgrade request');
                return;
            }
            processedSockets.add(socket);
            const pathname = request.url;
            if (pathname === '/ws/logs' || pathname === '/ws/services' || pathname === '/ws/alerts') {
                try {
                    this.wss.handleUpgrade(request, socket, head, (ws) => {
                        this.wss.emit('connection', ws, request);
                    });
                }
                catch (error) {
                    logger_1.logger.error('WebSocket upgrade error:', error);
                    socket.destroy();
                }
            }
            else {
                socket.destroy();
            }
        });
        this.setupHandlers();
    }
    setupHandlers() {
        // 통합 WebSocket 핸들러
        this.wss.on('connection', (ws, req) => {
            const pathname = req.url;
            const clientId = this.generateClientId();
            const client = {
                id: clientId,
                ws,
                subscriptions: new Set(),
                authenticated: true // TODO: 실제 인증 구현
            };
            this.clients.set(clientId, client);
            logger_1.logger.info(`WebSocket client connected: ${clientId} on ${pathname}`);
            // 경로별 메시지 핸들러 설정
            ws.on('message', (data) => {
                if (pathname === '/ws/logs') {
                    this.handleLogMessage(clientId, data.toString());
                }
                else if (pathname === '/ws/services') {
                    this.handleServiceMessage(clientId, data.toString());
                }
                else if (pathname === '/ws/alerts') {
                    this.handleAlertMessage(clientId, data.toString());
                }
            });
            ws.on('close', () => {
                this.handleClientDisconnect(clientId);
            });
            ws.on('error', (error) => {
                logger_1.logger.error(`WebSocket error for client ${clientId}:`, error);
            });
            // 연결 확인 메시지 전송
            ws.send(JSON.stringify({
                type: 'connected',
                data: { clientId, timestamp: new Date().toISOString() }
            }));
        });
    }
    handleLogMessage(clientId, message) {
        try {
            const data = JSON.parse(message);
            const client = this.clients.get(clientId);
            if (!client)
                return;
            switch (data.type) {
                case 'subscribe_service':
                    this.subscribeToService(clientId, data.data.serviceId);
                    break;
                case 'unsubscribe_service':
                    this.unsubscribeFromService(clientId, data.data.serviceId);
                    break;
                case 'set_filter':
                    // TODO: 구현
                    break;
                case 'ping':
                    client.ws.send(JSON.stringify({
                        type: 'pong',
                        data: { timestamp: Date.now() }
                    }));
                    break;
            }
        }
        catch (error) {
            logger_1.logger.error(`Failed to handle log message from ${clientId}:`, error);
        }
    }
    handleServiceMessage(clientId, message) {
        try {
            const data = JSON.parse(message);
            const client = this.clients.get(clientId);
            if (!client)
                return;
            switch (data.type) {
                case 'ping':
                    client.ws.send(JSON.stringify({
                        type: 'pong',
                        data: { timestamp: Date.now() }
                    }));
                    break;
            }
        }
        catch (error) {
            logger_1.logger.error(`Failed to handle service message from ${clientId}:`, error);
        }
    }
    handleAlertMessage(clientId, message) {
        try {
            const data = JSON.parse(message);
            const client = this.clients.get(clientId);
            if (!client)
                return;
            switch (data.type) {
                case 'acknowledge_alert':
                    // TODO: 구현
                    break;
                case 'ping':
                    client.ws.send(JSON.stringify({
                        type: 'pong',
                        data: { timestamp: Date.now() }
                    }));
                    break;
            }
        }
        catch (error) {
            logger_1.logger.error(`Failed to handle alert message from ${clientId}:`, error);
        }
    }
    subscribeToService(clientId, serviceId) {
        const client = this.clients.get(clientId);
        if (!client)
            return;
        client.subscriptions.add(serviceId);
        if (!this.serviceSubscriptions.has(serviceId)) {
            this.serviceSubscriptions.set(serviceId, new Set());
        }
        this.serviceSubscriptions.get(serviceId).add(clientId);
        logger_1.logger.info(`Client ${clientId} subscribed to service ${serviceId}`);
    }
    unsubscribeFromService(clientId, serviceId) {
        const client = this.clients.get(clientId);
        if (!client)
            return;
        client.subscriptions.delete(serviceId);
        const serviceClients = this.serviceSubscriptions.get(serviceId);
        if (serviceClients) {
            serviceClients.delete(clientId);
            if (serviceClients.size === 0) {
                this.serviceSubscriptions.delete(serviceId);
            }
        }
        logger_1.logger.info(`Client ${clientId} unsubscribed from service ${serviceId}`);
    }
    handleClientDisconnect(clientId) {
        const client = this.clients.get(clientId);
        if (!client)
            return;
        // 모든 구독 해제
        client.subscriptions.forEach(serviceId => {
            const serviceClients = this.serviceSubscriptions.get(serviceId);
            if (serviceClients) {
                serviceClients.delete(clientId);
                if (serviceClients.size === 0) {
                    this.serviceSubscriptions.delete(serviceId);
                }
            }
        });
        this.clients.delete(clientId);
        logger_1.logger.info(`WebSocket client disconnected: ${clientId}`);
    }
    // 로그 엔트리 브로드캐스트
    broadcastLogEntry(serviceId, log) {
        const serviceClients = this.serviceSubscriptions.get(serviceId);
        if (!serviceClients)
            return;
        const message = JSON.stringify({
            type: 'log_entry',
            data: log
        });
        serviceClients.forEach(clientId => {
            const client = this.clients.get(clientId);
            if (client && client.ws.readyState === ws_1.WebSocket.OPEN) {
                client.ws.send(message);
            }
        });
    }
    // 서비스 업데이트 브로드캐스트
    broadcastServiceUpdate(update) {
        const message = JSON.stringify({
            type: 'service_update',
            data: update
        });
        this.clients.forEach((client) => {
            if (client.ws.readyState === ws_1.WebSocket.OPEN) {
                client.ws.send(message);
            }
        });
    }
    // 시스템 알림 브로드캐스트
    broadcastSystemAlert(alert) {
        const message = JSON.stringify({
            type: 'system_alert',
            data: alert
        });
        this.clients.forEach((client) => {
            if (client.ws.readyState === ws_1.WebSocket.OPEN) {
                client.ws.send(message);
            }
        });
    }
    generateClientId() {
        return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    shutdown() {
        this.clients.forEach(client => {
            client.ws.close(1000, 'Server shutting down');
        });
        this.wss.close();
    }
}
exports.WebSocketHandler = WebSocketHandler;
//# sourceMappingURL=WebSocketHandler.js.map