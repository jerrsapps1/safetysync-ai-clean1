# Microsoft 365 SMTP Authentication Setup

## Current Issue
Your Microsoft 365 tenant has SMTP authentication disabled. Error: "SmtpClientAuthentication is disabled for the Tenant"

## Solution Options

### Option 1: Enable SMTP Authentication (Recommended)
1. Go to: https://admin.microsoft.com
2. Sign in with your admin account
3. Navigate to: **Settings** → **Org settings** → **Services** → **Modern authentication**
4. Look for **SMTP AUTH** and enable it
5. Save settings (takes 5-10 minutes to propagate)

### Option 2: Enable for Specific User
1. Go to: https://admin.microsoft.com
2. Navigate to: **Users** → **Active users**
3. Find and click on `jerry@safetysync.ai`
4. Go to **Mail** tab
5. Look for **SMTP AUTH** and enable it

### Option 3: PowerShell Command (Admin Only)
```powershell
# Connect to Exchange Online
Connect-ExchangeOnline

# Enable SMTP AUTH for specific user
Set-CASMailbox -Identity jerry@safetysync.ai -SmtpClientAuthenticationDisabled $false

# Or enable for entire organization
Set-OrganizationConfig -SmtpClientAuthenticationDisabled $false
```

### Option 4: Alternative Email Service
If you can't enable SMTP AUTH, we can switch to:
- SendGrid API
- Mailgun API
- AWS SES
- Another email service

## Testing After Changes
Once enabled, test with:
```bash
curl -X POST http://localhost:5000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to": "jerry@safetysync.ai", "subject": "Test", "testType": "basic"}'
```

## Current Status
- DNS records: ✅ Configured
- Email service: ✅ Ready
- SMTP auth: ❌ Disabled (needs enabling)
- Credentials: ✅ Configured