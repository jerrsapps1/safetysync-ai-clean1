# DNS Records Setup Guide - SafetySync.AI

## Step-by-Step Instructions for GoDaddy

### 1. Log into GoDaddy DNS Management
1. Go to [GoDaddy DNS Management](https://dcc.godaddy.com/manage/dns)
2. Find your domain: `safetysync.ai`
3. Click "Manage DNS"

### 2. Add MX Record (CRITICAL)
1. Click "Add" button
2. Select "MX" from the dropdown
3. Fill in:
   - **Name**: @ (leave as @ or blank)
   - **Value**: `safetysync-ai.mail.protection.outlook.com`
   - **Priority**: 0
   - **TTL**: 600 seconds (10 minutes)
4. Click "Save"

### 3. Add SPF Record (CRITICAL)
1. Click "Add" button
2. Select "TXT" from the dropdown
3. Fill in:
   - **Name**: @ (leave as @ or blank)
   - **Value**: `v=spf1 include:spf.protection.outlook.com -all`
   - **TTL**: 600 seconds (10 minutes)
4. Click "Save"

### 4. Add Autodiscover Record (RECOMMENDED)
1. Click "Add" button
2. Select "CNAME" from the dropdown
3. Fill in:
   - **Name**: autodiscover
   - **Value**: `autodiscover.outlook.com`
   - **TTL**: 600 seconds (10 minutes)
4. Click "Save"

## What You'll See After Adding Records

Your DNS records will look like this:

### A Records:
- @ → [Your server IP]

### CNAME Records:
- sip → sipdir.online.lync.com ✓ (existing)
- www → safetysync.ai ✓ (existing)
- _domainconnect → _domainconnect.gd.domaincontrol.com ✓ (existing)
- **autodiscover → autodiscover.outlook.com** ✅ (NEW)

### MX Record:
- **@ → safetysync-ai.mail.protection.outlook.com (Priority 0)** ✅ (NEW)

### TXT Records:
- **@ → v=spf1 include:spf.protection.outlook.com -all** ✅ (NEW)

## DNS Propagation Timeline

- **5-15 minutes**: Records visible in most locations
- **15-30 minutes**: Full global propagation
- **Up to 2 hours**: Maximum propagation time

## Testing Your Setup

After adding the records, test them using:
1. Go to `/dns-management` in your SafetySync.AI admin panel
2. Click on "Email Test" tab
3. Use the testing tools to verify:
   - MX record resolution
   - SPF record validation
   - Autodiscover functionality

## Professional Email Addresses Ready

Once active, these email addresses will work:
- admin@safetysync.ai
- support@safetysync.ai
- noreply@safetysync.ai

## Next Steps After DNS Setup

1. **Create Microsoft 365 App Password** for platform integration
2. **Configure email automation** in platform settings
3. **Test email sending** through the platform
4. **Set up email templates** for customer communications

Your SafetySync.AI platform will have full professional email capabilities!