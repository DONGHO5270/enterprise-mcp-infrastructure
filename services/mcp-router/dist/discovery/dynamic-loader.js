"use strict";
// Phase 3.0: Dynamic Service Discovery Implementation
// Based on ADVANCED-MCP-WORKFLOW-ANALYSIS.md Section 2.4
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicMCPLoader = void 0;
const fs = __importStar(require("fs/promises"));
const fsSync = __importStar(require("fs"));
const path = __importStar(require("path"));
const zod_1 = require("zod");
const logger_1 = require("../utils/logger");
// Metadata schema validation
const MCPServiceMetadataSchema = zod_1.z.object({
    name: zod_1.z.string(),
    version: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    runtime: zod_1.z.object({
        command: zod_1.z.string(),
        args: zod_1.z.array(zod_1.z.string()).optional(),
        workingDirectory: zod_1.z.string().optional(),
        startupTimeout: zod_1.z.number().optional(),
        healthCheckInterval: zod_1.z.number().optional()
    }),
    environment: zod_1.z.object({
        required: zod_1.z.array(zod_1.z.object({
            name: zod_1.z.string(),
            description: zod_1.z.string(),
            source: zod_1.z.string()
        })).optional(),
        optional: zod_1.z.array(zod_1.z.object({
            name: zod_1.z.string(),
            description: zod_1.z.string(),
            default: zod_1.z.string()
        })).optional()
    }).optional(),
    capabilities: zod_1.z.object({
        tools: zod_1.z.boolean().default(true),
        resources: zod_1.z.boolean().default(false),
        prompts: zod_1.z.boolean().default(false),
        sampling: zod_1.z.boolean().default(false)
    }).optional(),
    dependencies: zod_1.z.object({
        docker: zod_1.z.object({
            image: zod_1.z.string(),
            volumes: zod_1.z.array(zod_1.z.string()).optional(),
            network: zod_1.z.string().optional()
        }).optional(),
        services: zod_1.z.array(zod_1.z.string()).optional()
    }).optional()
});
class DynamicMCPLoader {
    mcpDirectory;
    metadataCache;
    fileWatcher = null;
    constructor(mcpDirectory = '/app/services/mcp') {
        this.mcpDirectory = mcpDirectory;
        this.metadataCache = new Map();
    }
    /**
     * Scan MCP directory and discover services
     */
    async scanServices() {
        const services = [];
        try {
            // Check if directory exists
            try {
                await fs.access(this.mcpDirectory);
            }
            catch {
                logger_1.logger.warn(`MCP directory does not exist: ${this.mcpDirectory}`);
                return services;
            }
            const directories = await fs.readdir(this.mcpDirectory);
            for (const dir of directories) {
                // Skip backup directories and non-MCP folders
                if (dir.includes('backup') || dir.startsWith('.')) {
                    continue;
                }
                const servicePath = path.join(this.mcpDirectory, dir);
                const stat = await fs.stat(servicePath);
                if (!stat.isDirectory()) {
                    continue;
                }
                const metadataPath = path.join(servicePath, 'mcp-service.json');
                try {
                    await fs.access(metadataPath);
                    const metadata = await this.loadAndValidateMetadata(metadataPath);
                    const service = this.convertMetadataToService(metadata, servicePath);
                    services.push(service);
                    logger_1.logger.info(`✓ [Dynamic Discovery] Found MCP service: ${metadata.name} v${metadata.version || '1.0.0'}`);
                }
                catch (error) {
                    // File doesn't exist or failed to load - skip this directory
                    continue;
                }
            }
            logger_1.logger.info(`[Dynamic Discovery] Scanned ${services.length} dynamic MCP services`);
        }
        catch (error) {
            logger_1.logger.error('[Dynamic Discovery] Failed to scan MCP directory:', error);
        }
        return services;
    }
    /**
     * Load and validate metadata
     */
    async loadAndValidateMetadata(metadataPath) {
        const content = await fs.readFile(metadataPath, 'utf-8');
        const metadata = JSON.parse(content);
        // Schema validation
        const result = MCPServiceMetadataSchema.safeParse(metadata);
        if (!result.success) {
            throw new Error(`Invalid metadata: ${result.error.message}`);
        }
        this.metadataCache.set(metadata.name, result.data);
        return result.data;
    }
    /**
     * Convert metadata to MCPService format
     */
    convertMetadataToService(metadata, servicePath) {
        const capabilities = [];
        if (metadata.capabilities) {
            if (metadata.capabilities.tools)
                capabilities.push('tools');
            if (metadata.capabilities.resources)
                capabilities.push('resources');
            if (metadata.capabilities.prompts)
                capabilities.push('prompts');
            if (metadata.capabilities.sampling)
                capabilities.push('sampling');
        }
        else {
            // Default to tools capability
            capabilities.push('tools');
        }
        return {
            name: metadata.name,
            command: metadata.runtime.command,
            args: metadata.runtime.args || [],
            cwd: path.join(servicePath, metadata.runtime.workingDirectory || '.'),
            env: this.resolveEnvironmentVariables(metadata.environment),
            capabilities,
            startupTimeout: metadata.runtime.startupTimeout || 15000,
            metadata: {
                version: metadata.version,
                description: metadata.description,
                dynamicallyLoaded: true
            }
        };
    }
    /**
     * Resolve environment variables
     */
    resolveEnvironmentVariables(envConfig) {
        const resolved = {};
        // Process required variables
        if (envConfig?.required) {
            for (const envVar of envConfig.required) {
                const value = this.resolveEnvValue(envVar.source);
                if (value) {
                    resolved[envVar.name] = value;
                }
                else {
                    logger_1.logger.warn(`⚠ [Dynamic Discovery] Missing required env: ${envVar.name}`);
                }
            }
        }
        // Process optional variables
        if (envConfig?.optional) {
            for (const envVar of envConfig.optional) {
                const value = this.resolveEnvValue(envVar.source) || envVar.default;
                if (value) {
                    resolved[envVar.name] = value;
                }
            }
        }
        return resolved;
    }
    /**
     * Resolve environment variable value
     */
    resolveEnvValue(source) {
        if (!source)
            return undefined;
        if (source.startsWith('${') && source.endsWith('}')) {
            const envKey = source.slice(2, -1);
            return process.env[envKey];
        }
        return source;
    }
    /**
     * Watch for changes in development mode (Hot Reload)
     */
    async watchForChanges(callback) {
        if (process.env.NODE_ENV !== 'development') {
            logger_1.logger.info('[Dynamic Discovery] Hot reload disabled in production');
            return;
        }
        logger_1.logger.info('[Dynamic Discovery] Hot reload enabled - watching for changes');
        try {
            this.fileWatcher = fsSync.watch(this.mcpDirectory, { recursive: true });
            this.fileWatcher.on('change', async (eventType, filename) => {
                if (filename?.endsWith('mcp-service.json')) {
                    logger_1.logger.info(`🔄 [Dynamic Discovery] Service metadata changed: ${filename}`);
                    const services = await this.scanServices();
                    callback(services);
                }
            });
            this.fileWatcher.on('error', (error) => {
                logger_1.logger.error('[Dynamic Discovery] Watch error:', error);
            });
        }
        catch (error) {
            logger_1.logger.error('[Dynamic Discovery] Failed to start file watcher:', error);
        }
    }
    /**
     * Stop watching for changes
     */
    stopWatching() {
        if (this.fileWatcher) {
            this.fileWatcher.close();
            this.fileWatcher = null;
            logger_1.logger.info('[Dynamic Discovery] Stopped watching for changes');
        }
    }
    /**
     * Get cached metadata for a service
     */
    getCachedMetadata(serviceName) {
        return this.metadataCache.get(serviceName);
    }
    /**
     * Clear metadata cache
     */
    clearCache() {
        this.metadataCache.clear();
        logger_1.logger.info('[Dynamic Discovery] Metadata cache cleared');
    }
}
exports.DynamicMCPLoader = DynamicMCPLoader;
//# sourceMappingURL=dynamic-loader.js.map