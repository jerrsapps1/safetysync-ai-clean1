# Microsoft 365 SMTP Authentication Navigation Guide

## Current Location: Multi-Factor Authentication Settings
You're in the MFA section, but we need to find the SMTP authentication settings.

## Navigation Steps:

### Option 1: Find Modern Authentication Settings
1. From your current admin center page, look for:
   - **Settings** (in the left navigation)
   - **Org settings** 
   - **Services** tab
   - Look for **"Modern authentication"** or **"SMTP AUTH"**

### Option 2: Direct Navigation
1. Go to: https://admin.microsoft.com/Adminportal/Home#/Settings/Services
2. Look for "Modern authentication"
3. Enable SMTP AUTH

### Option 3: User-Specific Enable
1. Go to **Users** → **Active users**
2. Click on **jerry@safetysync.ai**
3. Click **Mail** tab
4. Look for **"SMTP AUTH"** setting
5. Enable it

## What You're Looking For:
- A setting called "SMTP AUTH" or "SMTP Client Authentication"
- It might be under "Modern authentication" or "Email security"
- The setting is currently DISABLED (causing our 535 5.7.139 error)

## Expected Result:
Once enabled, our email service will be able to authenticate and send emails through Microsoft 365.

## Current Status:
- ✅ DNS records configured
- ✅ Email service ready
- ✅ Credentials set up
- ❌ SMTP authentication disabled (this is what we need to fix)