# SafetySync.AI Render Deployment - Step by Step

## Step 1: Create PostgreSQL Database

1. In your Render dashboard, click **"New +"** → **"PostgreSQL"**
2. Configure the database:
   - **Name:** `safetysync-db`
   - **Database Name:** `safetysync`
   - **User:** `safetysync`
   - **Region:** Choose closest to your users (Ohio recommended)
   - **Plan:** Free (for testing) or Starter+ (for production)
3. Click **"Create Database"**
4. Wait for database to be created (2-3 minutes)
5. **Copy the External Database URL** - you'll need this for the web service

## Step 2: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository containing SafetySync.AI code
3. Configure the service:
   - **Name:** `safetysync-ai` (or your preferred name)
   - **Environment:** `Node`
   - **Region:** Same as your database
   - **Branch:** `main` (or your deployment branch)
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`

## Step 3: Environment Variables

In the Environment Variables section, add these variables:

### Required Variables:
```
NODE_ENV = production
DATABASE_URL = [paste your PostgreSQL External Database URL from Step 1]
JWT_SECRET = [generate a secure 64-character random string]
```

### For AI Features:
```
OPENAI_API_KEY = sk-[your OpenAI API key]
VITE_LAUNCHDARKLY_CLIENT_ID = [your LaunchDarkly client ID]
```

### For Email Features:
```
BREVO_API_KEY = [your Brevo API key]
EMAIL_USERNAME = [your email address]
EMAIL_PASSWORD = [your email password]
```

### Application Settings:
```
BASE_URL = https://[your-service-name].onrender.com
```

## Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Build the application (`npm run build`)
   - Start the server (`npm start`)

## Step 5: Post-Deployment Setup

1. Once deployed successfully, visit your app URL
2. Run database migrations by accessing the Render shell:
   - Go to your service dashboard
   - Click **"Shell"** tab
   - Run: `npm run db:push`

## Step 6: Verify Deployment

Visit these URLs to confirm everything is working:
- `https://your-app.onrender.com/` - Should show API status
- `https://your-app.onrender.com/health` - Should show health check
- Your main app should load the SafetySync.AI interface

## Quick Environment Variable Generator

### JWT_SECRET Generator:
Run this in your terminal to generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Common Issues & Solutions

**Build Failures:**
- Ensure Node.js version is 20 (check .nvmrc file)
- Verify all dependencies are in package.json
- Check build logs for specific errors

**Database Connection Issues:**
- Verify DATABASE_URL is correct
- Ensure database is in same region as web service
- Check database is running and accessible

**Environment Variable Issues:**
- Double-check all required variables are set
- Ensure no extra spaces in variable values
- Verify API keys are valid and active

Your SafetySync.AI platform includes:
- AI-powered document processing
- OSHA compliance management  
- Employee certification tracking
- Automated email notifications
- Digital wallet cards with QR codes
- Comprehensive reporting system