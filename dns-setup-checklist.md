# SafetySync.AI DNS Setup Checklist

## Step 1: Get Your Server Information

### Replit Deployment IP
Your Replit deployment will provide you with:
- **Production URL**: `https://[your-repl-name].[your-username].repl.co`
- **Custom Domain Setup**: Available in Replit's deployment settings

### To Get Your Server IP:
1. Go to your Replit deployment dashboard
2. Navigate to "Domains" or "Custom Domain" section
3. Copy the provided IP address or CNAME target

## Step 2: Update DNS Records

### Critical Records to Update:

**A Records (Replace YOUR_SERVER_IP):**
```
safetysync.ai          A    [YOUR_REPLIT_IP]
app.safetysync.ai      A    [YOUR_REPLIT_IP]
api.safetysync.ai      A    [YOUR_REPLIT_IP]
admin.safetysync.ai    A    [YOUR_REPLIT_IP]
```

**Or use CNAME if Replit provides a hostname:**
```
safetysync.ai          CNAME    [your-repl-name].[your-username].repl.co
app.safetysync.ai      CNAME    [your-repl-name].[your-username].repl.co
api.safetysync.ai      CNAME    [your-repl-name].[your-username].repl.co
admin.safetysync.ai    CNAME    [your-repl-name].[your-username].repl.co
```

## Step 3: Set Up Email Service

### Option A: Google Workspace (Recommended)
1. Sign up for Google Workspace
2. Verify domain ownership
3. Update MX records:
```
@    MX    1     ASPMX.L.GOOGLE.COM
@    MX    5     ALT1.ASPMX.L.GOOGLE.COM
@    MX    5     ALT2.ASPMX.L.GOOGLE.COM
@    MX    10    ALT3.ASPMX.L.GOOGLE.COM
@    MX    10    ALT4.ASPMX.L.GOOGLE.COM
```

### Option B: Use Gmail with Custom Domain
Update SPF record:
```
@    TXT    "v=spf1 include:_spf.google.com ~all"
```

## Step 4: Get Verification Codes

### Google Search Console
1. Go to https://search.google.com/search-console
2. Add property: safetysync.ai
3. Choose "Domain" verification
4. Copy the TXT record value

### Facebook Domain Verification
1. Go to Facebook Business Manager
2. Navigate to Brand Safety → Domains
3. Add safetysync.ai
4. Copy the verification code

### Microsoft Bing Webmaster Tools
1. Go to https://www.bing.com/webmasters
2. Add site: safetysync.ai
3. Choose DNS verification
4. Copy the verification code

## Step 5: SSL Certificate Setup

### Let's Encrypt (Free)
Replit handles this automatically for custom domains

### Cloudflare (Recommended)
1. Sign up for Cloudflare
2. Add safetysync.ai as a site
3. Update nameservers to Cloudflare's
4. Enable "Full (strict)" SSL mode

## Step 6: Testing Your Setup

### DNS Propagation Check
Use these tools to verify:
- https://dnschecker.org/
- https://www.whatsmydns.net/
- Command: `dig safetysync.ai`

### SSL Certificate Check
- https://www.ssllabs.com/ssltest/
- https://www.digicert.com/help/

## Step 7: Update Application Configuration

### Environment Variables
```bash
DOMAIN_NAME=safetysync.ai
APP_DOMAIN=app.safetysync.ai
API_DOMAIN=api.safetysync.ai
ADMIN_DOMAIN=admin.safetysync.ai
```

## Common Issues & Solutions

### DNS Not Propagating
- Wait 24-48 hours for full propagation
- Check TTL settings (use 300 seconds during migration)
- Clear local DNS cache

### SSL Certificate Issues
- Ensure DNS records point to correct server
- Check certificate includes all subdomains
- Verify certificate authority is trusted

### Email Not Working
- Check MX record priority values
- Verify SPF record syntax
- Test with mail-tester.com

## Next Steps After DNS Setup

1. **Test all subdomains** work correctly
2. **Set up monitoring** for uptime and SSL
3. **Configure backup systems**
4. **Set up automated SSL renewal**
5. **Implement security headers**
6. **Add performance monitoring**

---

**Quick Start Command:**
```bash
# Test your DNS setup
dig safetysync.ai
dig app.safetysync.ai
dig api.safetysync.ai
```

**Status Check:**
- [ ] Server IP obtained
- [ ] DNS records updated
- [ ] Email service configured
- [ ] Verification codes added
- [ ] SSL certificate active
- [ ] All subdomains working
- [ ] Monitoring set up