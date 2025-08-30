const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    router: 'active',
    services: 0,
    timestamp: new Date().toISOString()
  });
});

// MCP router base endpoint
app.post('/mcp/:service', async (req, res) => {
  const { service } = req.params;
  
  res.json({
    status: 'pending',
    message: `MCP service '${service}' is not yet installed`,
    hint: 'Use Claude Code to install MCP services'
  });
});

// List available services
app.get('/services', (req, res) => {
  res.json({
    services: [],
    message: 'No MCP services installed yet',
    hint: 'Install services using: claude > Install [service-name] MCP'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`MCP Router running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});