#!/bin/bash
echo "🧪 Testing Unified Task Server (HTTP Backend)..."
echo "⚠️  Make sure Docker MCP services are running on port 3100"
echo ""

# Test initialize
echo "1️⃣ Testing initialize..."
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' | node dist/unified-task-server-http.js | jq '.'

echo ""
echo "2️⃣ Testing tools/list (this may take a moment)..."
# Test tools/list with timeout
timeout 30 bash -c 'echo "{\"jsonrpc\":\"2.0\",\"id\":2,\"method\":\"tools/list\",\"params\":{}}" | node dist/unified-task-server-http.js' | jq '.result.tools | length'

echo ""
echo "3️⃣ Testing npm-sentinel.tools/list..."
echo '{"jsonrpc":"2.0","id":3,"method":"npm-sentinel.tools/list","params":{}}' | node dist/unified-task-server-http.js | jq '.result.tools[0]'
