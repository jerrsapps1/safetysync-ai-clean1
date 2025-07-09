# Microsoft 365 SMTP Authentication Setup Guide

## Current Status
- Organization-wide SMTP authentication was enabled
- Still getting error: "SmtpClientAuthentication is disabled for the Tenant"
- May need time to propagate (up to 30 minutes)

## Alternative Authentication Methods

### Option 1: App Password (Recommended)
Instead of using the regular password, Microsoft 365 may require an "App Password":

1. Go to **Users** → **Active users** → **jerry@safetysync.ai**
2. Click **Reset password**
3. Look for **"App passwords"** or **"App-specific passwords"**
4. Generate a new app password for "SafetySync.AI Email Service"
5. Use this app password instead of the regular password

### Option 2: Check Security Defaults
If Security Defaults are enabled, they might block SMTP:

1. Go to **Azure Active Directory** → **Properties**
2. Click **"Manage security defaults"**
3. Check if Security Defaults are **Enabled**
4. If enabled, they might be blocking SMTP authentication

### Option 3: Conditional Access
Check if Conditional Access policies are blocking SMTP:

1. Go to **Azure Active Directory** → **Security** → **Conditional Access**
2. Look for policies that might affect SMTP authentication
3. Add exception for SMTP if needed

## Current Configuration
- **Host**: smtp.office365.com
- **Port**: 587
- **Security**: STARTTLS
- **Username**: jerry@safetysync.ai
- **Password**: [Current password - may need app password]

## Next Steps
1. **Wait 15-30 minutes** for organization setting to propagate
2. **Try app password** if regular password fails
3. **Check security defaults** if still failing
4. **Contact Microsoft Support** if needed

## Test Command
```bash
curl -X POST http://localhost:5000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to": "jerry@safetysync.ai", "subject": "Test", "testType": "welcome"}'
```