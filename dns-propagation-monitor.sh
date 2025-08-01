#!/bin/bash

# DNS Propagation Monitor for SafetySync.AI
echo "=== DNS Propagation Monitor ==="
echo "Checking every 2 minutes until all subdomains are active..."
echo ""

check_dns() {
    local domain=$1
    local expected_ip="34.111.179.208"
    local actual_ip=$(dig +short $domain | grep -E "^[0-9]" | head -1)
    
    if [ "$actual_ip" = "$expected_ip" ]; then
        echo "✅ $domain → $actual_ip"
        return 0
    else
        echo "❌ $domain → $actual_ip (expected: $expected_ip)"
        return 1
    fi
}

while true; do
    echo "$(date): Checking DNS status..."
    
    # Check all domains
    check_dns "safetysync.ai"
    check_dns "www.safetysync.ai"
    check_dns "app.safetysync.ai"
    check_dns "api.safetysync.ai"
    check_dns "admin.safetysync.ai"
    
    # Check if all are working
    if check_dns "app.safetysync.ai" > /dev/null && check_dns "api.safetysync.ai" > /dev/null && check_dns "admin.safetysync.ai" > /dev/null; then
        echo ""
        echo "🎉 All subdomains are now active!"
        echo "Ready to proceed with Step 3 (Email & Verification setup)"
        break
    fi
    
    echo ""
    echo "Waiting 2 minutes before next check..."
    sleep 120
done