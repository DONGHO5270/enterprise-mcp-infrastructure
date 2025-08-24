#!/bin/bash
echo "🧪 Testing Unified Task Server..."

# Test initialize
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' | node dist/unified-task-server.js

# Test tools/list
echo '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' | node dist/unified-task-server.js
