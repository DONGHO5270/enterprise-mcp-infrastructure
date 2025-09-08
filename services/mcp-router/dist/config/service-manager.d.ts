import { MCPService } from '../types';
export declare class HybridServiceManager {
    private staticServices;
    private dynamicServices;
    private dynamicLoader;
    private mergedServices;
    private updateCallbacks;
    constructor();
    /**
     * Initialize the service manager
     */
    initialize(): Promise<MCPService[]>;
    /**
     * Merge static and dynamic services
     */
    private mergeServices;
    /**
     * Enable hot reload for dynamic services
     */
    private enableHotReload;
    /**
     * Register a callback for service updates
     */
    onServicesUpdated(callback: (services: MCPService[]) => void): void;
    /**
     * Get all services
     */
    getAllServices(): MCPService[];
    /**
     * Get a specific service by name
     */
    getService(name: string): MCPService | undefined;
    /**
     * Get services by capability
     */
    getServicesByCapability(capability: string): MCPService[];
    /**
     * Check if a service exists
     */
    hasService(name: string): boolean;
    /**
     * Get service count
     */
    getServiceCount(): {
        static: number;
        dynamic: number;
        total: number;
    };
    /**
     * Get service status
     */
    getServiceStatus(): any;
    /**
     * Reload services manually
     */
    reloadServices(): Promise<MCPService[]>;
    /**
     * Shutdown the service manager
     */
    shutdown(): void;
}
//# sourceMappingURL=service-manager.d.ts.map