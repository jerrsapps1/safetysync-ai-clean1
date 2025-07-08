# STEP 3: Complete Email & Verification Setup

## Prerequisites:
- All subdomains (app, api, admin) are working
- You have access to GoDaddy DNS management

## Part A: Email Service Setup

### Option 1: Google Workspace (Recommended)
1. Go to https://workspace.google.com
2. Click "Get started"
3. Choose "For my business"
4. Enter domain: safetysync.ai
5. Create admin account: admin@safetysync.ai
6. Follow Google's domain verification steps

### Option 2: GoDaddy Email Forwarding (Free)
1. In GoDaddy account, go to "Email & Office"
2. Set up email forwarding
3. Create: admin@safetysync.ai → forward to your Gmail
4. Add support@safetysync.ai → forward to your Gmail

## Part B: Get Verification Codes

### Google Search Console:
1. Visit: https://search.google.com/search-console
2. Click "Add property"
3. Enter: safetysync.ai
4. Choose "Domain" verification method
5. Copy the TXT record value (starts with "google-site-verification=")

### Facebook Business Manager:
1. Visit: https://business.facebook.com
2. Go to "Brand Safety" → "Domains"
3. Click "Add" and enter: safetysync.ai
4. Copy the verification code

### Microsoft Bing Webmaster:
1. Visit: https://www.bing.com/webmasters
2. Click "Add a site"
3. Enter: https://safetysync.ai
4. Choose "Add site via DNS"
5. Copy the verification code

## Part C: Add DNS Records

### Add these TXT records in GoDaddy:

**Google Verification:**
```
Type: TXT
Name: @
Value: google-site-verification=[YOUR_CODE]
```

**Facebook Verification:**
```
Type: TXT
Name: @
Value: facebook-domain-verification=[YOUR_CODE]
```

**Bing Verification:**
```
Type: TXT
Name: @
Value: MS=[YOUR_CODE]
```

**SPF Email Security:**
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.google.com ~all
```

**DMARC Email Authentication:**
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:admin@safetysync.ai
```

## Part D: Complete Verification

### Return to each service:
1. **Google Search Console**: Click "Verify"
2. **Facebook Business**: Click "Verify domain"
3. **Bing Webmaster**: Click "Verify"

## Part E: Test Everything

### Domain Tests:
- https://safetysync.ai ✅
- https://www.safetysync.ai ✅
- https://app.safetysync.ai ✅
- https://api.safetysync.ai ✅
- https://admin.safetysync.ai ✅

### Email Tests:
- Send test email to admin@safetysync.ai
- Check that it arrives in your inbox

### Verification Tests:
- Google Search Console shows "Verified"
- Facebook Business shows domain verified
- Bing Webmaster shows site verified

## Success Checklist:
- [ ] Subdomains working (app, api, admin)
- [ ] Email service configured
- [ ] Google verification complete
- [ ] Facebook verification complete
- [ ] Bing verification complete
- [ ] SPF record added
- [ ] DMARC record added
- [ ] All tests passing

## Timeline:
- DNS propagation: 5-15 minutes
- Email setup: 10-30 minutes
- Verification codes: 5-10 minutes each
- Total time: 30-60 minutes

## Next Steps After Completion:
1. Set up Google Analytics
2. Configure Facebook Pixel
3. Add Microsoft Clarity
4. Set up email automation
5. Configure SSL monitoring