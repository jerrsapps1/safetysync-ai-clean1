# Email Production Setup Guide

## Overview
This guide covers setting up Microsoft 365 email for SafetySync.AI in production.

## Required Environment Variables

Add these to your production environment:

```bash
# Microsoft 365 Email Configuration
EMAIL_USER=noreply@safetysync.ai
EMAIL_PASSWORD=your_app_password_here
EMAIL_FROM=noreply@safetysync.ai

# Additional Email Settings (optional)
EMAIL_REPLY_TO=support@safetysync.ai
EMAIL_DISPLAY_NAME=SafetySync.AI
```

## Microsoft 365 App Password Setup

1. **Login to Microsoft 365 Admin Center**
   - Go to https://admin.microsoft.com
   - Sign in with your admin account

2. **Create App Password**
   - Go to Azure Active Directory → Users
   - Select the user (noreply@safetysync.ai)
   - Go to Authentication → App passwords
   - Generate new app password
   - Copy the password (you won't see it again)

3. **Update Environment Variables**
   - Set `EMAIL_PASSWORD` to the app password
   - Not the regular Microsoft account password

## DNS Records Status Check

After adding DNS records with TTL 600:

### Required Records:
- ✅ **MX Record**: `safetysync-ai.mail.protection.outlook.com` (Priority 0)
- ✅ **SPF Record**: `v=spf1 include:spf.protection.outlook.com -all`
- ✅ **Autodiscover**: `autodiscover.outlook.com` (CNAME)

### Verification:
```bash
# Check MX record
dig MX safetysync.ai

# Check SPF record
dig TXT safetysync.ai

# Check Autodiscover
dig CNAME autodiscover.safetysync.ai
```

## Testing Email Functionality

### 1. DNS Management Interface
- Go to `/dns-management` in your admin panel
- Click "Email Test" tab
- Send test email to verify configuration

### 2. API Testing
```bash
curl -X POST https://safetysync.ai/api/test-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "admin@safetysync.ai",
    "subject": "Production Email Test",
    "message": "Testing email from production environment"
  }'
```

### 3. Expected Response
```json
{
  "success": true,
  "message": "Test email sent successfully to admin@safetysync.ai"
}
```

## Email Templates in Production

The platform uses professional HTML email templates for:
- Welcome emails (trial signup)
- Trial reminder emails
- Support request confirmations
- Certificate generation notifications

## Troubleshooting

### Common Issues:

1. **Connection Failed**
   - Check EMAIL_USER and EMAIL_PASSWORD
   - Verify app password is correct
   - Ensure noreply@safetysync.ai account exists

2. **Authentication Error**
   - Use app password, not regular password
   - Check user has proper permissions

3. **DNS Not Propagated**
   - Wait 15-30 minutes after adding records
   - Check TTL is 600 or higher for GoDaddy

4. **Delivery Issues**
   - Verify SPF record is correct
   - Check DMARC policy
   - Test with different email providers

## Production Monitoring

The email service includes:
- Connection testing on startup
- Error logging for failed emails
- Retry mechanism for temporary failures
- Professional email formatting

## Security Considerations

- App passwords are more secure than regular passwords
- SPF record prevents email spoofing
- DMARC policy handles unauthenticated emails
- All emails sent via Microsoft's infrastructure

## Next Steps

1. Set DNS records to TTL 600
2. Create Microsoft 365 app password
3. Update environment variables
4. Test email functionality
5. Monitor email delivery in production

Once configured, the platform can send:
- Professional welcome emails
- Trial reminder notifications
- Support confirmations
- Certificate generation notices