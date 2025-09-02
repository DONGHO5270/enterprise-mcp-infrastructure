"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
const services = {
    'clear-thought': {
        url: 'http://clear-thought:3000',
        name: 'Clear Thought MCP',
        description: 'Systematic thinking and mental models',
        status: 'active'
    }
};
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        router: 'active',
        services: Object.keys(services).length,
        timestamp: new Date().toISOString(),
        message: 'MCP Router is running with installed services.'
    });
});
// MCP router base endpoint
app.post('/mcp/:service', async (req, res) => {
    const { service } = req.params;
    console.log(`Request for MCP service: ${service}`);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    const serviceConfig = services[service];
    if (!serviceConfig) {
        return res.json({
            status: 'pending',
            service: service,
            message: `MCP service '${service}' is not yet installed`,
            hint: 'Use Claude Code to install MCP services',
            installation: `claude > Install ${service} MCP`
        });
    }
    try {
        // Forward request to the service
        const response = await axios_1.default.post(`${serviceConfig.url}/mcp`, req.body, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });
        res.json(response.data);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error forwarding to ${service}:`, errorMessage);
        res.status(500).json({
            error: 'Service communication failed',
            service: service,
            message: errorMessage
        });
    }
});
// List available services
app.get('/services', (req, res) => {
    const serviceList = Object.entries(services).map(([key, value]) => ({
        id: key,
        name: value.name,
        description: value.description,
        status: value.status
    }));
    res.json({
        services: serviceList,
        total: serviceList.length,
        message: `${serviceList.length} MCP service(s) installed`,
        available: Object.keys(services)
    });
});
// Root endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'MCP Router',
        version: '1.0.0',
        status: 'running',
        installedServices: Object.keys(services),
        endpoints: {
            health: '/health',
            services: '/services',
            mcp: '/mcp/:service'
        }
    });
});
// Start server
app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`MCP Router started successfully!`);
    console.log(`Port: ${PORT}`);
    console.log(`Installed services: ${Object.keys(services).join(', ') || 'None'}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Services list: http://localhost:${PORT}/services`);
    console.log(`========================================`);
});
