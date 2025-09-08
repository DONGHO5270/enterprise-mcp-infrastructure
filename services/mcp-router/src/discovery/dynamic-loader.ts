// Phase 3.0: Dynamic Service Discovery Implementation
// Based on ADVANCED-MCP-WORKFLOW-ANALYSIS.md Section 2.4

import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';
import { z } from 'zod';
import { MCPService } from '../types';
import { logger } from '../utils/logger';

// Metadata schema validation
const MCPServiceMetadataSchema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string().optional(),
  runtime: z.object({
    command: z.string(),
    args: z.array(z.string()).optional(),
    workingDirectory: z.string().optional(),
    startupTimeout: z.number().optional(),
    healthCheckInterval: z.number().optional()
  }),
  environment: z.object({
    required: z.array(z.object({
      name: z.string(),
      description: z.string(),
      source: z.string()
    })).optional(),
    optional: z.array(z.object({
      name: z.string(),
      description: z.string(),
      default: z.string()
    })).optional()
  }).optional(),
  capabilities: z.object({
    tools: z.boolean().default(true),
    resources: z.boolean().default(false),
    prompts: z.boolean().default(false),
    sampling: z.boolean().default(false)
  }).optional(),
  dependencies: z.object({
    docker: z.object({
      image: z.string(),
      volumes: z.array(z.string()).optional(),
      network: z.string().optional()
    }).optional(),
    services: z.array(z.string()).optional()
  }).optional()
});

export class DynamicMCPLoader {
  private mcpDirectory: string;
  private metadataCache: Map<string, any>;
  private fileWatcher: fsSync.FSWatcher | null = null;
  
  constructor(mcpDirectory: string = '/app/services/mcp') {
    this.mcpDirectory = mcpDirectory;
    this.metadataCache = new Map();
  }
  
  /**
   * Scan MCP directory and discover services
   */
  async scanServices(): Promise<MCPService[]> {
    const services: MCPService[] = [];
    
    try {
      // Check if directory exists
      try {
        await fs.access(this.mcpDirectory);
      } catch {
        logger.warn(`MCP directory does not exist: ${this.mcpDirectory}`);
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
          
          logger.info(`✓ [Dynamic Discovery] Found MCP service: ${metadata.name} v${metadata.version || '1.0.0'}`);
        } catch (error: any) {
          // File doesn't exist or failed to load - skip this directory
          continue;
        }
      }
      
      logger.info(`[Dynamic Discovery] Scanned ${services.length} dynamic MCP services`);
    } catch (error: any) {
      logger.error('[Dynamic Discovery] Failed to scan MCP directory:', error);
    }
    
    return services;
  }
  
  /**
   * Load and validate metadata
   */
  private async loadAndValidateMetadata(metadataPath: string): Promise<any> {
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
  private convertMetadataToService(metadata: any, servicePath: string): MCPService {
    const capabilities: string[] = [];
    
    if (metadata.capabilities) {
      if (metadata.capabilities.tools) capabilities.push('tools');
      if (metadata.capabilities.resources) capabilities.push('resources');
      if (metadata.capabilities.prompts) capabilities.push('prompts');
      if (metadata.capabilities.sampling) capabilities.push('sampling');
    } else {
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
  private resolveEnvironmentVariables(envConfig: any): Record<string, string> {
    const resolved: Record<string, string> = {};
    
    // Process required variables
    if (envConfig?.required) {
      for (const envVar of envConfig.required) {
        const value = this.resolveEnvValue(envVar.source);
        if (value) {
          resolved[envVar.name] = value;
        } else {
          logger.warn(`⚠ [Dynamic Discovery] Missing required env: ${envVar.name}`);
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
  private resolveEnvValue(source: string): string | undefined {
    if (!source) return undefined;
    
    if (source.startsWith('${') && source.endsWith('}')) {
      const envKey = source.slice(2, -1);
      return process.env[envKey];
    }
    return source;
  }
  
  /**
   * Watch for changes in development mode (Hot Reload)
   */
  async watchForChanges(callback: (services: MCPService[]) => void) {
    if (process.env.NODE_ENV !== 'development') {
      logger.info('[Dynamic Discovery] Hot reload disabled in production');
      return;
    }
    
    logger.info('[Dynamic Discovery] Hot reload enabled - watching for changes');
    
    try {
      this.fileWatcher = fsSync.watch(this.mcpDirectory, { recursive: true });
      
      this.fileWatcher.on('change', async (eventType: string, filename: string | null) => {
        if (filename?.endsWith('mcp-service.json')) {
          logger.info(`🔄 [Dynamic Discovery] Service metadata changed: ${filename}`);
          const services = await this.scanServices();
          callback(services);
        }
      });
      
      this.fileWatcher.on('error', (error: Error) => {
        logger.error('[Dynamic Discovery] Watch error:', error);
      });
    } catch (error: any) {
      logger.error('[Dynamic Discovery] Failed to start file watcher:', error);
    }
  }
  
  /**
   * Stop watching for changes
   */
  stopWatching() {
    if (this.fileWatcher) {
      this.fileWatcher.close();
      this.fileWatcher = null;
      logger.info('[Dynamic Discovery] Stopped watching for changes');
    }
  }
  
  /**
   * Get cached metadata for a service
   */
  getCachedMetadata(serviceName: string): any {
    return this.metadataCache.get(serviceName);
  }
  
  /**
   * Clear metadata cache
   */
  clearCache() {
    this.metadataCache.clear();
    logger.info('[Dynamic Discovery] Metadata cache cleared');
  }
}