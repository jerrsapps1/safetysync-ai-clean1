# STEP 2: Add Subdomains in GoDaddy DNS

## Current Status:
✅ safetysync.ai → Working (34.111.179.208)
✅ www.safetysync.ai → Working (CNAME)
❌ app.safetysync.ai → Missing
❌ api.safetysync.ai → Missing  
❌ admin.safetysync.ai → Missing

## What You Need to Do:

### 1. Log into GoDaddy
- Go to: https://account.godaddy.com
- Click "Sign In" and enter your credentials
- Navigate to: "My Products" → "Domains"
- Find "safetysync.ai" and click "DNS" or "Manage DNS"

### 2. Add These 3 DNS Records
Click "Add" or "+" to add each record:

**Record 1:**
```
Type: A
Name: app
Value: 34.111.179.208
TTL: 600 (or 10 minutes)
```

**Record 2:**
```
Type: A
Name: api
Value: 34.111.179.208
TTL: 600
```

**Record 3:**
```
Type: A
Name: admin
Value: 34.111.179.208
TTL: 600
```

### 3. Save Changes
- Click "Save" or "Save Changes"
- DNS propagation takes 5-15 minutes

### 4. Test Your Setup
After 10 minutes, test these URLs:
- https://app.safetysync.ai
- https://api.safetysync.ai
- https://admin.safetysync.ai

## Visual Guide:
In GoDaddy DNS management, you'll see:
- Type: Select "A" from dropdown
- Name: Type the subdomain (app, api, admin)
- Value: Enter the IP address (34.111.179.208)
- TTL: Set to 600 seconds

## After You're Done:
Tell me when you've added all 3 records and I'll help you test them and move to Step 3 (email setup and verification codes).