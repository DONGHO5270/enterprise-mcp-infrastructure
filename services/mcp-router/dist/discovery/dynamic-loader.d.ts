import { MCPService } from '../types';
export declare class DynamicMCPLoader {
    private mcpDirectory;
    private metadataCache;
    private fileWatcher;
    constructor(mcpDirectory?: string);
    /**
     * Scan MCP directory and discover services
     */
    scanServices(): Promise<MCPService[]>;
    /**
     * Load and validate metadata
     */
    private loadAndValidateMetadata;
    /**
     * Convert metadata to MCPService format
     */
    private convertMetadataToService;
    /**
     * Resolve environment variables
     */
    private resolveEnvironmentVariables;
    /**
     * Resolve environment variable value
     */
    private resolveEnvValue;
    /**
     * Watch for changes in development mode (Hot Reload)
     */
    watchForChanges(callback: (services: MCPService[]) => void): Promise<void>;
    /**
     * Stop watching for changes
     */
    stopWatching(): void;
    /**
     * Get cached metadata for a service
     */
    getCachedMetadata(serviceName: string): any;
    /**
     * Clear metadata cache
     */
    clearCache(): void;
}
//# sourceMappingURL=dynamic-loader.d.ts.map