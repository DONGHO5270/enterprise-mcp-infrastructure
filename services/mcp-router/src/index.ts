import express from 'express';
import { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    router: 'active',
    services: 0,
    timestamp: new Date().toISOString(),
    message: 'MCP Router is running. Install services using Claude Code.'
  });
});

// MCP router base endpoint
app.post('/mcp/:service', async (req: Request, res: Response) => {
  const { service } = req.params;
  
  console.log(`Request for MCP service: ${service}`);
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
  res.json({
    status: 'pending',
    service: service,
    message: `MCP service '${service}' is not yet installed`,
    hint: 'Use Claude Code to install MCP services',
    installation: `claude > Install ${service} MCP`
  });
});

// List available services
app.get('/services', (req: Request, res: Response) => {
  res.json({
    services: [],
    total: 0,
    message: 'No MCP services installed yet',
    hint: 'Install services using: claude > Install [service-name] MCP',
    examples: [
      'Install filesystem MCP',
      'Install github MCP',
      'Install weather MCP'
    ]
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'MCP Router',
    version: '1.0.0',
    status: 'running',
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
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Services list: http://localhost:${PORT}/services`);
  console.log(`========================================`);
});