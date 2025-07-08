# Step 3: Microsoft 365 Email Setup for SafetySync.AI

## Current Status
✅ **Domain**: safetysync.ai configured and DNS resolving  
✅ **Email Service**: Microsoft 365 purchased through GoDaddy  
⏳ **DNS Records**: Need to be added to complete email setup  

## Required Actions in GoDaddy DNS

### 1. Add MX Record (CRITICAL - Required for email delivery)
```
Type: MX
Name: @
Value: safetysync-ai.mail.protection.outlook.com
Priority: 0
TTL: 3600
```

### 2. Add SPF Record (CRITICAL - Required for email authentication)
```
Type: TXT
Name: @
Value: v=spf1 include:spf.protection.outlook.com -all
TTL: 300
```

### 3. Add Autodiscover Record (RECOMMENDED - For email client setup)
```
Type: CNAME
Name: autodiscover
Value: autodiscover.outlook.com
TTL: 300
```

## How to Add These Records in GoDaddy

1. **Log into GoDaddy** → Account → My Products → Domains
2. **Find safetysync.ai** → Click "DNS" button
3. **For MX Record**:
   - Click "Add" → Select "MX"
   - Host: @ (leave blank or use @)
   - Points to: safetysync-ai.mail.protection.outlook.com
   - Priority: 0
   - TTL: 1 Hour
4. **For SPF TXT Record**:
   - Click "Add" → Select "TXT"
   - Host: @ (leave blank or use @)
   - TXT Value: v=spf1 include:spf.protection.outlook.com -all
   - TTL: 5 minutes
5. **For Autodiscover CNAME**:
   - Click "Add" → Select "CNAME"
   - Host: autodiscover
   - Points to: autodiscover.outlook.com
   - TTL: 5 minutes

## Email Addresses You Can Create

Once DNS is configured, you can create:
- admin@safetysync.ai
- support@safetysync.ai
- info@safetysync.ai
- sales@safetysync.ai
- noreply@safetysync.ai (for automated platform emails)

## Microsoft 365 Admin Center Setup

1. **Access Admin Center**: https://admin.microsoft.com
2. **Add Domain**: Add safetysync.ai as a custom domain
3. **Verify Domain**: Microsoft will provide verification steps
4. **Create Users**: Add email accounts for your team
5. **Configure Email**: Set up email routing and security

## Testing Email Setup

After adding DNS records (wait 15-30 minutes for propagation):

1. **Test Email Delivery**: Send test email to admin@safetysync.ai
2. **Check SPF**: Send email from admin@safetysync.ai to Gmail (check headers)
3. **Verify MX**: Use tools like mxtoolbox.com to verify MX record
4. **Test Client Setup**: Configure Outlook/Apple Mail using autodiscover

## Platform Integration

Your SafetySync.AI platform can send emails through Microsoft 365:

```javascript
// SMTP Configuration for platform emails
const smtpConfig = {
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'noreply@safetysync.ai',
    pass: 'your-app-password' // Use app password, not main password
  }
};
```

## Important Notes

- **Priority 0** means highest priority for mail delivery
- **SPF -all** is strict (rejects unauthorized senders)
- **Propagation Time**: DNS changes take 15-30 minutes
- **DKIM Records**: Microsoft 365 will provide these later in setup

## Troubleshooting

If emails aren't working:
1. Check DNS propagation: https://whatsmydns.net
2. Verify MX record: https://mxtoolbox.com
3. Check SPF record: https://dmarcian.com/spf-survey/
4. Review Microsoft 365 admin center for any warnings

## Next Steps After Email Setup

1. Create admin@safetysync.ai account
2. Configure email forwarding rules
3. Set up email signatures
4. Test automated platform emails
5. Configure DMARC policy for enhanced security