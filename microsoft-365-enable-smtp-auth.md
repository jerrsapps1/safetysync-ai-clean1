# Enable SMTP Authentication for jerry@safetysync.ai

## Quick Fix (5 minutes)

Since you're the admin, you can enable SMTP authentication:

### Method 1: Enable for Your User Only
1. Go to: https://admin.microsoft.com
2. Sign in with your admin account
3. Navigate to: **Users** → **Active users**
4. Click on **jerry@safetysync.ai**
5. Click **Mail** tab
6. Look for **SMTP AUTH** and **enable** it
7. Click **Save changes**

### Method 2: Enable for Entire Organization
1. Go to: https://admin.microsoft.com
2. Navigate to: **Settings** → **Org settings** → **Services**
3. Find **Modern authentication**
4. Enable **SMTP AUTH**
5. Save (takes 5-10 minutes to propagate)

## Current Status
- ✅ DNS records configured
- ✅ Email service ready
- ✅ Credentials configured
- ❌ SMTP auth disabled (needs enabling)

## After Enabling
Test with:
```bash
curl -X POST http://localhost:5000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to": "jerry@safetysync.ai", "subject": "Test", "testType": "welcome"}'
```

## Why This Happens
Microsoft 365 disables SMTP authentication by default for security. This is normal for business accounts.