# Generate Claude Desktop Config from Template (Windows PowerShell)
# Part of Unified MCP Infrastructure - Cross-Platform Compatible

param(
    [string]$OutputPath
)

Write-Host "🔧 Generating Claude Desktop Configuration..." -ForegroundColor Cyan

# Auto-detect project root
$PROJECT_ROOT = (Get-Location).Path
Write-Host "📁 Project root: $PROJECT_ROOT" -ForegroundColor Green

# Validate template exists
$TEMPLATE_FILE = "$PROJECT_ROOT\claude_desktop_config.template.json"
if (-not (Test-Path $TEMPLATE_FILE)) {
    Write-Host "❌ Template file not found: $TEMPLATE_FILE" -ForegroundColor Red
    exit 1
}

# Generate configuration
$OUTPUT_FILE = if ($OutputPath) { $OutputPath } else { "$PROJECT_ROOT\claude_desktop_config.json" }
Write-Host "⚙️  Generating configuration..." -ForegroundColor Yellow

# Read template and replace placeholders
$templateContent = Get-Content $TEMPLATE_FILE -Raw
$PROJECT_ROOT_UNIX = $PROJECT_ROOT -replace '\\', '/'
$configContent = $templateContent -replace '\{\{PROJECT_ROOT\}\}', $PROJECT_ROOT_UNIX

# Parse JSON and remove template info
$configObj = $configContent | ConvertFrom-Json
if ($configObj._template_info) {
    $configObj.PSObject.Properties.Remove('_template_info')
}

# Write final configuration
$configObj | ConvertTo-Json -Depth 10 | Out-File -FilePath $OUTPUT_FILE -Encoding UTF8

Write-Host "✅ Configuration generated: $OUTPUT_FILE" -ForegroundColor Green
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Copy to Claude Desktop config location:" -ForegroundColor Yellow

# Show Windows-specific path
$userProfile = [Environment]::GetFolderPath("UserProfile")
$claudeConfigPath = "$userProfile\AppData\Roaming\Claude\claude_desktop_config.json"
Write-Host "      Copy-Item '$OUTPUT_FILE' '$claudeConfigPath'" -ForegroundColor Yellow

Write-Host "   2. Restart Claude Desktop" -ForegroundColor Yellow
Write-Host "🎯 Template-based configuration completed!" -ForegroundColor Green