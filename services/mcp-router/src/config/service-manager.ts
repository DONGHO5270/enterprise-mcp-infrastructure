// Phase 3.0: Hybrid Service Manager
// Manages both static (hardcoded) and dynamic (discovered) MCP services

import { MCPService } from '../types';
import { MCP_SERVICES_CONFIG } from './mcp-services';
import { DynamicMCPLoader } from '../discovery/dynamic-loader';
import { logger } from '../utils/logger';

export class HybridServiceManager {
  private staticServices: MCPService[];
  private dynamicServices: MCPService[];
  private dynamicLoader: DynamicMCPLoader;
  private mergedServices: Map<string, MCPService>;
  private updateCallbacks: ((services: MCPService[]) => void)[] = [];
  
  constructor() {
    this.staticServices = [];
    this.dynamicServices = [];
    this.mergedServices = new Map();
    this.dynamicLoader = new DynamicMCPLoader(
      process.env.MCP_DIRECTORY || '/app/services/mcp'
    );
  }
  
  /**
   * Initialize the service manager
   */
  async initialize(): Promise<MCPService[]> {
    logger.info('[Service Manager] Initializing Hybrid Service Manager...');
    
    // Load static services (backward compatibility)
    this.staticServices = Object.values(MCP_SERVICES_CONFIG);
    logger.info(`[Service Manager] Loaded ${this.staticServices.length} static services`);
    
    // Load dynamic services
    if (process.env.ENABLE_DYNAMIC_DISCOVERY !== 'false') {
      this.dynamicServices = await this.dynamicLoader.scanServices();
      logger.info(`[Service Manager] Discovered ${this.dynamicServices.length} dynamic services`);
    } else {
      logger.info('[Service Manager] Dynamic Discovery disabled');
    }
    
    // Merge services (dynamic services override static)
    const allServices = this.mergeServices();
    
    // Enable hot reload in development
    if (process.env.NODE_ENV === 'development') {
      await this.enableHotReload();
    }
    
    return allServices;
  }
  
  /**
   * Merge static and dynamic services
   */
  private mergeServices(): MCPService[] {
    this.mergedServices.clear();
    
    // Add static services first
    for (const service of this.staticServices) {
      this.mergedServices.set(service.name, service);
    }
    
    // Override with dynamic services (they have priority)
    for (const service of this.dynamicServices) {
      if (this.mergedServices.has(service.name)) {
        logger.info(`[Service Manager] Dynamic service '${service.name}' overrides static configuration`);
      } else {
        logger.info(`[Service Manager] New dynamic service added: '${service.name}'`);
      }
      this.mergedServices.set(service.name, service);
    }
    
    const allServices = Array.from(this.mergedServices.values());
    logger.info(`[Service Manager] Total services available: ${allServices.length}`);
    
    return allServices;
  }
  
  /**
   * Enable hot reload for dynamic services
   */
  private async enableHotReload() {
    logger.info('[Service Manager] Enabling hot reload for dynamic services...');
    
    await this.dynamicLoader.watchForChanges(async (services) => {
      this.dynamicServices = services;
      const allServices = this.mergeServices();
      
      // Notify all registered callbacks
      for (const callback of this.updateCallbacks) {
        callback(allServices);
      }
      
      logger.info('[Service Manager] Services reloaded due to file changes');
    });
  }
  
  /**
   * Register a callback for service updates
   */
  onServicesUpdated(callback: (services: MCPService[]) => void) {
    this.updateCallbacks.push(callback);
  }
  
  /**
   * Get all services
   */
  getAllServices(): MCPService[] {
    return Array.from(this.mergedServices.values());
  }
  
  /**
   * Get a specific service by name
   */
  getService(name: string): MCPService | undefined {
    return this.mergedServices.get(name);
  }
  
  /**
   * Get services by capability
   */
  getServicesByCapability(capability: string): MCPService[] {
    return this.getAllServices().filter(service => 
      service.capabilities?.includes(capability)
    );
  }
  
  /**
   * Check if a service exists
   */
  hasService(name: string): boolean {
    return this.mergedServices.has(name);
  }
  
  /**
   * Get service count
   */
  getServiceCount(): { static: number; dynamic: number; total: number } {
    return {
      static: this.staticServices.length,
      dynamic: this.dynamicServices.length,
      total: this.mergedServices.size
    };
  }
  
  /**
   * Get service status
   */
  getServiceStatus(): any {
    const status: any = {
      staticServices: this.staticServices.map(s => s.name),
      dynamicServices: this.dynamicServices.map(s => ({
        name: s.name,
        version: s.metadata?.version || 'unknown',
        description: s.metadata?.description || 'No description'
      })),
      totalServices: this.mergedServices.size,
      capabilities: {}
    };
    
    // Count services by capability
    for (const service of this.getAllServices()) {
      for (const cap of service.capabilities || []) {
        status.capabilities[cap] = (status.capabilities[cap] || 0) + 1;
      }
    }
    
    return status;
  }
  
  /**
   * Reload services manually
   */
  async reloadServices(): Promise<MCPService[]> {
    logger.info('[Service Manager] Manual reload requested...');
    
    // Reload dynamic services
    if (process.env.ENABLE_DYNAMIC_DISCOVERY !== 'false') {
      this.dynamicServices = await this.dynamicLoader.scanServices();
    }
    
    // Merge and return
    return this.mergeServices();
  }
  
  /**
   * Shutdown the service manager
   */
  shutdown() {
    logger.info('[Service Manager] Shutting down...');
    this.dynamicLoader.stopWatching();
    this.updateCallbacks = [];
    this.mergedServices.clear();
  }
}