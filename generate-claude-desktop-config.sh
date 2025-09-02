#!/bin/bash
# Generate Claude Desktop Config from Template
# Part of Unified MCP Infrastructure - Cross-Platform Compatible

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}🔧 Generating Claude Desktop Configuration...${NC}"

# Auto-detect project root
PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo -e "${GREEN}📁 Project root: $PROJECT_ROOT${NC}"

# Validate template exists
TEMPLATE_FILE="$PROJECT_ROOT/claude_desktop_config.template.json"
if [[ ! -f "$TEMPLATE_FILE" ]]; then
    echo -e "${RED}❌ Template file not found: $TEMPLATE_FILE${NC}"
    exit 1
fi

# Generate configuration
OUTPUT_FILE="$PROJECT_ROOT/claude_desktop_config.json"
echo -e "${YELLOW}⚙️  Generating configuration...${NC}"

# Replace template placeholders
sed "s|{{PROJECT_ROOT}}|$PROJECT_ROOT|g" "$TEMPLATE_FILE" > "$OUTPUT_FILE"

# Remove template info section (not needed in actual config)
if command -v jq &> /dev/null; then
    jq 'del(._template_info)' "$OUTPUT_FILE" > "$OUTPUT_FILE.tmp" && mv "$OUTPUT_FILE.tmp" "$OUTPUT_FILE"
else
    # Fallback: remove template info without jq
    grep -v "_template_info\|placeholders\|usage\|generated\|description" "$OUTPUT_FILE" > "$OUTPUT_FILE.tmp" && mv "$OUTPUT_FILE.tmp" "$OUTPUT_FILE"
fi

echo -e "${GREEN}✅ Configuration generated: $OUTPUT_FILE${NC}"
echo -e "${CYAN}📋 Next steps:${NC}"
echo -e "${YELLOW}   1. Copy to Claude Desktop config location:${NC}"

# Detect OS and show appropriate path
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo -e "${YELLOW}      cp '$OUTPUT_FILE' ~/Library/Application\\ Support/Claude/claude_desktop_config.json${NC}"
elif [[ "$OSTYPE" == "linux-gnu"* ]] || [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    echo -e "${YELLOW}      # Windows (WSL):${NC}"
    echo -e "${YELLOW}      cp '$OUTPUT_FILE' /mnt/c/Users/\$USER/AppData/Roaming/Claude/claude_desktop_config.json${NC}"
    echo -e "${YELLOW}      # Linux:${NC}" 
    echo -e "${YELLOW}      cp '$OUTPUT_FILE' ~/.config/Claude/claude_desktop_config.json${NC}"
fi

echo -e "${YELLOW}   2. Restart Claude Desktop${NC}"
echo -e "${GREEN}🎯 Template-based configuration completed!${NC}"