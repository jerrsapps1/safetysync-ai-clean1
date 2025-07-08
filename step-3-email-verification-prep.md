# STEP 3: Email Service & Verification Setup

## After Step 2 is Complete:

### Email Service Options:

**Option A: Google Workspace (Recommended)**
- Professional email: admin@safetysync.ai
- Calendar, Drive, and business tools
- Cost: $6/month per user
- Setup: https://workspace.google.com

**Option B: Email Forwarding (Free)**
- Forward admin@safetysync.ai to your Gmail
- Available through GoDaddy email forwarding
- Good for basic needs

### Verification Codes You'll Need:

**Google Search Console:**
1. Go to: https://search.google.com/search-console
2. Add property: safetysync.ai
3. Choose "Domain" verification
4. Copy the TXT record code

**Facebook Business Manager:**
1. Go to: https://business.facebook.com
2. Brand Safety → Domains
3. Add safetysync.ai
4. Copy verification code

**Microsoft Bing Webmaster:**
1. Go to: https://www.bing.com/webmasters
2. Add site: safetysync.ai
3. Choose DNS verification
4. Copy verification code

### Security Records to Add:

**SPF Record (Email Security):**
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.google.com ~all
```

**DMARC Record (Email Authentication):**
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:admin@safetysync.ai
```

## Ready for Step 3?
Once your subdomains are working, we'll:
1. Set up email service
2. Get verification codes
3. Add security records
4. Test everything