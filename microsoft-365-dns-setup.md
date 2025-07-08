# Microsoft 365 Email DNS Setup for SafetySync.AI

## Overview
Your GoDaddy domain (safetysync.ai) is configured to use Microsoft 365 email services. This guide provides the specific DNS records needed for optimal email delivery and security.

## Required DNS Records for Microsoft 365

### 1. MX Record (Mail Exchange)
```
Type: MX
Name: @
Value: safetysync-ai.mail.protection.outlook.com
Priority: 0
TTL: 3600
```
**Purpose**: Routes email to Microsoft 365 servers

### 2. SPF Record (Email Authentication)
```
Type: TXT
Name: @
Value: v=spf1 include:spf.protection.outlook.com -all
TTL: 300
```
**Purpose**: Prevents email spoofing and improves deliverability

### 3. DKIM Records (Email Signing)
You'll need to add these once Microsoft 365 provides them:
```
Type: CNAME
Name: selector1._domainkey
Value: selector1-safetysync-ai._domainkey.safetysyncai.onmicrosoft.com
TTL: 300

Type: CNAME
Name: selector2._domainkey
Value: selector2-safetysync-ai._domainkey.safetysyncai.onmicrosoft.com
TTL: 300
```
**Purpose**: Digitally signs outgoing emails for authenticity

### 4. DMARC Record (Email Policy)
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:admin@safetysync.ai
TTL: 300
```
**Purpose**: Defines policy for handling unauthenticated emails

### 5. Autodiscover Record (Optional but Recommended)
```
Type: CNAME
Name: autodiscover
Value: autodiscover.outlook.com
TTL: 300
```
**Purpose**: Automatically configures email clients

## Email Addresses You Can Create

With Microsoft 365 through GoDaddy, you can create professional email addresses like:
- admin@safetysync.ai
- support@safetysync.ai
- info@safetysync.ai
- sales@safetysync.ai
- security@safetysync.ai

## Next Steps

1. **Add the MX and SPF records immediately** - These are essential for email delivery
2. **Wait for Microsoft 365 setup** - DKIM records will be provided by Microsoft
3. **Test email delivery** - Send test emails to verify everything works
4. **Add DMARC record** - For enhanced security once MX and SPF are working

## Email Integration with SafetySync.AI Platform

Your platform can send emails through Microsoft 365 using:
- **SMTP Settings**: smtp.office365.com:587 (TLS)
- **Authentication**: OAuth2 or app passwords
- **From Address**: Any configured email address (e.g., noreply@safetysync.ai)

## Monitoring and Troubleshooting

- **Email Delivery**: Monitor Microsoft 365 admin center for delivery reports
- **DNS Propagation**: Use tools like whatsmydns.net to verify record propagation
- **SPF/DKIM Status**: Check email headers for authentication results

## GoDaddy DNS Management

To add these records in GoDaddy:
1. Log into your GoDaddy account
2. Go to Domain Manager
3. Click "DNS" next to safetysync.ai
4. Add each record type with the exact values above
5. Save changes and wait for propagation (15-30 minutes)

## Important Notes

- **Priority 0** for MX record means highest priority
- **TTL 3600** for MX gives stability, 300 for others allows quick changes
- **SPF -all** is strict; use ~all if you need more flexibility during testing
- **DMARC p=quarantine** is recommended for production; use p=none for testing