#!/bin/bash

# Build script for Unified Task Server

echo "🔨 Building Unified Task Server..."

# Ensure we're in the right directory
cd "$(dirname "$0")"

# Compile TypeScript
echo "📦 Compiling TypeScript..."
npx tsc src/unified-task-server.ts \
  --outDir dist \
  --module commonjs \
  --target es2020 \
  --esModuleInterop \
  --skipLibCheck \
  --resolveJsonModule \
  --lib es2020 \
  --types node

# Check if compilation succeeded
if [ $? -eq 0 ]; then
  echo "✅ Build successful!"
  echo "📍 Output: dist/unified-task-server.js"
  
  # Make it executable
  chmod +x dist/unified-task-server.js
  
  # Create a simple test script
  cat > test-unified.sh << 'EOF'
#!/bin/bash
echo "🧪 Testing Unified Task Server..."

# Test initialize
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' | node dist/unified-task-server.js

# Test tools/list
echo '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' | node dist/unified-task-server.js
EOF
  
  chmod +x test-unified.sh
  echo "📝 Created test-unified.sh for testing"
  
else
  echo "❌ Build failed!"
  exit 1
fi

echo ""
echo "📋 Next steps:"
echo "1. Run ./test-unified.sh to test the server"
echo "2. Copy claude_desktop_config_unified_task.json to Claude Desktop config"
echo "3. Restart Claude Desktop"
echo "4. Use Task() to call any MCP service!"