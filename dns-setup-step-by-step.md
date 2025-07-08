# SafetySync.AI DNS Setup - Step by Step Guide

## STEP 1: Find Your Server Information

### What You Need to Find:
Your Replit deployment gives you a URL that looks like:
- `https://safetysync-ai--yourusername.repl.co`
- `https://your-repl-name.yourusername.repl.co`

### How to Find It:
1. **Look at your browser address bar** when viewing your SafetySync.AI app
2. **Copy the full URL** (this is what we'll use)
3. **Remove the https://** part - we just need the domain

### Example:
If your URL is: `https://safetysync-ai--john.repl.co`
Your CNAME target is: `safetysync-ai--john.repl.co`

---

## STEP 2: Get Your Domain Registrar Access

### Where You Bought safetysync.ai:
- **GoDaddy**: Go to domains.godaddy.com
- **Namecheap**: Go to namecheap.com
- **Cloudflare**: Go to dash.cloudflare.com
- **Google Domains**: Go to domains.google.com
- **Other**: Log into wherever you bought the domain

### What You Need:
- Login credentials for your domain registrar
- Access to DNS management section

---

## STEP 3: Set Up Basic DNS Records

### Primary Domain Records:
```
Type: CNAME
Name: @ (or leave blank)
Value: [YOUR_REPLIT_URL]
TTL: 300 (5 minutes)
```

### WWW Subdomain:
```
Type: CNAME
Name: www
Value: [YOUR_REPLIT_URL] 
TTL: 300
```

### App Subdomain:
```
Type: CNAME
Name: app
Value: [YOUR_REPLIT_URL]
TTL: 300
```

---

## STEP 4: Test Your Setup

### After adding DNS records:
1. **Wait 5-10 minutes** for DNS propagation
2. **Test in browser**: 
   - Try `http://safetysync.ai`
   - Try `http://www.safetysync.ai`
   - Try `http://app.safetysync.ai`

### Check DNS propagation:
- Go to: `https://dnschecker.org`
- Enter: `safetysync.ai`
- Check if it points to your Replit URL

---

## STEP 5: Set Up Email Service

### Option A: Google Workspace (Recommended)
1. Go to `https://workspace.google.com`
2. Sign up for Google Workspace
3. Add `safetysync.ai` as your domain
4. Follow Google's verification steps

### Option B: Simple Email Forwarding
Many domain registrars offer email forwarding:
1. Set up `admin@safetysync.ai` to forward to your Gmail
2. This is free and works for basic needs

---

## STEP 6: Get Verification Codes

### Google Search Console:
1. Go to `https://search.google.com/search-console`
2. Add property: `safetysync.ai`
3. Choose "Domain" verification
4. Copy the TXT record code

### Facebook Business:
1. Go to `https://business.facebook.com`
2. Brand Safety → Domains
3. Add `safetysync.ai`
4. Copy verification code

### Microsoft Bing:
1. Go to `https://www.bing.com/webmasters`
2. Add site: `safetysync.ai`
3. Choose DNS verification
4. Copy verification code

---

## STEP 7: Add Verification Records

### Add these TXT records to your DNS:
```
Type: TXT
Name: @
Value: google-site-verification=[CODE_FROM_GOOGLE]
TTL: 300
```

```
Type: TXT
Name: @
Value: facebook-domain-verification=[CODE_FROM_FACEBOOK]
TTL: 300
```

```
Type: TXT
Name: @
Value: MS=[CODE_FROM_BING]
TTL: 300
```

---

## STEP 8: Final Testing

### Test all domains:
- `https://safetysync.ai`
- `https://www.safetysync.ai`
- `https://app.safetysync.ai`

### Verify search engines:
- Complete verification in Google Search Console
- Complete verification in Bing Webmaster Tools
- Complete verification in Facebook Business Manager

---

## Current Status Checklist:
- [ ] Found my Replit URL
- [ ] Accessed domain registrar
- [ ] Added basic CNAME records
- [ ] Tested domain in browser
- [ ] Set up email service
- [ ] Got verification codes
- [ ] Added verification records
- [ ] Completed final testing

---

## Need Help?
If you get stuck on any step, let me know:
1. What step you're on
2. What you see vs. what you expected
3. Any error messages

I'll help you troubleshoot each step!