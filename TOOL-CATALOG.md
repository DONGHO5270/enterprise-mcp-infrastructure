# 🔍 Verified Tool Catalog

> **286 verified tools** across 23 MCP services
> 
> Generated: 2025-08-24T04:41:06.423Z
> Accuracy: 100% (286/286 tools verified)

## 📊 Summary by Tier

### 🏆 Tier 1 - High-Value Services
- **166/166 tools** (100% accuracy)
- **5/5 services** operational
- **Use cases:** Production deployments, core development workflows

### 🛠️ Tier 2 - Specialized Services  
- **75/75 tools** (100% accuracy)
- **5/5 services** operational
- **Use cases:** Automation, testing, analysis

### 🔧 Tier 3 - Specialized Tools
- **45/45 tools** (100% accuracy)
- **13/13 services** operational
- **Use cases:** Specific tasks, experimental features

## 🎯 Quick Access

| Tier | Service | Tools | Status | Accuracy | Description |
|------|---------|-------|--------|----------|-------------|
| Tier 1 | **vercel** | 69 | ✅ | 100% | Vercel platform management |
| Tier 1 | **docker** | 27 | ✅ | 100% | Container management |
| Tier 1 | **supabase** | 26 | ✅ | 100% | Database & Auth |
| Tier 1 | **taskmaster-ai** | 25 | ✅ | 100% | AI-powered task management |
| Tier 1 | **npm-sentinel** | 19 | ✅ | 100% | Node.js package management |
| Tier 2 | **desktop-commander** | 18 | ✅ | 100% | Desktop automation |
| Tier 2 | **mobile** | 17 | ✅ | 100% | Mobile automation & testing |
| Tier 2 | **serena** | 17 | ✅ | 100% | Code search & analysis |
| Tier 2 | **nodejs-debugger** | 13 | ✅ | 100% | Node.js debugging |
| Tier 2 | **playwright** | 10 | ✅ | 100% | Browser automation |
| Tier 3 | **clear-thought** | 9 | ✅ | 100% | Systematic thinking |
| Tier 3 | **github** | 8 | ✅ | 100% | GitHub API management |
| Tier 3 | **node-omnibus** | 7 | ✅ | 100% | Node.js utilities |
| Tier 3 | **21stdev-magic** | 4 | ✅ | 100% | Development tools |
| Tier 3 | **cloudflare** | 3 | ✅ | 100% | DNS/CDN management |
| Tier 3 | **mem0** | 3 | ✅ | 100% | Memory storage |
| Tier 3 | **context7** | 2 | ✅ | 100% | Context analysis |
| Tier 3 | **code-runner** | 2 | ✅ | 100% | Code execution |
| Tier 3 | **code-checker** | 2 | ✅ | 100% | Code quality |
| Tier 3 | **serper-search** | 2 | ✅ | 100% | Search API |
| Tier 3 | **code-context-provider** | 1 | ✅ | 100% | Context provider |
| Tier 3 | **stochastic-thinking** | 1 | ✅ | 100% | 5 stochastic algorithms |
| Tier 3 | **mermaid** | 1 | ✅ | 100% | Diagram generation (unstable) |

## 📋 Detailed Tool Listings

*Each tool has been tested and verified to work with real responses.*


## 🏆 Tier 1 Services


### vercel (69 tools)

Vercel platform management

#### 1. `list_projects`

List all projects from Vercel. Commands: 'list projects', 'show projects', 'get projects', 'list all projects', 'show all projects', 'get all projects', 'list vercel projects', 'show my projects', 'list my projects', 'get my projects', 'retrieve projects', 'fetch projects', 'display projects', 'view projects'

**Parameters:**
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 2. `create_project`

Create a new project with the provided configuration

**Parameters:**
- `name` *(required)*: string - The desired name for the project
- `framework`: any - The framework being used for this project
- `buildCommand`: any - The build command for this project
- `devCommand`: any - The dev command for this project
- `installCommand`: any - The install command for this project
- `outputDirectory`: any - The output directory of the project
- `publicSource`: boolean,null - Whether source code and logs should be public
- `rootDirectory`: any - The directory or relative path to the source code
- `serverlessFunctionRegion`: any - The region to deploy Serverless Functions
- `gitRepository`: object - The Git Repository to connect
- `environmentVariables`: array - Collection of ENV Variables
- `serverlessFunctionZeroConfigFailover`: boolean - Enable Zero Config Failover
- `enableAffectedProjectsDeployments`: boolean - Skip deployments when no changes to root directory
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 3. `delete_project`

Delete a specific project

**Parameters:**
- `idOrName` *(required)*: string - The unique project identifier or project name
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 4. `get_project_domain`

Get project domain by project id/name and domain name

**Parameters:**
- `idOrName` *(required)*: string - The unique project identifier or project name
- `domain` *(required)*: string - The project domain name
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 5. `update_project`

Update an existing project

**Parameters:**
- `idOrName` *(required)*: string - The unique project identifier or project name
- `name`: string - The desired name for the project
- `framework`: any - The framework being used for this project
- `buildCommand`: any - The build command for this project
- `devCommand`: any - The dev command for this project
- `installCommand`: any - The install command for this project
- `outputDirectory`: any - The output directory of the project
- `rootDirectory`: any - The directory or relative path to the source code
- `nodeVersion`: string - Node.js version
- `serverlessFunctionRegion`: any - The region to deploy Serverless Functions
- `publicSource`: boolean,null - Whether source code and logs should be public
- `serverlessFunctionZeroConfigFailover`: boolean - Enable Zero Config Failover
- `enableAffectedProjectsDeployments`: boolean - Skip deployments when no changes to root directory
- `autoExposeSystemEnvs`: boolean - Auto expose system environment variables
- `autoAssignCustomDomains`: boolean - Auto assign custom domains
- `customerSupportCodeVisibility`: boolean - Allow customer support to see git source
- `directoryListing`: boolean - Enable directory listing
- `gitForkProtection`: boolean - Require authorization for Git fork PRs
- `gitLFS`: boolean - Enable Git LFS
- `previewDeploymentsDisabled`: boolean,null - Disable preview deployments
- `sourceFilesOutsideRootDirectory`: boolean - Allow source files outside root directory
- `enablePreviewFeedback`: boolean,null - Enable preview toolbar
- `enableProductionFeedback`: boolean,null - Enable production toolbar
- `skewProtectionBoundaryAt`: number - Skew Protection boundary timestamp
- `skewProtectionMaxAge`: number - Skew Protection max age in seconds
- `oidcTokenConfig`: object - OpenID Connect token configuration
- `passwordProtection`: any - Password protection settings
- `ssoProtection`: any - SSO protection settings
- `trustedIps`: any - Trusted IPs configuration
- `optionsAllowlist`: any - Options allowlist configuration
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 6. `list_deployments`

List deployments for a project

**Parameters:**
- `projectId`: string - Filter deployments from the given project ID
- `app`: string - Name of the deployment
- `limit`: number - Maximum number of deployments to list
- `since`: number - Get deployments created after this timestamp
- `until`: number - Get deployments created before this timestamp
- `state`: string - Filter by deployment state (BUILDING, ERROR, INITIALIZING, QUEUED, READY, CANCELED)
- `target`: string - Filter deployments based on environment
- `users`: string - Filter deployments by user IDs (comma-separated)
- `rollbackCandidate`: boolean - Filter deployments based on rollback candidacy
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 7. `add_domain`

Add a domain to a project

**Parameters:**
- `idOrName` *(required)*: string - Project ID or name
- `domain` *(required)*: string - Domain name to add
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 8. `remove_domain`

Remove a domain from a project

**Parameters:**
- `idOrName` *(required)*: string - Project ID or name
- `domain` *(required)*: string - Domain name to remove
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 9. `get_domain`

Get domain information

**Parameters:**
- `idOrName` *(required)*: string - Project ID or name
- `domain` *(required)*: string - Domain name
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 10. `list_domains`

List all domains for a project

**Parameters:**
- `idOrName` *(required)*: string - Project ID or name
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 11. `add_env`

Add environment variables to a project

**Parameters:**
- `idOrName` *(required)*: string - Project ID or name
- `env` *(required)*: array - Environment variables to add
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 12. `update_env`

Update an environment variable

**Parameters:**
- `idOrName` *(required)*: string - Project ID or name
- `envId` *(required)*: string - Environment variable ID
- `value` *(required)*: string - New value
- `type`: string - Environment type
- `target`: array - Deployment targets
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 13. `delete_env`

Delete an environment variable

**Parameters:**
- `idOrName` *(required)*: string - Project ID or name
- `envId` *(required)*: string - Environment variable ID
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 14. `get_env`

Get an environment variable

**Parameters:**
- `idOrName` *(required)*: string - Project ID or name
- `envId` *(required)*: string - Environment variable ID
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 15. `list_env`

List all environment variables

**Parameters:**
- `idOrName` *(required)*: string - Project ID or name
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 16. `promote_deployment`

Promote a deployment

**Parameters:**
- `projectId` *(required)*: string - Project ID
- `deploymentId` *(required)*: string - Deployment ID to promote
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 17. `get_promotion_aliases`

Get promotion aliases

**Parameters:**
- `projectId` *(required)*: string - Project ID
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 18. `pause_project`

Pause a project

**Parameters:**
- `projectId` *(required)*: string - Project ID
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 19. `request_project_transfer`

Request project transfer

**Parameters:**
- `idOrName` *(required)*: string - Project ID or name
- `teamId` *(required)*: string - Team ID to transfer to

#### 20. `accept_project_transfer`

Accept project transfer request

**Parameters:**
- `code` *(required)*: string - Transfer request code

#### 21. `create_deployment`

Create a new deployment with all required data

**Parameters:**
- `name` *(required)*: string - Project name used in the deployment URL
- `project`: string - Target project identifier (overrides name)
- `files`: array - Files to be deployed
- `gitMetadata`: object - Git metadata for the deployment
- `gitSource`: object - Git repository source
- `target`: string - Deployment target (production, preview, staging)
- `deploymentId`: string - Existing deployment ID to redeploy
- `meta`: object - Deployment metadata
- `projectSettings`: object - Project settings for the deployment
- `forceNew`: boolean - Force new deployment even if similar exists
- `skipAutoDetectionConfirmation`: boolean - Skip framework detection confirmation
- `customEnvironmentSlugOrId`: string - Custom environment to deploy to
- `monorepoManager`: string,null - Monorepo manager being used
- `withLatestCommit`: boolean - Force latest commit when redeploying
- `teamId`: string - Team identifier to perform the request on behalf of
- `slug`: string - Team slug to perform the request on behalf of

#### 22. `cancel_deployment`

Cancel a deployment which is currently building

**Parameters:**
- `id` *(required)*: string - The unique identifier of the deployment
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 23. `get_deployment`

Get deployment by ID or URL

**Parameters:**
- `idOrUrl` *(required)*: string - The unique identifier or hostname of the deployment
- `withGitRepoInfo`: string - Whether to add gitRepo information
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 24. `delete_deployment`

Delete a deployment by ID or URL

**Parameters:**
- `id` *(required)*: string - The unique identifier of the deployment
- `url`: string - A Deployment or Alias URL (overrides ID if provided)
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 25. `get_deployment_events`

Get build logs and events for a deployment

**Parameters:**
- `idOrUrl` *(required)*: string - The unique identifier or hostname of the deployment
- `direction`: string - Order of the returned events based on timestamp
- `follow`: number - Return live events as they happen (1 to enable)
- `limit`: number - Maximum number of events to return (-1 for all)
- `name`: string - Deployment build ID
- `since`: number - Timestamp to start pulling logs from
- `until`: number - Timestamp to pull logs until
- `statusCode`: string - HTTP status code range to filter events by (e.g. '5xx')
- `delimiter`: number - Delimiter option
- `builds`: number - Builds option
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 26. `update_deployment_integration`

Update deployment integration action status

**Parameters:**
- `deploymentId` *(required)*: string - The deployment ID
- `integrationConfigurationId` *(required)*: string - The integration configuration ID
- `resourceId` *(required)*: string - The resource ID
- `action` *(required)*: string - The action to update
- `status` *(required)*: string - The status of the action
- `statusText`: string - Additional status text
- `outcomes`: array - Action outcomes
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 27. `list_deployment_files`

Get file structure of a deployment's source code

**Parameters:**
- `id` *(required)*: string - The unique deployment identifier
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 28. `upload_deployment_files`

Upload files required for deployment

**Parameters:**
- `content` *(required)*: string - The file content to upload
- `size` *(required)*: number - The file size in bytes
- `digest` *(required)*: string - The file SHA1 for integrity check
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 29. `get_deployment_file`

Get contents of a specific deployment file

**Parameters:**
- `id` *(required)*: string - The unique deployment identifier
- `fileId` *(required)*: string - The unique file identifier
- `path`: string - Path to the file (only for Git deployments)
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 30. `list_deployment`

List deployments under the authenticated user or team

**Parameters:**
- `app`: string - Name of the deployment
- `from`: number - Get deployments created after this timestamp (deprecated)
- `limit`: number - Maximum number of deployments to list
- `projectId`: string - Filter deployments from the given ID or name
- `target`: string - Filter deployments based on the environment
- `to`: number - Get deployments created before this timestamp (deprecated)
- `users`: string - Filter deployments based on users who created them
- `since`: number - Get deployments created after this timestamp
- `until`: number - Get deployments created before this timestamp
- `state`: string - Filter by state (BUILDING, ERROR, INITIALIZING, QUEUED, READY, CANCELED)
- `rollbackCandidate`: boolean - Filter deployments based on rollback candidacy
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 31. `create_edge_config`

Create a new Edge Config

**Parameters:**
- `slug` *(required)*: string - Edge Config slug
- `items`: object - Initial items

#### 32. `create_edge_config_token`

Create a new Edge Config Token

**Parameters:**
- `edgeConfigId` *(required)*: string - Edge Config ID
- `label` *(required)*: string - Token label

#### 33. `list_edge_configs`

List all Edge Configs

**Parameters:**

#### 34. `get_edge_config`

Get an Edge Config

**Parameters:**
- `edgeConfigId` *(required)*: string - Edge Config ID

#### 35. `update_edge_config`

Update an Edge Config

**Parameters:**
- `edgeConfigId` *(required)*: string - Edge Config ID
- `slug` *(required)*: string - New slug

#### 36. `delete_edge_config`

Delete an Edge Config

**Parameters:**
- `edgeConfigId` *(required)*: string - Edge Config ID

#### 37. `list_edge_config_items`

List Edge Config Items

**Parameters:**
- `edgeConfigId` *(required)*: string - Edge Config ID

#### 38. `get_edge_config_item`

Get an Edge Config Item

**Parameters:**
- `edgeConfigId` *(required)*: string - Edge Config ID
- `itemKey` *(required)*: string - Item key

#### 39. `update_edge_config_items`

Update Edge Config Items

**Parameters:**
- `edgeConfigId` *(required)*: string - Edge Config ID
- `items` *(required)*: array - Items to update
- `definition`: any - Schema definition

#### 40. `get_edge_config_schema`

Get Edge Config Schema

**Parameters:**
- `edgeConfigId` *(required)*: string - Edge Config ID

#### 41. `update_edge_config_schema`

Update Edge Config Schema

**Parameters:**
- `edgeConfigId` *(required)*: string - Edge Config ID
- `definition`: any - Schema definition

#### 42. `delete_edge_config_schema`

Delete Edge Config Schema

**Parameters:**
- `edgeConfigId` *(required)*: string - Edge Config ID

#### 43. `list_edge_config_tokens`

List Edge Config Tokens

**Parameters:**
- `edgeConfigId` *(required)*: string - Edge Config ID

#### 44. `get_edge_config_token`

Get Edge Config Token

**Parameters:**
- `edgeConfigId` *(required)*: string - Edge Config ID
- `token` *(required)*: string - Token value

#### 45. `delete_edge_config_tokens`

Delete Edge Config Tokens

**Parameters:**
- `edgeConfigId` *(required)*: string - Edge Config ID
- `tokens` *(required)*: array - Tokens to delete

#### 46. `list_edge_config_backups`

List Edge Config Backups

**Parameters:**
- `edgeConfigId` *(required)*: string - Edge Config ID
- `limit`: number - Number of backups to return
- `next`: string - Next page token

#### 47. `get_edge_config_backup`

Get Edge Config Backup

**Parameters:**
- `edgeConfigId` *(required)*: string - Edge Config ID
- `backupId` *(required)*: string - Backup version ID

#### 48. `create_secret`

Create a new secret

**Parameters:**
- `name` *(required)*: string - The name of the secret (max 100 characters)
- `value` *(required)*: string - The value of the new secret
- `decryptable`: boolean - Whether the secret value can be decrypted after creation
- `projectId`: string - Associate a secret to a project
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 49. `update_secret_name`

Change the name of a secret

**Parameters:**
- `currentName` *(required)*: string - The current name of the secret
- `newName` *(required)*: string - The new name for the secret
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 50. `delete_secret`

Delete a secret

**Parameters:**
- `idOrName` *(required)*: string - The name or unique identifier of the secret
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 51. `get_secret`

Get information for a specific secret

**Parameters:**
- `idOrName` *(required)*: string - The name or unique identifier of the secret
- `decrypt`: string - Whether to try to decrypt the value of the secret
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 52. `list_secrets`

List all secrets

**Parameters:**
- `id`: string - Filter by comma separated secret ids
- `projectId`: string - Filter by project ID
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 53. `create_environment`

Create a custom environment for a project

**Parameters:**
- `idOrName` *(required)*: string - Project ID or name
- `slug` *(required)*: string - Environment slug
- `description`: string - Environment description
- `branchMatcher`: object - Branch matching configuration
- `copyEnvVarsFrom`: string - Copy environment variables from this environment
- `teamId`: string - The Team identifier to perform the request on behalf of
- `teamSlug`: string - The Team slug to perform the request on behalf of

#### 54. `delete_environment`

Remove a custom environment from a project

**Parameters:**
- `idOrName` *(required)*: string - Project ID or name
- `environmentSlugOrId` *(required)*: string - Environment slug or ID
- `deleteUnassignedEnvVars`: boolean - Delete unassigned environment variables
- `teamId`: string - The Team identifier to perform the request on behalf of
- `teamSlug`: string - The Team slug to perform the request on behalf of

#### 55. `get_environment`

Retrieve a custom environment

**Parameters:**
- `idOrName` *(required)*: string - Project ID or name
- `environmentSlugOrId` *(required)*: string - Environment slug or ID
- `teamId`: string - The Team identifier to perform the request on behalf of
- `teamSlug`: string - The Team slug to perform the request on behalf of

#### 56. `list_environments`

List custom environments for a project

**Parameters:**
- `idOrName` *(required)*: string - Project ID or name
- `gitBranch`: string - Filter by git branch
- `teamId`: string - The Team identifier to perform the request on behalf of
- `teamSlug`: string - The Team slug to perform the request on behalf of

#### 57. `update_environment`

Update a custom environment

**Parameters:**
- `idOrName` *(required)*: string - Project ID or name
- `environmentSlugOrId` *(required)*: string - Environment slug or ID
- `slug`: string - New environment slug
- `description`: string - New environment description
- `branchMatcher`: any - New branch matching configuration
- `teamId`: string - The Team identifier to perform the request on behalf of
- `teamSlug`: string - The Team slug to perform the request on behalf of

#### 58. `create_webhook`

Creates a webhook

**Parameters:**
- `url` *(required)*: string - The webhook URL
- `events` *(required)*: array - Events to subscribe to
- `projectIds` *(required)*: array - Project IDs to watch
- `teamId`: string - Team ID to perform the request on behalf of
- `slug`: string - Team slug to perform the request on behalf of

#### 59. `delete_webhook`

Deletes a webhook

**Parameters:**
- `id` *(required)*: string - Webhook ID to delete
- `teamId`: string - Team ID to perform the request on behalf of
- `slug`: string - Team slug to perform the request on behalf of

#### 60. `list_webhooks`

Get a list of webhooks

**Parameters:**
- `projectId`: string - Filter by project ID
- `teamId`: string - Team ID to perform the request on behalf of
- `slug`: string - Team slug to perform the request on behalf of

#### 61. `get_webhook`

Get a webhook

**Parameters:**
- `id` *(required)*: string - Webhook ID
- `teamId`: string - Team ID to perform the request on behalf of
- `slug`: string - Team slug to perform the request on behalf of

#### 62. `logdrain_create`

Creates a configurable log drain

**Parameters:**
- `deliveryFormat` *(required)*: string - The delivery log format
- `url` *(required)*: string - The log drain url
- `headers`: object - Headers to be sent together with the request
- `projectIds` *(required)*: array - Project IDs to watch
- `sources` *(required)*: array - Sources to watch
- `environments` *(required)*: array - Environments to watch
- `secret`: string - Custom secret of log drain
- `samplingRate`: number - The sampling rate for this log drain
- `name`: string - The custom name of this log drain
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 63. `logdrain_create_integration`

Creates an integration log drain

**Parameters:**
- `name` *(required)*: string - The name of the log drain
- `projectIds`: array - Project IDs to watch
- `secret`: string - Secret to sign log drain notifications
- `deliveryFormat` *(required)*: string - The delivery log format
- `url` *(required)*: string - The url where you will receive logs
- `sources`: array - Sources to watch
- `headers`: object - Headers to be sent together with the request
- `environments`: array - Environments to watch
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 64. `logdrain_delete`

Deletes a configurable log drain

**Parameters:**
- `id` *(required)*: string - The log drain ID to delete
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 65. `logdrain_delete_integration`

Deletes an integration log drain

**Parameters:**
- `id` *(required)*: string - ID of the log drain to be deleted
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 66. `logdrain_get`

Retrieves a configurable log drain

**Parameters:**
- `id` *(required)*: string - The log drain ID
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 67. `logdrain_list`

Retrieves a list of all log drains

**Parameters:**
- `projectId`: string - Filter by project ID
- `projectIdOrName`: string - Filter by project ID or name
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 68. `logdrain_list_integration`

Retrieves a list of integration log drains

**Parameters:**
- `teamId`: string - The Team identifier to perform the request on behalf of
- `slug`: string - The Team slug to perform the request on behalf of

#### 69. `send_web_vitals`

Send web vitals data to Speed Insights API (Deprecated: Use @vercel/speed-insights package instead)

**Parameters:**
- `vitals` *(required)*: object - Web vitals data


### docker (27 tools)

Container management

#### 1. `list_containers`

List all Docker containers

**Parameters:**
- `all`: boolean - Show all containers (default shows just running)

#### 2. `list_images`

List all Docker images

**Parameters:**

#### 3. `run_container`

Run a Docker container

**Parameters:**
- `image` *(required)*: string - Docker image to run
- `name`: string - Name for the container
- `detach`: boolean - Run container in background
- `ports`: array - Port mappings (e.g. ["8080:80"])
- `volumes`: array - Volume mappings (e.g. ["/host/path:/container/path"])
- `env`: array - Environment variables (e.g. ["KEY=value"])
- `command`: string - Command to run in the container

#### 4. `stop_container`

Stop a running Docker container

**Parameters:**
- `container` *(required)*: string - Container ID or name

#### 5. `remove_container`

Remove a Docker container

**Parameters:**
- `container` *(required)*: string - Container ID or name
- `force`: boolean - Force removal of running container

#### 6. `pull_image`

Pull a Docker image from a registry

**Parameters:**
- `image` *(required)*: string - Image name (e.g. "nginx:latest")

#### 7. `compose_up`

Start Docker Compose services

**Parameters:**
- `file`: string - Path to docker-compose.yml file
- `projectName`: string - Specify project name
- `services`: array - Services to start (default: all services)
- `detach`: boolean - Run in background
- `build`: boolean - Build images before starting containers
- `removeOrphans`: boolean - Remove containers for services not defined in the Compose file

#### 8. `compose_down`

Stop and remove Docker Compose services

**Parameters:**
- `file`: string - Path to docker-compose.yml file
- `projectName`: string - Specify project name
- `volumes`: boolean - Remove named volumes declared in the volumes section
- `removeOrphans`: boolean - Remove containers for services not defined in the Compose file

#### 9. `compose_ps`

List Docker Compose services

**Parameters:**
- `file`: string - Path to docker-compose.yml file
- `projectName`: string - Specify project name
- `services`: array - Services to show (default: all services)

#### 10. `compose_logs`

View Docker Compose service logs

**Parameters:**
- `file`: string - Path to docker-compose.yml file
- `projectName`: string - Specify project name
- `services`: array - Services to show logs for (default: all services)
- `follow`: boolean - Follow log output
- `tail`: string - Number of lines to show from the end of the logs (e.g. "100")

#### 11. `compose_build`

Build Docker Compose services

**Parameters:**
- `file`: string - Path to docker-compose.yml file
- `projectName`: string - Specify project name
- `services`: array - Services to build (default: all services)
- `noCache`: boolean - Do not use cache when building the image
- `pull`: boolean - Always attempt to pull a newer version of the image

#### 12. `inspect_container`

Show detailed information about a container

**Parameters:**
- `container` *(required)*: string - Container ID or name
- `format`: string - Format the output using a Go template

#### 13. `container_logs`

Fetch the logs of a container

**Parameters:**
- `container` *(required)*: string - Container ID or name
- `tail`: string - Number of lines to show from the end of the logs (e.g. "100")
- `since`: string - Show logs since timestamp (e.g. "2021-01-02T13:23:37") or relative (e.g. "42m" for 42 minutes)
- `until`: string - Show logs before timestamp (e.g. "2021-01-02T13:23:37") or relative (e.g. "42m" for 42 minutes)
- `timestamps`: boolean - Show timestamps

#### 14. `exec_container`

Execute a command in a running container

**Parameters:**
- `container` *(required)*: string - Container ID or name
- `command` *(required)*: string - Command to execute
- `interactive`: boolean - Keep STDIN open even if not attached

#### 15. `container_stats`

Display a live stream of container resource usage statistics

**Parameters:**
- `container` *(required)*: string - Container ID or name
- `noStream`: boolean - Disable streaming stats and only pull the first result

#### 16. `build_image`

Build an image from a Dockerfile

**Parameters:**
- `dockerfile`: string - Path to Dockerfile
- `tag` *(required)*: string - Name and optionally a tag in the name:tag format
- `context` *(required)*: string - Path to the build context
- `buildArgs`: object - Build-time variables
- `noCache`: boolean - Do not use cache when building the image
- `pull`: boolean - Always attempt to pull a newer version of the image

#### 17. `prune_images`

Remove unused images

**Parameters:**
- `all`: boolean - Remove all unused images, not just dangling ones
- `filter`: string - Provide filter values (e.g. "until=24h")

#### 18. `list_networks`

List all Docker networks

**Parameters:**

#### 19. `create_network`

Create a new Docker network

**Parameters:**
- `name` *(required)*: string - Network name
- `driver`: string - Driver to manage the network (default "bridge")
- `subnet`: string - Subnet in CIDR format (e.g. "172.30.0.0/16")
- `gateway`: string - Gateway for the subnet
- `internal`: boolean - Restrict external access to the network

#### 20. `remove_network`

Remove a Docker network

**Parameters:**
- `name` *(required)*: string - Network name or ID

#### 21. `network_connect`

Connect a container to a network

**Parameters:**
- `network` *(required)*: string - Network name or ID
- `container` *(required)*: string - Container ID or name
- `alias`: array - Add network-scoped alias for the container

#### 22. `list_volumes`

List all Docker volumes

**Parameters:**

#### 23. `create_volume`

Create a Docker volume

**Parameters:**
- `name` *(required)*: string - Volume name
- `driver`: string - Volume driver name (default "local")
- `labels`: object - Labels to set on the volume

#### 24. `remove_volume`

Remove a Docker volume

**Parameters:**
- `name` *(required)*: string - Volume name

#### 25. `system_info`

Display system-wide information

**Parameters:**
- `format`: string - Format the output using a Go template

#### 26. `system_df`

Show Docker disk usage

**Parameters:**
- `verbose`: boolean - Show detailed information on space usage

#### 27. `security_scan`

Scan a Docker image for vulnerabilities

**Parameters:**
- `image` *(required)*: string - Image to scan (e.g. "nginx:latest")
- `verbose`: boolean - Show detailed vulnerability information


### supabase (26 tools)

Database & Auth

#### 1. `list_organizations`

Lists all organizations that the user is a member of.

**Parameters:**

#### 2. `get_organization`

Gets details for an organization. Includes subscription plan.

**Parameters:**
- `id` *(required)*: string - The organization ID

#### 3. `list_projects`

Lists all Supabase projects for the user. Use this to help discover the project ID of the project that the user is working on.

**Parameters:**

#### 4. `get_project`

Gets details for a Supabase project.

**Parameters:**
- `id` *(required)*: string - The project ID

#### 5. `get_cost`

Gets the cost of creating a new project or branch. Never assume organization as costs can be different for each.

**Parameters:**
- `type` *(required)*: string
- `organization_id` *(required)*: string - The organization ID. Always ask the user.

#### 6. `confirm_cost`

Ask the user to confirm their understanding of the cost of creating a new project or branch. Call `get_cost` first. Returns a unique ID for this confirmation which should be passed to `create_project` or `create_branch`.

**Parameters:**
- `type` *(required)*: string
- `recurrence` *(required)*: string
- `amount` *(required)*: number

#### 7. `create_project`

Creates a new Supabase project. Always ask the user which organization to create the project in. The project can take a few minutes to initialize - use `get_project` to check the status.

**Parameters:**
- `name` *(required)*: string - The name of the project
- `region`: string - The region to create the project in. Defaults to the closest region.
- `organization_id` *(required)*: string
- `confirm_cost_id` *(required)*: string - The cost confirmation ID. Call `confirm_cost` first.

#### 8. `pause_project`

Pauses a Supabase project.

**Parameters:**
- `project_id` *(required)*: string

#### 9. `restore_project`

Restores a Supabase project.

**Parameters:**
- `project_id` *(required)*: string

#### 10. `list_tables`

Lists all tables in one or more schemas.

**Parameters:**
- `project_id` *(required)*: string
- `schemas`: array - List of schemas to include. Defaults to all schemas.

#### 11. `list_extensions`

Lists all extensions in the database.

**Parameters:**
- `project_id` *(required)*: string

#### 12. `list_migrations`

Lists all migrations in the database.

**Parameters:**
- `project_id` *(required)*: string

#### 13. `apply_migration`

Applies a migration to the database. Use this when executing DDL operations. Do not hardcode references to generated IDs in data migrations.

**Parameters:**
- `project_id` *(required)*: string
- `name` *(required)*: string - The name of the migration in snake_case
- `query` *(required)*: string - The SQL query to apply

#### 14. `execute_sql`

Executes raw SQL in the Postgres database. Use `apply_migration` instead for DDL operations.

**Parameters:**
- `project_id` *(required)*: string
- `query` *(required)*: string - The SQL query to execute

#### 15. `list_edge_functions`

Lists all Edge Functions in a Supabase project.

**Parameters:**
- `project_id` *(required)*: string

#### 16. `deploy_edge_function`

Deploys an Edge Function to a Supabase project. If the function already exists, this will create a new version. Example:

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req: Request) => {
  const data = {
    message: "Hello there!"
  };
  
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Connection': 'keep-alive'
    }
  });
});

**Parameters:**
- `project_id` *(required)*: string
- `name` *(required)*: string - The name of the function
- `entrypoint_path`: string - The entrypoint of the function
- `import_map_path`: string - The import map for the function.
- `files` *(required)*: array - The files to upload. This should include the entrypoint and any relative dependencies.

#### 17. `get_logs`

Gets logs for a Supabase project by service type. Use this to help debug problems with your app. This will only return logs within the last minute. If the logs you are looking for are older than 1 minute, re-run your test to reproduce them.

**Parameters:**
- `project_id` *(required)*: string
- `service` *(required)*: string - The service to fetch logs for

#### 18. `get_project_url`

Gets the API URL for a project.

**Parameters:**
- `project_id` *(required)*: string

#### 19. `get_anon_key`

Gets the anonymous API key for a project.

**Parameters:**
- `project_id` *(required)*: string

#### 20. `generate_typescript_types`

Generates TypeScript types for a project.

**Parameters:**
- `project_id` *(required)*: string

#### 21. `create_branch`

Creates a development branch on a Supabase project. This will apply all migrations from the main project to a fresh branch database. Note that production data will not carry over. The branch will get its own project_id via the resulting project_ref. Use this ID to execute queries and migrations on the branch.

**Parameters:**
- `project_id` *(required)*: string
- `name`: string - Name of the branch to create
- `confirm_cost_id` *(required)*: string - The cost confirmation ID. Call `confirm_cost` first.

#### 22. `list_branches`

Lists all development branches of a Supabase project. This will return branch details including status which you can use to check when operations like merge/rebase/reset complete.

**Parameters:**
- `project_id` *(required)*: string

#### 23. `delete_branch`

Deletes a development branch.

**Parameters:**
- `branch_id` *(required)*: string

#### 24. `merge_branch`

Merges migrations and edge functions from a development branch to production.

**Parameters:**
- `branch_id` *(required)*: string

#### 25. `reset_branch`

Resets migrations of a development branch. Any untracked data or schema changes will be lost.

**Parameters:**
- `branch_id` *(required)*: string
- `migration_version`: string - Reset your development branch to a specific migration version.

#### 26. `rebase_branch`

Rebases a development branch on production. This will effectively run any newer migrations from production onto this branch to help handle migration drift.

**Parameters:**
- `branch_id` *(required)*: string


### taskmaster-ai (25 tools)

AI-powered task management

#### 1. `initialize_project`

Initializes a new Task Master project structure by calling the core initialization logic. Creates necessary folders and configuration files for Task Master in the current directory.

**Parameters:**
- `skipInstall`: boolean - Skip installing dependencies automatically. Never do this unless you are sure the project is already installed.
- `addAliases`: boolean - Add shell aliases (tm, taskmaster) to shell config file.
- `yes`: boolean - Skip prompts and use default values. Always set to true for MCP tools.
- `projectRoot` *(required)*: string - The root directory for the project. ALWAYS SET THIS TO THE PROJECT ROOT DIRECTORY. IF NOT SET, THE TOOL WILL NOT WORK.

#### 2. `get_task`

Get detailed information about a specific task

**Parameters:**
- `id` *(required)*: string - Task ID to get
- `status`: string - Filter subtasks by status (e.g., 'pending', 'done')
- `file`: string - Path to the tasks file relative to project root
- `complexityReport`: string - Path to the complexity report file (relative to project root or absolute)
- `projectRoot`: string - Absolute path to the project root directory (Optional, usually from session)

#### 3. `next_task`

Find the next task to work on based on dependencies and status

**Parameters:**
- `file`: string - Absolute path to the tasks file
- `complexityReport`: string - Path to the complexity report file (relative to project root or absolute)
- `projectRoot` *(required)*: string - The directory of the project. Must be an absolute path.

#### 4. `get_tasks`

Get all tasks from Task Master, optionally filtering by status and including subtasks.

**Parameters:**
- `status`: string - Filter tasks by status (e.g., 'pending', 'done')
- `withSubtasks`: boolean - Include subtasks nested within their parent tasks in the response
- `file`: string - Path to the tasks file (relative to project root or absolute)
- `complexityReport`: string - Path to the complexity report file (relative to project root or absolute)
- `projectRoot` *(required)*: string - The directory of the project. Must be an absolute path.

#### 5. `set_task_status`

Set the status of one or more tasks or subtasks.

**Parameters:**
- `id` *(required)*: string - Task ID or subtask ID (e.g., '15', '15.2'). Can be comma-separated to update multiple tasks/subtasks at once.
- `status` *(required)*: string - New status to set (e.g., 'pending', 'done', 'in-progress', 'review', 'deferred', 'cancelled'.
- `file`: string - Absolute path to the tasks file
- `complexityReport`: string - Path to the complexity report file (relative to project root or absolute)
- `projectRoot` *(required)*: string - The directory of the project. Must be an absolute path.

#### 6. `parse_prd`

Parse a Product Requirements Document (PRD) text file to automatically generate initial tasks. Reinitializing the project is not necessary to run this tool. It is recommended to run parse-prd after initializing the project and creating/importing a prd.txt file in the project root's .taskmaster/docs directory.

**Parameters:**
- `input`: string - Absolute path to the PRD document file (.txt, .md, etc.)
- `projectRoot`: string - The directory of the project. Must be an absolute path.
- `output`: string - Output path for tasks.json file (default: .taskmaster/tasks/tasks.json)
- `numTasks`: string - Approximate number of top-level tasks to generate (default: 10). As the agent, if you have enough information, ensure to enter a number of tasks that would logically scale with project complexity. Avoid entering numbers above 50 due to context window limitations.
- `force`: boolean - Overwrite existing output file without prompting.
- `research`: boolean - Enable Taskmaster to use the research role for potentially more informed task generation. Requires appropriate API key.
- `append`: boolean - Append generated tasks to existing file.

#### 7. `update_task`

Updates a single task by ID with new information or context provided in the prompt.

**Parameters:**
- `id` *(required)*: string - ID of the task (e.g., '15') to update. Subtasks are supported using the update-subtask tool.
- `prompt` *(required)*: string - New information or context to incorporate into the task
- `research`: boolean - Use Perplexity AI for research-backed updates
- `file`: string - Absolute path to the tasks file
- `projectRoot` *(required)*: string - The directory of the project. Must be an absolute path.

#### 8. `update_subtask`

Appends timestamped information to a specific subtask without replacing existing content. If you just want to update the subtask status, use set_task_status instead.

**Parameters:**
- `id` *(required)*: string - ID of the subtask to update in format "parentId.subtaskId" (e.g., "5.2"). Parent ID is the ID of the task that contains the subtask.
- `prompt` *(required)*: string - Information to add to the subtask
- `research`: boolean - Use Perplexity AI for research-backed updates
- `file`: string - Absolute path to the tasks file
- `projectRoot` *(required)*: string - The directory of the project. Must be an absolute path.

#### 9. `update`

Update multiple upcoming tasks (with ID >= 'from' ID) based on new context or changes provided in the prompt. Use 'update_task' instead for a single specific task or 'update_subtask' for subtasks.

**Parameters:**
- `from` *(required)*: string - Task ID from which to start updating (inclusive). IMPORTANT: This tool uses 'from', not 'id'
- `prompt` *(required)*: string - Explanation of changes or new context to apply
- `research`: boolean - Use Perplexity AI for research-backed updates
- `file`: string - Path to the tasks file relative to project root
- `projectRoot`: string - The directory of the project. (Optional, usually from session)

#### 10. `generate`

Generates individual task files in tasks/ directory based on tasks.json

**Parameters:**
- `file`: string - Absolute path to the tasks file
- `output`: string - Output directory (default: same directory as tasks file)
- `projectRoot` *(required)*: string - The directory of the project. Must be an absolute path.

#### 11. `add_task`

Add a new task using AI

**Parameters:**
- `prompt`: string - Description of the task to add (required if not using manual fields)
- `title`: string - Task title (for manual task creation)
- `description`: string - Task description (for manual task creation)
- `details`: string - Implementation details (for manual task creation)
- `testStrategy`: string - Test strategy (for manual task creation)
- `dependencies`: string - Comma-separated list of task IDs this task depends on
- `priority`: string - Task priority (high, medium, low)
- `file`: string - Path to the tasks file (default: tasks/tasks.json)
- `projectRoot` *(required)*: string - The directory of the project. Must be an absolute path.
- `research`: boolean - Whether to use research capabilities for task creation

#### 12. `add_subtask`

Add a subtask to an existing task

**Parameters:**
- `id` *(required)*: string - Parent task ID (required)
- `taskId`: string - Existing task ID to convert to subtask
- `title`: string - Title for the new subtask (when creating a new subtask)
- `description`: string - Description for the new subtask
- `details`: string - Implementation details for the new subtask
- `status`: string - Status for the new subtask (default: 'pending')
- `dependencies`: string - Comma-separated list of dependency IDs for the new subtask
- `file`: string - Absolute path to the tasks file (default: tasks/tasks.json)
- `skipGenerate`: boolean - Skip regenerating task files
- `projectRoot` *(required)*: string - The directory of the project. Must be an absolute path.

#### 13. `remove_subtask`

Remove a subtask from its parent task

**Parameters:**
- `id` *(required)*: string - Subtask ID to remove in format 'parentId.subtaskId' (required)
- `convert`: boolean - Convert the subtask to a standalone task instead of deleting it
- `file`: string - Absolute path to the tasks file (default: tasks/tasks.json)
- `skipGenerate`: boolean - Skip regenerating task files
- `projectRoot` *(required)*: string - The directory of the project. Must be an absolute path.

#### 14. `expand_task`

Expand a task into subtasks for detailed implementation

**Parameters:**
- `id` *(required)*: string - ID of task to expand
- `num`: string - Number of subtasks to generate
- `research`: boolean - Use research role for generation
- `prompt`: string - Additional context for subtask generation
- `file`: string - Path to the tasks file relative to project root (e.g., tasks/tasks.json)
- `projectRoot` *(required)*: string - The directory of the project. Must be an absolute path.
- `force`: boolean - Force expansion even if subtasks exist

#### 15. `analyze_project_complexity`

Analyze task complexity and generate expansion recommendations.

**Parameters:**
- `threshold`: integer - Complexity score threshold (1-10) to recommend expansion.
- `research`: boolean - Use Perplexity AI for research-backed analysis.
- `output`: string - Output file path relative to project root (default: .taskmaster/reports/task-complexity-report.json).
- `file`: string - Path to the tasks file relative to project root (default: tasks/tasks.json).
- `ids`: string - Comma-separated list of task IDs to analyze specifically (e.g., "1,3,5").
- `from`: integer - Starting task ID in a range to analyze.
- `to`: integer - Ending task ID in a range to analyze.
- `projectRoot` *(required)*: string - The directory of the project. Must be an absolute path.

#### 16. `remove_dependency`

Remove a dependency from a task

**Parameters:**
- `id` *(required)*: string - Task ID to remove dependency from
- `dependsOn` *(required)*: string - Task ID to remove as a dependency
- `file`: string - Absolute path to the tasks file (default: tasks/tasks.json)
- `projectRoot` *(required)*: string - The directory of the project. Must be an absolute path.

#### 17. `clear_subtasks`

Clear subtasks from specified tasks

**Parameters:**
- `id`: string - Task IDs (comma-separated) to clear subtasks from
- `all`: boolean - Clear subtasks from all tasks
- `file`: string - Absolute path to the tasks file (default: tasks/tasks.json)
- `projectRoot` *(required)*: string - The directory of the project. Must be an absolute path.

#### 18. `expand_all`

Expand all pending tasks into subtasks based on complexity or defaults

**Parameters:**
- `num`: string - Target number of subtasks per task (uses complexity/defaults otherwise)
- `research`: boolean - Enable research-backed subtask generation (e.g., using Perplexity)
- `prompt`: string - Additional context to guide subtask generation for all tasks
- `force`: boolean - Force regeneration of subtasks for tasks that already have them
- `file`: string - Absolute path to the tasks file in the /tasks folder inside the project root (default: tasks/tasks.json)
- `projectRoot`: string - Absolute path to the project root directory (derived from session if possible)

#### 19. `validate_dependencies`

Check tasks for dependency issues (like circular references or links to non-existent tasks) without making changes.

**Parameters:**
- `file`: string - Absolute path to the tasks file
- `projectRoot` *(required)*: string - The directory of the project. Must be an absolute path.

#### 20. `fix_dependencies`

Fix invalid dependencies in tasks automatically

**Parameters:**
- `file`: string - Absolute path to the tasks file
- `projectRoot` *(required)*: string - The directory of the project. Must be an absolute path.

#### 21. `remove_task`

Remove a task or subtask permanently from the tasks list

**Parameters:**
- `id` *(required)*: string - ID of the task or subtask to remove (e.g., '5' or '5.2'). Can be comma-separated to update multiple tasks/subtasks at once.
- `file`: string - Absolute path to the tasks file
- `projectRoot` *(required)*: string - The directory of the project. Must be an absolute path.
- `confirm`: boolean - Whether to skip confirmation prompt (default: false)

#### 22. `add_dependency`

Add a dependency relationship between two tasks

**Parameters:**
- `id` *(required)*: string - ID of task that will depend on another task
- `dependsOn` *(required)*: string - ID of task that will become a dependency
- `file`: string - Absolute path to the tasks file (default: tasks/tasks.json)
- `projectRoot` *(required)*: string - The directory of the project. Must be an absolute path.

#### 23. `models`

Get information about available AI models or set model configurations. Run without arguments to get the current model configuration and API key status for the selected model providers.

**Parameters:**
- `setMain`: string - Set the primary model for task generation/updates. Model provider API key is required in the MCP config ENV.
- `setResearch`: string - Set the model for research-backed operations. Model provider API key is required in the MCP config ENV.
- `setFallback`: string - Set the model to use if the primary fails. Model provider API key is required in the MCP config ENV.
- `listAvailableModels`: boolean - List all available models not currently in use. Input/output costs values are in dollars (3 is $3.00).
- `projectRoot`: string - The directory of the project. Must be an absolute path.
- `openrouter`: boolean - Indicates the set model ID is a custom OpenRouter model.
- `ollama`: boolean - Indicates the set model ID is a custom Ollama model.

#### 24. `complexity_report`

Display the complexity analysis report in a readable format

**Parameters:**
- `file`: string - Path to the report file (default: .taskmaster/reports/task-complexity-report.json)
- `projectRoot` *(required)*: string - The directory of the project. Must be an absolute path.

#### 25. `move_task`

Move a task or subtask to a new position

**Parameters:**
- `from` *(required)*: string - ID of the task/subtask to move (e.g., "5" or "5.2"). Can be comma-separated to move multiple tasks (e.g., "5,6,7")
- `to` *(required)*: string - ID of the destination (e.g., "7" or "7.3"). Must match the number of source IDs if comma-separated
- `file`: string - Custom path to tasks.json file
- `projectRoot`: string - Root directory of the project (typically derived from session)


### npm-sentinel (19 tools)

Node.js package management

#### 1. `npmVersions`

Get all available versions of an NPM package

**Parameters:**
- `packages` *(required)*: array - List of package names to get versions for

#### 2. `npmLatest`

Get the latest version and changelog of an NPM package

**Parameters:**
- `packages` *(required)*: array - List of package names to get latest versions for

#### 3. `npmDeps`

Analyze dependencies and devDependencies of an NPM package

**Parameters:**
- `packages` *(required)*: array - List of package names to analyze dependencies for

#### 4. `npmTypes`

Check TypeScript types availability and version for a package

**Parameters:**
- `packages` *(required)*: array - List of package names to check types for

#### 5. `npmSize`

Get package size information including dependencies and bundle size

**Parameters:**
- `packages` *(required)*: array - List of package names to get size information for

#### 6. `npmVulnerabilities`

Check for known vulnerabilities in packages

**Parameters:**
- `packages` *(required)*: array - List of package names to check for vulnerabilities

#### 7. `npmTrends`

Get download trends and popularity metrics for packages

**Parameters:**
- `packages` *(required)*: array - List of package names to get trends for
- `period`: string - Time period for trends. Options: "last-week", "last-month", "last-year"

#### 8. `npmCompare`

Compare multiple NPM packages based on various metrics

**Parameters:**
- `packages` *(required)*: array - List of package names to compare

#### 9. `npmMaintainers`

Get maintainers information for NPM packages

**Parameters:**
- `packages` *(required)*: array - List of package names to get maintainers for

#### 10. `npmScore`

Get consolidated package score based on quality, maintenance, and popularity metrics

**Parameters:**
- `packages` *(required)*: array - List of package names to get scores for

#### 11. `npmPackageReadme`

Get the README content for NPM packages

**Parameters:**
- `packages` *(required)*: array - List of package names to get READMEs for

#### 12. `npmSearch`

Search for NPM packages with optional limit

**Parameters:**
- `query` *(required)*: string - Search query for packages
- `limit`: number - Maximum number of results to return (default: 10)

#### 13. `npmLicenseCompatibility`

Check license compatibility between multiple packages

**Parameters:**
- `packages` *(required)*: array - List of package names to check for license compatibility

#### 14. `npmRepoStats`

Get repository statistics for NPM packages

**Parameters:**
- `packages` *(required)*: array - List of package names to get repository stats for

#### 15. `npmDeprecated`

Check if packages are deprecated

**Parameters:**
- `packages` *(required)*: array - List of package names to check for deprecation

#### 16. `npmChangelogAnalysis`

Analyze changelog and release history of packages

**Parameters:**
- `packages` *(required)*: array - List of package names to analyze changelogs for

#### 17. `npmAlternatives`

Find alternative packages with similar functionality

**Parameters:**
- `packages` *(required)*: array - List of package names to find alternatives for

#### 18. `npmQuality`

Analyze package quality metrics

**Parameters:**
- `packages` *(required)*: array - List of package names to analyze

#### 19. `npmMaintenance`

Analyze package maintenance metrics

**Parameters:**
- `packages` *(required)*: array - List of package names to analyze


## 🛠️ Tier 2 Services


### desktop-commander (18 tools)

Desktop automation

#### 1. `get_config`


                        Get the complete server configuration as JSON. Config includes fields for:
                        - blockedCommands (array of blocked shell commands)
                        - defaultShell (shell to use for commands)
                        - allowedDirectories (paths the server can access)
                        - fileReadLineLimit (max lines for read_file, default 1000)
                        - fileWriteLineLimit (max lines per write_file call, default 50)
                        - telemetryEnabled (boolean for telemetry opt-in/out)
                        -  version (version of the DesktopCommander)
                        This command can be referenced as "DC: ..." or "use Desktop Commander to ..." in your instructions.

**Parameters:**

#### 2. `set_config_value`


                        Set a specific configuration value by key.
                        
                        WARNING: Should be used in a separate chat from file operations and 
                        command execution to prevent security issues.
                        
                        Config keys include:
                        - blockedCommands (array)
                        - defaultShell (string)
                        - allowedDirectories (array of paths)
                        - fileReadLineLimit (number, max lines for read_file)
                        - fileWriteLineLimit (number, max lines per write_file call)
                        - telemetryEnabled (boolean)
                        
                        IMPORTANT: Setting allowedDirectories to an empty array ([]) allows full access 
                        to the entire file system, regardless of the operating system.
                        
                        This command can be referenced as "DC: ..." or "use Desktop Commander to ..." in your instructions.

**Parameters:**
- `key` *(required)*: string
- `value`: any

#### 3. `read_file`


                        Read the contents of a file from the file system or a URL with optional offset and length parameters.
                        
                        Prefer this over 'execute_command' with cat/type for viewing files.
                        
                        Supports partial file reading with:
                        - 'offset' (start line, default: 0)
                        - 'length' (max lines to read, default: configurable via 'fileReadLineLimit' setting, initially 1000)
                        
                        When reading from the file system, only works within allowed directories.
                        Can fetch content from URLs when isUrl parameter is set to true
                        (URLs are always read in full regardless of offset/length).
                        
                        Handles text files normally and image files are returned as viewable images.
                        Recognized image types: PNG, JPEG, GIF, WebP.
                        
                        IMPORTANT: Always use absolute paths (starting with '/' or drive letter like 'C:\') for reliability. Relative paths may fail as they depend on the current working directory. Tilde paths (~/...) might not work in all contexts. Unless the user explicitly asks for relative paths, use absolute paths.
                        This command can be referenced as "DC: ..." or "use Desktop Commander to ..." in your instructions.

**Parameters:**
- `path` *(required)*: string
- `isUrl`: boolean
- `offset`: number
- `length`: number

#### 4. `read_multiple_files`


                        Read the contents of multiple files simultaneously.
                        
                        Each file's content is returned with its path as a reference.
                        Handles text files normally and renders images as viewable content.
                        Recognized image types: PNG, JPEG, GIF, WebP.
                        
                        Failed reads for individual files won't stop the entire operation.
                        Only works within allowed directories.
                        
                        IMPORTANT: Always use absolute paths (starting with '/' or drive letter like 'C:\') for reliability. Relative paths may fail as they depend on the current working directory. Tilde paths (~/...) might not work in all contexts. Unless the user explicitly asks for relative paths, use absolute paths.
                        This command can be referenced as "DC: ..." or "use Desktop Commander to ..." in your instructions.

**Parameters:**
- `paths` *(required)*: array

#### 5. `write_file`


                        Write or append to file contents with a configurable line limit per call (default: 50 lines).
                        THIS IS A STRICT REQUIREMENT. ANY file with more than the configured limit MUST BE written in chunks or IT WILL FAIL.

                        ⚠️ IMPORTANT: PREVENTATIVE CHUNKING REQUIRED in these scenarios:
                        1. When content exceeds 2,000 words or 30 lines
                        2. When writing MULTIPLE files one after another (each next file is more likely to be truncated)
                        3. When the file is the LAST ONE in a series of operations in the same message
                        
                        ALWAYS split files writes in to multiple smaller writes PREEMPTIVELY without asking the user in these scenarios.
                        
                        REQUIRED PROCESS FOR LARGE NEW FILE WRITES OR REWRITES:
                        1. FIRST → write_file(filePath, firstChunk, {mode: 'rewrite'})
                        2. THEN → write_file(filePath, secondChunk, {mode: 'append'})
                        3. THEN → write_file(filePath, thirdChunk, {mode: 'append'})
                        ... and so on for each chunk
                        
                        HANDLING TRUNCATION ("Continue" prompts):
                        If user asked to "Continue" after unfinished file write:
                        1. First, read the file to find out what content was successfully written
                        2. Identify exactly where the content was truncated
                        3. Continue writing ONLY the remaining content using {mode: 'append'}
                        4. Split the remaining content into smaller chunks (15-20 lines per chunk)
                        
                        Files over the line limit (configurable via 'fileWriteLineLimit' setting) WILL BE REJECTED if not broken into chunks as described above.
                        Only works within allowed directories.
                        
                        IMPORTANT: Always use absolute paths (starting with '/' or drive letter like 'C:\') for reliability. Relative paths may fail as they depend on the current working directory. Tilde paths (~/...) might not work in all contexts. Unless the user explicitly asks for relative paths, use absolute paths.
                        This command can be referenced as "DC: ..." or "use Desktop Commander to ..." in your instructions.

**Parameters:**
- `path` *(required)*: string
- `content` *(required)*: string
- `mode`: string

#### 6. `create_directory`


                        Create a new directory or ensure a directory exists.
                        
                        Can create multiple nested directories in one operation.
                        Only works within allowed directories.
                        
                        IMPORTANT: Always use absolute paths (starting with '/' or drive letter like 'C:\') for reliability. Relative paths may fail as they depend on the current working directory. Tilde paths (~/...) might not work in all contexts. Unless the user explicitly asks for relative paths, use absolute paths.
                        This command can be referenced as "DC: ..." or "use Desktop Commander to ..." in your instructions.

**Parameters:**
- `path` *(required)*: string

#### 7. `list_directory`


                        Get a detailed listing of all files and directories in a specified path.
                        
                        Use this instead of 'execute_command' with ls/dir commands.
                        Results distinguish between files and directories with [FILE] and [DIR] prefixes.
                        Only works within allowed directories.
                        
                        IMPORTANT: Always use absolute paths (starting with '/' or drive letter like 'C:\') for reliability. Relative paths may fail as they depend on the current working directory. Tilde paths (~/...) might not work in all contexts. Unless the user explicitly asks for relative paths, use absolute paths.
                        This command can be referenced as "DC: ..." or "use Desktop Commander to ..." in your instructions.

**Parameters:**
- `path` *(required)*: string

#### 8. `move_file`


                        Move or rename files and directories.
                        
                        Can move files between directories and rename them in a single operation.
                        Both source and destination must be within allowed directories.
                        
                        IMPORTANT: Always use absolute paths (starting with '/' or drive letter like 'C:\') for reliability. Relative paths may fail as they depend on the current working directory. Tilde paths (~/...) might not work in all contexts. Unless the user explicitly asks for relative paths, use absolute paths.
                        This command can be referenced as "DC: ..." or "use Desktop Commander to ..." in your instructions.

**Parameters:**
- `source` *(required)*: string
- `destination` *(required)*: string

#### 9. `search_files`


                        Finds files by name using a case-insensitive substring matching.
                        
                        Use this instead of 'execute_command' with find/dir/ls for locating files.
                        Searches through all subdirectories from the starting path.
                        
                        Has a default timeout of 30 seconds which can be customized using the timeoutMs parameter.
                        Only searches within allowed directories.
                        
                        IMPORTANT: Always use absolute paths (starting with '/' or drive letter like 'C:\') for reliability. Relative paths may fail as they depend on the current working directory. Tilde paths (~/...) might not work in all contexts. Unless the user explicitly asks for relative paths, use absolute paths.
                        This command can be referenced as "DC: ..." or "use Desktop Commander to ..." in your instructions.

**Parameters:**
- `path` *(required)*: string
- `pattern` *(required)*: string
- `timeoutMs`: number

#### 10. `search_code`


                        Search for text/code patterns within file contents using ripgrep.
                        
                        Use this instead of 'execute_command' with grep/find for searching code content.
                        Fast and powerful search similar to VS Code search functionality.
                        
                        Supports regular expressions, file pattern filtering, and context lines.
                        Has a default timeout of 30 seconds which can be customized.
                        Only searches within allowed directories.
                        
                        IMPORTANT: Always use absolute paths (starting with '/' or drive letter like 'C:\') for reliability. Relative paths may fail as they depend on the current working directory. Tilde paths (~/...) might not work in all contexts. Unless the user explicitly asks for relative paths, use absolute paths.
                        This command can be referenced as "DC: ..." or "use Desktop Commander to ..." in your instructions.

**Parameters:**
- `path` *(required)*: string
- `pattern` *(required)*: string
- `filePattern`: string
- `ignoreCase`: boolean
- `maxResults`: number
- `includeHidden`: boolean
- `contextLines`: number
- `timeoutMs`: number

#### 11. `get_file_info`


                        Retrieve detailed metadata about a file or directory including:
                        - size
                        - creation time
                        - last modified time 
                        - permissions
                        - type
                        - lineCount (for text files)
                        - lastLine (zero-indexed number of last line, for text files)
                        - appendPosition (line number for appending, for text files)
                        
                        Only works within allowed directories.
                        
                        IMPORTANT: Always use absolute paths (starting with '/' or drive letter like 'C:\') for reliability. Relative paths may fail as they depend on the current working directory. Tilde paths (~/...) might not work in all contexts. Unless the user explicitly asks for relative paths, use absolute paths.
                        This command can be referenced as "DC: ..." or "use Desktop Commander to ..." in your instructions.

**Parameters:**
- `path` *(required)*: string

#### 12. `edit_block`


                        Apply surgical text replacements to files.
                        
                        BEST PRACTICE: Make multiple small, focused edits rather than one large edit.
                        Each edit_block call should change only what needs to be changed - include just enough 
                        context to uniquely identify the text being modified.
                        
                        Takes:
                        - file_path: Path to the file to edit
                        - old_string: Text to replace
                        - new_string: Replacement text
                        - expected_replacements: Optional parameter for number of replacements
                        
                        By default, replaces only ONE occurrence of the search text.
                        To replace multiple occurrences, provide the expected_replacements parameter with
                        the exact number of matches expected.
                        
                        UNIQUENESS REQUIREMENT: When expected_replacements=1 (default), include the minimal
                        amount of context necessary (typically 1-3 lines) before and after the change point,
                        with exact whitespace and indentation.
                        
                        When editing multiple sections, make separate edit_block calls for each distinct change
                        rather than one large replacement.
                        
                        When a close but non-exact match is found, a character-level diff is shown in the format:
                        common_prefix{-removed-}{+added+}common_suffix to help you identify what's different.
                        
                        Similar to write_file, there is a configurable line limit (fileWriteLineLimit) that warns
                        if the edited file exceeds this limit. If this happens, consider breaking your edits into
                        smaller, more focused changes.
                        
                        IMPORTANT: Always use absolute paths (starting with '/' or drive letter like 'C:\') for reliability. Relative paths may fail as they depend on the current working directory. Tilde paths (~/...) might not work in all contexts. Unless the user explicitly asks for relative paths, use absolute paths.
                        This command can be referenced as "DC: ..." or "use Desktop Commander to ..." in your instructions.

**Parameters:**
- `file_path` *(required)*: string
- `old_string` *(required)*: string
- `new_string` *(required)*: string
- `expected_replacements`: number

#### 13. `execute_command`


                        Execute a terminal command with timeout.
                        
                        Command will continue running in background if it doesn't complete within timeout.
                        
                        NOTE: For file operations, prefer specialized tools like read_file, search_code, 
                        list_directory instead of cat, grep, or ls commands.
                        
                        IMPORTANT: Always use absolute paths (starting with '/' or drive letter like 'C:\') for reliability. Relative paths may fail as they depend on the current working directory. Tilde paths (~/...) might not work in all contexts. Unless the user explicitly asks for relative paths, use absolute paths.
                        This command can be referenced as "DC: ..." or "use Desktop Commander to ..." in your instructions.

**Parameters:**
- `command` *(required)*: string
- `timeout_ms` *(required)*: number
- `shell`: string

#### 14. `read_output`


                        Read new output from a running terminal session.
                        Set timeout_ms for long running commands.
                        
                        This command can be referenced as "DC: ..." or "use Desktop Commander to ..." in your instructions.

**Parameters:**
- `pid` *(required)*: number
- `timeout_ms`: number

#### 15. `force_terminate`


                        Force terminate a running terminal session.
                        
                        This command can be referenced as "DC: ..." or "use Desktop Commander to ..." in your instructions.

**Parameters:**
- `pid` *(required)*: number

#### 16. `list_sessions`


                        List all active terminal sessions.
                        
                        This command can be referenced as "DC: ..." or "use Desktop Commander to ..." in your instructions.

**Parameters:**

#### 17. `list_processes`


                        List all running processes.
                        
                        Returns process information including PID, command name, CPU usage, and memory usage.
                        
                        This command can be referenced as "DC: ..." or "use Desktop Commander to ..." in your instructions.

**Parameters:**

#### 18. `kill_process`


                        Terminate a running process by PID.
                        
                        Use with caution as this will forcefully terminate the specified process.
                        
                        This command can be referenced as "DC: ..." or "use Desktop Commander to ..." in your instructions.

**Parameters:**
- `pid` *(required)*: number


### mobile (17 tools)

Mobile automation & testing

#### 1. `mobile_use_default_device`

Use the default device. This is a shortcut for mobile_use_device with deviceType=simulator and device=simulator_name

**Parameters:**
- `noParams` *(required)*: object

#### 2. `mobile_list_available_devices`

List all available devices. This includes both physical devices and simulators. If there is more than one device returned, you need to let the user select one of them.

**Parameters:**
- `noParams` *(required)*: object

#### 3. `mobile_use_device`

Select a device to use. This can be a simulator or an Android device. Use the list_available_devices tool to get a list of available devices.

**Parameters:**
- `device` *(required)*: string - The name of the device to select
- `deviceType` *(required)*: string - The type of device to select

#### 4. `mobile_list_apps`

List all the installed apps on the device

**Parameters:**
- `noParams` *(required)*: object

#### 5. `mobile_launch_app`

Launch an app on mobile device. Use this to open a specific app. You can find the package name of the app by calling list_apps_on_device.

**Parameters:**
- `packageName` *(required)*: string - The package name of the app to launch

#### 6. `mobile_terminate_app`

Stop and terminate an app on mobile device

**Parameters:**
- `packageName` *(required)*: string - The package name of the app to terminate

#### 7. `mobile_get_screen_size`

Get the screen size of the mobile device in pixels

**Parameters:**
- `noParams` *(required)*: object

#### 8. `mobile_click_on_screen_at_coordinates`

Click on the screen at given x,y coordinates. If clicking on an element, use the list_elements_on_screen tool to find the coordinates.

**Parameters:**
- `x` *(required)*: number - The x coordinate to click on the screen, in pixels
- `y` *(required)*: number - The y coordinate to click on the screen, in pixels

#### 9. `mobile_list_elements_on_screen`

List elements on screen and their coordinates, with display text or accessibility label. Do not cache this result.

**Parameters:**
- `noParams` *(required)*: object

#### 10. `mobile_press_button`

Press a button on device

**Parameters:**
- `button` *(required)*: string - The button to press. Supported buttons: BACK (android only), HOME, VOLUME_UP, VOLUME_DOWN, ENTER, DPAD_CENTER (android tv only), DPAD_UP (android tv only), DPAD_DOWN (android tv only), DPAD_LEFT (android tv only), DPAD_RIGHT (android tv only)

#### 11. `mobile_open_url`

Open a URL in browser on device

**Parameters:**
- `url` *(required)*: string - The URL to open

#### 12. `swipe_on_screen`

Swipe on the screen

**Parameters:**
- `direction` *(required)*: string - The direction to swipe
- `x`: number - The x coordinate to start the swipe from, in pixels. If not provided, uses center of screen
- `y`: number - The y coordinate to start the swipe from, in pixels. If not provided, uses center of screen
- `distance`: number - The distance to swipe in pixels. Defaults to 400 pixels for iOS or 30% of screen dimension for Android

#### 13. `mobile_type_keys`

Type text into the focused element

**Parameters:**
- `text` *(required)*: string - The text to type
- `submit` *(required)*: boolean - Whether to submit the text. If true, the text will be submitted as if the user pressed the enter key.

#### 14. `mobile_save_screenshot`

Save a screenshot of the mobile device to a file

**Parameters:**
- `saveTo` *(required)*: string - The path to save the screenshot to

#### 15. `mobile_take_screenshot`

Take a screenshot of the mobile device. Use this to understand what's on screen, if you need to press an element that is available through view hierarchy then you must list elements on screen instead. Do not cache this result.

**Parameters:**
- `noParams` *(required)*: object

#### 16. `mobile_set_orientation`

Change the screen orientation of the device

**Parameters:**
- `orientation` *(required)*: string - The desired orientation

#### 17. `mobile_get_orientation`

Get the current screen orientation of the device

**Parameters:**
- `noParams` *(required)*: object


### serena (17 tools)

Code search & analysis

#### 1. `analyze_code`

Analyze code for syntax, complexity, and patterns

**Parameters:**
- `code` *(required)*: string - Code to analyze
- `language` *(required)*: string - Programming language

#### 2. `find_symbol`

Find symbol definitions in code

**Parameters:**
- `symbol` *(required)*: string - Symbol name to find
- `code` *(required)*: string - Code to search in
- `language` *(required)*: string - Programming language

#### 3. `extract_functions`

Extract function definitions from code

**Parameters:**
- `code` *(required)*: string - Code to extract functions from
- `language` *(required)*: string - Programming language

#### 4. `detect_patterns`

Detect code patterns and anti-patterns

**Parameters:**
- `code` *(required)*: string - Code to analyze
- `language` *(required)*: string - Programming language

#### 5. `suggest_improvements`

Suggest code improvements and refactoring

**Parameters:**
- `code` *(required)*: string - Code to improve
- `language` *(required)*: string - Programming language

#### 6. `calculate_complexity`

Calculate cyclomatic complexity of code

**Parameters:**
- `code` *(required)*: string - Code to analyze
- `language` *(required)*: string - Programming language

#### 7. `extract_imports`

Extract import statements and dependencies

**Parameters:**
- `code` *(required)*: string - Code to analyze
- `language` *(required)*: string - Programming language

#### 8. `check_style`

Check code style and formatting issues

**Parameters:**
- `code` *(required)*: string - Code to check
- `language` *(required)*: string - Programming language

#### 9. `find_referencing_symbols`

Find all locations where a symbol is referenced

**Parameters:**
- `symbol` *(required)*: string - Symbol to find references for
- `code` *(required)*: string - Code to search in
- `language` *(required)*: string - Programming language

#### 10. `get_symbols_overview`

Get an overview of all symbols (classes, functions, methods) in code

**Parameters:**
- `code` *(required)*: string - Code to analyze
- `language` *(required)*: string - Programming language

#### 11. `insert_before_symbol`

Insert code before a symbol definition

**Parameters:**
- `symbol` *(required)*: string - Symbol name
- `code` *(required)*: string - Original code
- `insert_text` *(required)*: string - Text to insert
- `language` *(required)*: string - Programming language

#### 12. `insert_after_symbol`

Insert code after a symbol definition

**Parameters:**
- `symbol` *(required)*: string - Symbol name
- `code` *(required)*: string - Original code
- `insert_text` *(required)*: string - Text to insert
- `language` *(required)*: string - Programming language

#### 13. `replace_symbol_body`

Replace the entire body of a function or method

**Parameters:**
- `symbol` *(required)*: string - Symbol name
- `code` *(required)*: string - Original code
- `new_body` *(required)*: string - New body content
- `language` *(required)*: string - Programming language

#### 14. `search_for_pattern`

Search for a pattern across files in a directory

**Parameters:**
- `pattern` *(required)*: string - Pattern to search (regex)
- `directory` *(required)*: string - Directory to search in
- `file_pattern`: string - File pattern (e.g., *.py)

#### 15. `replace_regex`

Replace text using regex pattern

**Parameters:**
- `code` *(required)*: string - Original code
- `pattern` *(required)*: string - Regex pattern to find
- `replacement` *(required)*: string - Replacement text

#### 16. `insert_at_line`

Insert text at a specific line number

**Parameters:**
- `code` *(required)*: string - Original code
- `line_number` *(required)*: integer - Line number (1-based)
- `text` *(required)*: string - Text to insert

#### 17. `replace_lines`

Replace a range of lines in code

**Parameters:**
- `code` *(required)*: string - Original code
- `start_line` *(required)*: integer - Start line (1-based)
- `end_line` *(required)*: integer - End line (1-based)
- `replacement` *(required)*: string - Replacement text


### nodejs-debugger (13 tools)

Node.js debugging

#### 1. `nodejs_inspect`

Executes JavaScript code in the debugged process

**Parameters:**
- `js_code` *(required)*: string - JavaScript code to execute

#### 2. `set_breakpoint`

Sets a breakpoint at specified line and file

**Parameters:**
- `file` *(required)*: string - File path where to set breakpoint
- `line` *(required)*: number - Line number for breakpoint

#### 3. `inspect_variables`

Inspects variables in current scope

**Parameters:**
- `scope`: string - Scope to inspect (local/global)

#### 4. `step_over`

Steps over to the next line of code

**Parameters:**

#### 5. `step_into`

Steps into function calls

**Parameters:**

#### 6. `step_out`

Steps out of current function

**Parameters:**

#### 7. `continue`

Continues code execution

**Parameters:**

#### 8. `delete_breakpoint`

Deletes a specified breakpoint

**Parameters:**
- `breakpointId` *(required)*: string - ID of the breakpoint to remove

#### 9. `list_breakpoints`

Lists all active breakpoints

**Parameters:**

#### 10. `evaluate`

Evaluates a JavaScript expression in the current context

**Parameters:**
- `expression` *(required)*: string - JavaScript expression to evaluate

#### 11. `get_location`

Gets the current execution location when paused

**Parameters:**

#### 12. `get_console_output`

Gets the most recent console output from the debugged process

**Parameters:**
- `limit`: number - Maximum number of console entries to return. Defaults to 20

#### 13. `retry_connect`

Manually triggers a reconnection attempt to the Node.js debugger

**Parameters:**
- `port`: number - Optional port to connect to. Defaults to current port (9229)


### playwright (10 tools)

Browser automation

#### 1. `launch_browser`

Launch a new browser instance

**Parameters:**
- `headless`: boolean - Run in headless mode

#### 2. `navigate_to`

Navigate to a URL

**Parameters:**
- `url` *(required)*: string - URL to navigate to
- `pageId`: string - Page ID (optional)

#### 3. `click`

Click an element

**Parameters:**
- `selector` *(required)*: string - CSS selector or text
- `pageId`: string - Page ID

#### 4. `fill`

Fill a form field

**Parameters:**
- `selector` *(required)*: string - CSS selector
- `value` *(required)*: string - Value to fill
- `pageId`: string - Page ID

#### 5. `get_text`

Get text content of an element

**Parameters:**
- `selector` *(required)*: string - CSS selector
- `pageId`: string - Page ID

#### 6. `take_screenshot`

Take a screenshot of the page

**Parameters:**
- `pageId`: string - Page ID
- `fullPage`: boolean - Capture full page

#### 7. `get_title`

Get the page title

**Parameters:**
- `pageId`: string - Page ID

#### 8. `get_url`

Get the current page URL

**Parameters:**
- `pageId`: string - Page ID

#### 9. `wait_for_element`

Wait for an element to appear

**Parameters:**
- `selector` *(required)*: string - CSS selector
- `pageId`: string - Page ID
- `timeout`: number - Timeout in milliseconds

#### 10. `close_browser`

Close the browser

**Parameters:**


## 🔧 Tier 3 Services


### clear-thought (9 tools)

Systematic thinking

#### 1. `sequentialthinking`

Process sequential thoughts with branching, revision, and memory management capabilities

**Parameters:**
- `thought` *(required)*: string - The thought content
- `thoughtNumber` *(required)*: number - Current thought number in sequence
- `totalThoughts` *(required)*: number - Total expected thoughts in sequence
- `nextThoughtNeeded` *(required)*: boolean - Whether the next thought is needed
- `isRevision`: boolean - Whether this is a revision of a previous thought
- `revisesThought`: number - Which thought number this revises
- `branchFromThought`: number - Which thought this branches from
- `branchId`: string - Unique identifier for this branch
- `needsMoreThoughts`: boolean - Whether more thoughts are needed

#### 2. `mentalmodel`

Apply mental models to analyze problems systematically

**Parameters:**
- `modelName` *(required)*: string - Name of the mental model
- `steps` *(required)*: array - Steps to apply the model
- `conclusion` *(required)*: string - Conclusions drawn

#### 3. `debuggingapproach`

Apply systematic debugging approaches to identify and resolve issues

**Parameters:**
- `approachName` *(required)*: string - Debugging approach
- `steps` *(required)*: array - Steps taken to debug
- `resolution` *(required)*: string - How the issue was resolved

#### 4. `collaborativereasoning`

Facilitate collaborative reasoning with multiple perspectives and personas

**Parameters:**
- `topic` *(required)*: string
- `personas` *(required)*: array
- `contributions` *(required)*: array
- `stage` *(required)*: string
- `activePersonaId` *(required)*: string
- `sessionId` *(required)*: string
- `iteration` *(required)*: number
- `nextContributionNeeded` *(required)*: boolean

#### 5. `decisionframework`

Apply structured decision-making frameworks

**Parameters:**
- `decisionStatement` *(required)*: string
- `options` *(required)*: array
- `analysisType` *(required)*: string
- `stage` *(required)*: string
- `decisionId` *(required)*: string
- `iteration` *(required)*: number
- `nextStageNeeded` *(required)*: boolean

#### 6. `metacognitivemonitoring`

Monitor and assess thinking processes and knowledge

**Parameters:**
- `task` *(required)*: string
- `stage` *(required)*: string
- `overallConfidence` *(required)*: number
- `uncertaintyAreas` *(required)*: array
- `recommendedApproach` *(required)*: string
- `monitoringId` *(required)*: string
- `iteration` *(required)*: number
- `nextAssessmentNeeded` *(required)*: boolean

#### 7. `scientificmethod`

Apply scientific method for systematic inquiry

**Parameters:**
- `stage` *(required)*: string
- `inquiryId` *(required)*: string
- `iteration` *(required)*: number
- `nextStageNeeded` *(required)*: boolean

#### 8. `structuredargumentation`

Construct and analyze structured arguments

**Parameters:**
- `claim` *(required)*: string
- `premises` *(required)*: array
- `conclusion` *(required)*: string
- `argumentType` *(required)*: string
- `confidence` *(required)*: number
- `nextArgumentNeeded` *(required)*: boolean

#### 9. `visualreasoning`

Process visual reasoning and diagram operations

**Parameters:**
- `operation` *(required)*: string
- `diagramId` *(required)*: string
- `diagramType` *(required)*: string
- `iteration` *(required)*: number
- `nextOperationNeeded` *(required)*: boolean


### github (8 tools)

GitHub API management

#### 1. `search_repositories`

Search for GitHub repositories

**Parameters:**
- `query` *(required)*: string - Search query
- `sort`: string - Sort field
- `order`: string - Sort order
- `per_page`: number - Results per page (max 100)

#### 2. `get_repository`

Get details about a specific repository

**Parameters:**
- `owner` *(required)*: string - Repository owner
- `repo` *(required)*: string - Repository name

#### 3. `list_issues`

List issues in a repository

**Parameters:**
- `owner` *(required)*: string - Repository owner
- `repo` *(required)*: string - Repository name
- `state`: string - Issue state
- `labels`: string - Comma-separated label names
- `per_page`: number - Results per page

#### 4. `create_issue`

Create a new issue

**Parameters:**
- `owner` *(required)*: string - Repository owner
- `repo` *(required)*: string - Repository name
- `title` *(required)*: string - Issue title
- `body`: string - Issue body
- `labels`: array - Issue labels

#### 5. `get_file_contents`

Get contents of a file from a repository

**Parameters:**
- `owner` *(required)*: string - Repository owner
- `repo` *(required)*: string - Repository name
- `path` *(required)*: string - File path
- `ref`: string - Branch/tag/commit ref

#### 6. `create_or_update_file`

Create or update a file in a repository

**Parameters:**
- `owner` *(required)*: string - Repository owner
- `repo` *(required)*: string - Repository name
- `path` *(required)*: string - File path
- `content` *(required)*: string - File content
- `message` *(required)*: string - Commit message
- `branch`: string - Branch name
- `sha`: string - SHA of file being replaced (for updates)

#### 7. `list_branches`

List branches in a repository

**Parameters:**
- `owner` *(required)*: string - Repository owner
- `repo` *(required)*: string - Repository name

#### 8. `create_pull_request`

Create a new pull request

**Parameters:**
- `owner` *(required)*: string - Repository owner
- `repo` *(required)*: string - Repository name
- `title` *(required)*: string - PR title
- `body`: string - PR description
- `head` *(required)*: string - Source branch
- `base` *(required)*: string - Target branch


### node-omnibus (7 tools)

Node.js utilities

#### 1. `create_project`

Create a new Node.js project with enhanced configuration

**Parameters:**
- `name` *(required)*: string - Project name
- `type` *(required)*: string - Project type
- `path` *(required)*: string - Project directory path
- `typescript`: boolean - Enable TypeScript support

#### 2. `install_packages`

Install npm packages with version management

**Parameters:**
- `packages` *(required)*: array - Package names to install
- `path` *(required)*: string - Project directory path
- `dev`: boolean - Install as dev dependency

#### 3. `generate_component`

Generate a new React component with TypeScript support

**Parameters:**
- `name` *(required)*: string - Component name
- `path` *(required)*: string - Component directory path
- `type` *(required)*: string - Component type
- `props`: object - Component props with types

#### 4. `create_type_definition`

Create TypeScript type definitions or interfaces

**Parameters:**
- `name` *(required)*: string - Type name
- `path` *(required)*: string - File path
- `properties` *(required)*: object - Type properties and their types

#### 5. `add_script`

Add a new npm script to package.json

**Parameters:**
- `path` *(required)*: string - Project directory path
- `name` *(required)*: string - Script name
- `command` *(required)*: string - Script command

#### 6. `update_tsconfig`

Update TypeScript configuration

**Parameters:**
- `path` *(required)*: string - Project directory path
- `options` *(required)*: object - TypeScript compiler options

#### 7. `create_documentation`

Generate project documentation

**Parameters:**
- `path` *(required)*: string - Project directory path
- `type` *(required)*: string - Documentation type
- `name`: string - Component or API name for specific documentation


### 21stdev-magic (4 tools)

Development tools

#### 1. `21st_magic_component_builder`


"Use this tool when the user requests a new UI component—e.g., mentions /ui, /21 /21st, or asks for a button, input, dialog, table, form, banner, card, or other React component.
This tool ONLY returns the text snippet for that UI component. 
After calling this tool, you must edit or add files to integrate the snippet into the codebase."


**Parameters:**
- `message` *(required)*: string - Full users message
- `searchQuery` *(required)*: string - Generate a search query for 21st.dev (library for searching UI components) to find a UI component that matches the user's message. Must be a two-four words max or phrase
- `absolutePathToCurrentFile` *(required)*: string - Absolute path to the current file to which we want to apply changes
- `absolutePathToProjectDirectory` *(required)*: string - Absolute path to the project root directory
- `context` *(required)*: string - Extract additional context about what should be done to create a ui component/page based on the user's message, search query, and conversation history, files. Don't halucinate and be on point.

#### 2. `logo_search`


Search and return logos in specified format (JSX, TSX, SVG).
Supports single and multiple logo searches with category filtering.
Can return logos in different themes (light/dark) if available.

When to use this tool:
1. When user types "/logo" command (e.g., "/logo GitHub")
2. When user asks to add a company logo that's not in the local project

Example queries:
- Single company: ["discord"]
- Multiple companies: ["discord", "github", "slack"]
- Specific brand: ["microsoft office"]
- Command style: "/logo GitHub" -> ["github"]
- Request style: "Add Discord logo to the project" -> ["discord"]

Format options:
- TSX: Returns TypeScript React component
- JSX: Returns JavaScript React component
- SVG: Returns raw SVG markup

Each result includes:
- Component name (e.g., DiscordIcon)
- Component code
- Import instructions


**Parameters:**
- `queries` *(required)*: array - List of company names to search for logos
- `format` *(required)*: string - Output format

#### 3. `21st_magic_component_inspiration`


"Use this tool when the user wants to see component, get inspiration, or /21st fetch data and previews from 21st.dev. This tool returns the JSON data of matching components without generating new code. This tool ONLY returns the text snippet for that UI component. 
After calling this tool, you must edit or add files to integrate the snippet into the codebase."


**Parameters:**
- `message` *(required)*: string - Full users message
- `searchQuery` *(required)*: string - Search query for 21st.dev (library for searching UI components) to find a UI component that matches the user's message. Must be a two-four words max or phrase

#### 4. `21st_magic_component_refiner`


"Use this tool when the user requests to re-design/refine/improve current UI component with /ui or /21 commands, 
or when context is about improving, or refining UI for a React component or molecule (NOT for big pages).
This tool improves UI of components and returns redesigned version of the component and instructions on how to implement it."


**Parameters:**
- `userMessage` *(required)*: string - Full user's message about UI refinement
- `absolutePathToRefiningFile` *(required)*: string - Absolute path to the file that needs to be refined
- `context` *(required)*: string - Extract the specific UI elements and aspects that need improvement based on user messages, code, and conversation history. Identify exactly which components (buttons, forms, modals, etc.) the user is referring to and what aspects (styling, layout, responsiveness, etc.) they want to enhance. Do not include generic improvements - focus only on what the user explicitly mentions or what can be reasonably inferred from the available context. If nothing specific is mentioned or you cannot determine what needs improvement, return an empty string.


### cloudflare (3 tools)

DNS/CDN management

#### 1. `list_zones`

List all zones in your Cloudflare account

**Parameters:**

#### 2. `list_dns_records`

List DNS records for a zone

**Parameters:**
- `zoneId` *(required)*: string

#### 3. `create_dns_record`

Create a new DNS record

**Parameters:**
- `zoneId` *(required)*: string
- `type` *(required)*: string
- `name` *(required)*: string
- `content` *(required)*: string
- `proxied`: boolean
- `ttl`: number


### mem0 (3 tools)

Memory storage

#### 1. `store_memory`

Store information in persistent memory (local + cloud)

**Parameters:**
- `key` *(required)*: string - Memory key
- `value` *(required)*: string - Value to store

#### 2. `retrieve_memory`

Retrieve information from persistent memory

**Parameters:**
- `key` *(required)*: string - Memory key to retrieve

#### 3. `list_memories`

List all stored memories (local + cloud)

**Parameters:**


### context7 (2 tools)

Context analysis

#### 1. `resolve-library-id`

Resolves a package/product name to a Context7-compatible library ID and returns a list of matching libraries.

You MUST call this function before 'get-library-docs' to obtain a valid Context7-compatible library ID UNLESS the user explicitly provides a library ID in the format '/org/project' or '/org/project/version' in their query.

Selection Process:
1. Analyze the query to understand what library/package the user is looking for
2. Return the most relevant match based on:
- Name similarity to the query (exact matches prioritized)
- Description relevance to the query's intent
- Documentation coverage (prioritize libraries with higher Code Snippet counts)
- Trust score (consider libraries with scores of 7-10 more authoritative)

Response Format:
- Return the selected library ID in a clearly marked section
- Provide a brief explanation for why this library was chosen
- If multiple good matches exist, acknowledge this but proceed with the most relevant one
- If no good matches exist, clearly state this and suggest query refinements

For ambiguous queries, request clarification before proceeding with a best-guess match.

**Parameters:**
- `libraryName` *(required)*: string - Library name to search for and retrieve a Context7-compatible library ID.

#### 2. `get-library-docs`

Fetches up-to-date documentation for a library. You must call 'resolve-library-id' first to obtain the exact Context7-compatible library ID required to use this tool, UNLESS the user explicitly provides a library ID in the format '/org/project' or '/org/project/version' in their query.

**Parameters:**
- `context7CompatibleLibraryID` *(required)*: string - Exact Context7-compatible library ID (e.g., '/mongodb/docs', '/vercel/next.js', '/supabase/supabase', '/vercel/next.js/v14.3.0-canary.87') retrieved from 'resolve-library-id' or directly from user query in the format '/org/project' or '/org/project/version'.
- `topic`: string - Topic to focus documentation on (e.g., 'hooks', 'routing').
- `tokens`: number - Maximum number of tokens of documentation to retrieve (default: 10000). Higher values provide more context but consume more tokens.


### code-runner (2 tools)

Code execution

#### 1. `run`

Execute code in various programming languages

**Parameters:**
- `code` *(required)*: string - Code to execute
- `language` *(required)*: string - Programming language

#### 2. `test`

Test that the code runner is working

**Parameters:**


### code-checker (2 tools)

Code quality

#### 1. `check_code`

Check code for syntax errors, style issues, and potential bugs

**Parameters:**
- `code` *(required)*: string - Code to analyze
- `language`: string - Programming language (auto-detect if not specified)

#### 2. `check_file`

Check a file for code issues

**Parameters:**
- `filepath` *(required)*: string - Path to file to check


### serper-search (2 tools)

Search API

#### 1. `google_search`

Tool to perform web searches via Serper API and retrieve rich results. It is able to retrieve organic search results, people also ask, related searches, and knowledge graph.

**Parameters:**
- `q` *(required)*: string - Search query string (e.g., 'artificial intelligence', 'climate change solutions')
- `gl` *(required)*: string - Optional region code for search results in ISO 3166-1 alpha-2 format (e.g., 'us', 'gb', 'de')
- `hl` *(required)*: string - Optional language code for search results in ISO 639-1 format (e.g., 'en', 'es', 'fr')
- `location`: string - Optional location for search results (e.g., 'SoHo, New York, United States', 'California, United States')
- `num`: number - Number of results to return (default: 10)
- `tbs`: string - Time-based search filter ('qdr:h' for past hour, 'qdr:d' for past day, 'qdr:w' for past week, 'qdr:m' for past month, 'qdr:y' for past year)
- `page`: number - Page number of results to return (default: 1)
- `autocorrect`: boolean - Whether to autocorrect spelling in query
- `site`: string - Limit results to specific domain (e.g., 'github.com', 'wikipedia.org')
- `filetype`: string - Limit to specific file types (e.g., 'pdf', 'doc', 'xls')
- `inurl`: string - Search for pages with word in URL (e.g., 'download', 'tutorial')
- `intitle`: string - Search for pages with word in title (e.g., 'review', 'how to')
- `related`: string - Find similar websites (e.g., 'github.com', 'stackoverflow.com')
- `cache`: string - View Google's cached version of a specific URL (e.g., 'example.com/page')
- `before`: string - Date before in YYYY-MM-DD format (e.g., '2024-01-01')
- `after`: string - Date after in YYYY-MM-DD format (e.g., '2023-01-01')
- `exact`: string - Exact phrase match (e.g., 'machine learning', 'quantum computing')
- `exclude`: string - Terms to exclude from search results as comma-separated string (e.g., 'spam,ads', 'beginner,basic')
- `or`: string - Alternative terms as comma-separated string (e.g., 'tutorial,guide,course', 'documentation,manual')

#### 2. `scrape`

Tool to scrape a webpage and retrieve the text and, optionally, the markdown content. It will retrieve also the JSON-LD metadata and the head metadata.

**Parameters:**
- `url` *(required)*: string - The URL of the webpage to scrape.
- `includeMarkdown`: boolean - Whether to include markdown content.


### code-context-provider (1 tools)

Context provider

#### 1. `get_code_context`

Returns Complete Context of a given project directory, including directory tree, and code symbols. Useful for getting a quick overview of a project. Use this tool when you need to get a comprehensive overview of a project's codebase. Useful at the start of a new task.

**Parameters:**
- `absolutePath` *(required)*: string - Absolute path to the directory to analyze. For windows, it is recommended to use forward slashes to avoid escaping (e.g. C:/Users/username/Documents/project/src)
- `analyzeJs`: boolean - Whether to analyze JavaScript/TypeScript and Python files. Returns the count of functions, variables, classes, imports, and exports in the codebase.
- `includeSymbols`: boolean - Whether to include code symbols in the response. Returns the code symbols for each file.
- `symbolType`: string - Type of symbols to include if includeSymbols is true. Otherwise, returns only the directory tree.
- `maxDepth`: number - Maximum directory depth for code analysis (default: 5 levels). Directory tree will still be built for all levels. Reduce the depth if you only need a quick overview of the project.


### stochastic-thinking (1 tools)

5 stochastic algorithms

#### 1. `stochasticalgorithm`

A tool for applying stochastic algorithms to decision-making problems.
Supports various algorithms including:
- Markov Decision Processes (MDPs): Optimize policies over long sequences of decisions
- Monte Carlo Tree Search (MCTS): Simulate future action sequences for large decision spaces
- Multi-Armed Bandit: Balance exploration vs exploitation in action selection
- Bayesian Optimization: Optimize decisions with probabilistic inference
- Hidden Markov Models (HMMs): Infer latent states affecting decision outcomes

Each algorithm provides a systematic approach to handling uncertainty in decision-making.

**Parameters:**
- `algorithm` *(required)*: string - The stochastic algorithm to use
- `problem` *(required)*: string - Description of the problem to solve
- `parameters` *(required)*: object - Algorithm-specific parameters


### mermaid (1 tools)

Diagram generation (unstable)

#### 1. `render_mermaid`

Render a Mermaid diagram to PNG image using Playwright

**Parameters:**
- `diagram` *(required)*: string - Mermaid diagram code to render
- `theme`: string - Theme for the diagram
- `width`: number - Width of the output image
- `height`: number - Height of the output image


---

## 🔧 Using These Tools

### Quick Test
```bash
# Test any service
curl -X POST http://localhost:3100/mcp/SERVICE_NAME \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":"test","method":"tools/list","params":{}}'

# Call a specific tool
curl -X POST http://localhost:3100/mcp/SERVICE_NAME \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "id":"call",
    "method":"tools/call",
    "params":{
      "name":"TOOL_NAME",
      "arguments":{"param":"value"}
    }
  }'
```

### Integration Examples
See [README.md](README.md) for complete setup and usage examples.

---

*This catalog is auto-generated from live service data. All tools are verified to work.*
*Last updated: 8/24/2025, 1:41:06 PM*
