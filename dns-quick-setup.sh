#!/bin/bash

# SafetySync.AI DNS Quick Setup Script
# This script helps you gather the information needed for DNS setup

echo "=== SafetySync.AI DNS Setup Assistant ==="
echo ""

# Check if domain is registered
echo "1. Checking domain registration..."
dig safetysync.ai | grep -q "ANSWER SECTION" && echo "✓ Domain is registered" || echo "⚠ Domain may not be registered yet"

echo ""
echo "2. Current DNS Status:"
echo "   Primary Domain: $(dig +short safetysync.ai | head -1)"
echo "   WWW Subdomain: $(dig +short www.safetysync.ai | head -1)"
echo "   App Subdomain: $(dig +short app.safetysync.ai | head -1)"
echo "   API Subdomain: $(dig +short api.safetysync.ai | head -1)"

echo ""
echo "3. Required Information to Gather:"
echo ""
echo "   📋 REPLIT DEPLOYMENT INFO:"
echo "   - Go to your Replit deployment dashboard"
echo "   - Navigate to 'Domains' or 'Custom Domain' section"
echo "   - Copy the IP address or CNAME target"
echo "   - Example: your-repl-name.your-username.repl.co"
echo ""

echo "   📧 EMAIL SERVICE SETUP:"
echo "   - Recommended: Google Workspace (workspace.google.com)"
echo "   - Alternative: Use existing Gmail with custom domain"
echo "   - Get MX records from your email provider"
echo ""

echo "   🔍 VERIFICATION CODES:"
echo "   - Google Search Console: https://search.google.com/search-console"
echo "   - Facebook Business: https://business.facebook.com"
echo "   - Bing Webmaster: https://www.bing.com/webmasters"
echo ""

echo "4. Next Steps:"
echo "   1. Gather the information above"
echo "   2. Update dns-records-template.json with your values"
echo "   3. Apply DNS changes through your domain registrar"
echo "   4. Wait 24-48 hours for propagation"
echo "   5. Test all subdomains"
echo ""

echo "5. Testing Commands:"
echo "   dig safetysync.ai"
echo "   dig app.safetysync.ai"
echo "   dig api.safetysync.ai"
echo "   curl -I https://safetysync.ai"
echo ""

echo "6. SSL Certificate Check:"
echo "   openssl s_client -connect safetysync.ai:443 -servername safetysync.ai"
echo ""

echo "For detailed instructions, see: dns-setup-checklist.md"
echo "For complete DNS records, see: dns-records-template.json"
echo ""
echo "=== End of DNS Setup Assistant ==="