"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const mcp_services_1 = require("./mcp-services");
const mcp_services_windows_1 = require("./mcp-services-windows");
// Load environment variables
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../configs/api-keys.env') });
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../configs/environment.env') });
// Determine if we're running in stdio mode (Claude Desktop) vs HTTP mode (Docker)
const isStdioMode = process.argv.some(arg => arg.includes('stdio-server')) || process.env.MCP_STDIO_MODE === 'true';
exports.config = {
    MAX_CONCURRENT_PROCESSES: parseInt(process.env.MAX_CONCURRENT_PROCESSES || '10'),
    REQUEST_TIMEOUT: parseInt(process.env.REQUEST_TIMEOUT || '30000'),
    PROCESS_IDLE_TIMEOUT: parseInt(process.env.PROCESS_IDLE_TIMEOUT || '60000'),
    MCP_SERVICES: isStdioMode ? mcp_services_windows_1.MCP_SERVICES_WINDOWS_CONFIG : mcp_services_1.MCP_SERVICES_CONFIG
};
//# sourceMappingURL=index.js.map