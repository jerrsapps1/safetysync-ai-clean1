# Microsoft 365 SMTP Authentication Still Disabled

## Current Status
The error shows: "SmtpClientAuthentication is disabled for the Tenant"

This means SMTP authentication needs to be enabled at the **tenant level** (organization-wide) or for the specific user.

## Solutions to Try:

### Option 1: Enable for Specific User (Recommended)
1. Go to **Users** → **Active users**
2. Find and click **jerry@safetysync.ai**
3. Click the **Mail** tab
4. Look for **"SMTP AUTH"** setting
5. **Enable** it for this specific user

### Option 2: Enable Organization-Wide
1. Go to **Settings** → **Org settings**
2. Click **Services** tab
3. Find **"Modern authentication"**
4. Enable **SMTP AUTH** for the entire organization

### Option 3: PowerShell Command (If available)
```powershell
Set-CASMailbox -Identity jerry@safetysync.ai -SmtpClientAuthenticationDisabled $false
```

## What We Need
The setting "SmtpClientAuthentication" needs to be enabled either:
- For the user jerry@safetysync.ai specifically
- Or for the entire tenant/organization

## Current Error
```
535 5.7.139 Authentication unsuccessful, SmtpClientAuthentication is disabled for the Tenant
```

This confirms SMTP authentication is still disabled and needs to be enabled.