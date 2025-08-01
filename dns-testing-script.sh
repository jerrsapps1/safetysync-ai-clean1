#!/bin/bash

# DNS Testing Script for SafetySync.AI
echo "=== SafetySync.AI DNS Status Check ==="
echo ""

echo "Testing main domain..."
echo "safetysync.ai:"
dig +short safetysync.ai

echo ""
echo "Testing www subdomain..."
echo "www.safetysync.ai:"
dig +short www.safetysync.ai

echo ""
echo "Testing app subdomain..."
echo "app.safetysync.ai:"
dig +short app.safetysync.ai

echo ""
echo "Testing api subdomain..."
echo "api.safetysync.ai:"
dig +short api.safetysync.ai

echo ""
echo "Testing admin subdomain..."
echo "admin.safetysync.ai:"
dig +short admin.safetysync.ai

echo ""
echo "=== HTTP Response Tests ==="
echo ""

echo "Testing HTTPS connectivity..."
echo "Main domain (safetysync.ai):"
curl -s -I https://safetysync.ai | head -1

echo "App subdomain (app.safetysync.ai):"
curl -s -I https://app.safetysync.ai | head -1

echo "API subdomain (api.safetysync.ai):"
curl -s -I https://api.safetysync.ai | head -1

echo "Admin subdomain (admin.safetysync.ai):"
curl -s -I https://admin.safetysync.ai | head -1

echo ""
echo "=== DNS Status Summary ==="
echo "✅ Working: Should return 34.111.179.208"
echo "❌ Not Working: Should return nothing or error"
echo ""
echo "Run this script periodically to check propagation status"