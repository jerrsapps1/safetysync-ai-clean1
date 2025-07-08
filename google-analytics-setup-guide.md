# Google Analytics Setup Guide for SafetySync.AI

## Step 1: Create Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com)
2. Click "Get started today" or "Start measuring"
3. Sign in with your Google account (or create one if needed)

## Step 2: Set Up Your Property

1. Click "Create Account"
2. Fill in account details:
   - Account name: "SafetySync.AI"
   - Data sharing settings: (choose based on your preferences)

3. Click "Next" and create a property:
   - Property name: "SafetySync.AI Website"
   - Reporting time zone: Your timezone
   - Currency: USD (or your preferred currency)

## Step 3: Set Up Data Stream

1. Choose "Web" as your platform
2. Enter your website details:
   - Website URL: Your Replit domain (e.g., https://your-repl-name.replit.app)
   - Stream name: "SafetySync.AI Main Site"

3. Click "Create stream"

## Step 4: Get Your Measurement ID

After creating the stream, you'll see your **Measurement ID** which looks like:
```
G-XXXXXXXXXX
```

This is what you need! Copy this ID.

## Step 5: Add ID to Your SafetySync.AI Platform

1. Open your Replit project
2. Go to the "Secrets" tab in the left sidebar
3. Add a new secret:
   - Key: `VITE_GA_MEASUREMENT_ID`
   - Value: Your measurement ID (e.g., G-XXXXXXXXXX)

## Step 6: Update Your Code

The tracking code will automatically use your measurement ID from the environment variable. No code changes needed!

## Verification

Once set up, you can verify tracking is working by:
1. Visiting your landing page
2. Going to Google Analytics → Reports → Realtime
3. You should see your visit appear in real-time

## Important Notes

- It may take 24-48 hours for full data to appear in Google Analytics
- The measurement ID starts with "G-" (not "UA-" which is the old version)
- Make sure to use the VITE_ prefix so the ID is available in your frontend code

## Alternative: Quick Test Setup

If you want to test immediately, you can temporarily add the ID directly to your code:
1. Open `client/index.html`
2. Replace `YOUR_GA_MEASUREMENT_ID` with your actual ID
3. Remember to remove it and use environment variables for production!