# Existing CNAME Records Analysis

## Current CNAME Records in GoDaddy

Based on your mention of three existing CNAME records, here's the likely setup:

### Common CNAME Records:
1. **www** → safetysync.ai (redirects www.safetysync.ai to main domain)
2. **app** → [hosting provider] (points app.safetysync.ai to your app server)
3. **api** → [hosting provider] (points api.safetysync.ai to your API server)

## Microsoft 365 CNAME Addition (OPTIONAL)

We **would like to add** this CNAME record for Microsoft 365, but it's optional:

```
Type: CNAME
Name: autodiscover
Value: autodiscover.outlook.com
TTL: 600
```

## CNAME Conflict Resolution

If you can't add the autodiscover CNAME due to existing conflicts:
- **Email will still work perfectly** - autodiscover is only for email client setup
- Users can manually configure Outlook/Apple Mail with these settings:
  - Incoming (IMAP): outlook.office365.com, Port 993, SSL
  - Outgoing (SMTP): smtp.office365.com, Port 587, STARTTLS

## Final DNS Configuration

After adding the Microsoft 365 records, you'll have:

### A Records:
- @ → [Your server IP]

### CNAME Records:
- www → safetysync.ai
- app → [your hosting provider]
- api → [your hosting provider]  
- **autodiscover → autodiscover.outlook.com** (NEW)

### MX Record:
- @ → safetysync-ai.mail.protection.outlook.com (Priority 0)

### TXT Records:
- @ → v=spf1 include:spf.protection.outlook.com -all
- @ → [Google verification code when ready]

## Verification

Once added, you can verify the autodiscover record:
```bash
dig CNAME autodiscover.safetysync.ai
```

Should return: `autodiscover.outlook.com`