# SafetySync.AI Deployment Guide

## Render Deployment

### Prerequisites
1. GitHub repository with your SafetySync.AI code
2. Render account (render.com)
3. Required API keys (see Environment Variables section)

### Deployment Steps

#### 1. Database Setup
1. In Render Dashboard, create a new PostgreSQL database:
   - **Name:** `safetysync-db`
   - **Database Name:** `safetysync`
   - **User:** `safetysync`
   - **Region:** Choose closest to your users
   - **Plan:** Free (for testing) or Starter (for production)

2. Copy the connection string from the database info page

#### 2. Web Service Setup
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name:** `safetysync-ai`
   - **Environment:** Node
   - **Region:** Same as database
   - **Branch:** `main`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Starter or higher

#### 3. Environment Variables
Set these in the Render environment variables section:

**Required:**
- `NODE_ENV` = `production`
- `DATABASE_URL` = (your PostgreSQL connection string)
- `JWT_SECRET` = (generate a secure 64-character string)

**For AI Features:**
- `OPENAI_API_KEY` = `sk-...` (your OpenAI API key)
- `VITE_LAUNCHDARKLY_CLIENT_ID` = (your LaunchDarkly client ID)

**For Email Features:**
- `BREVO_API_KEY` = (your Brevo API key)
- `EMAIL_USERNAME` = (your email address)
- `EMAIL_PASSWORD` = (your email password)

**Application:**
- `BASE_URL` = `https://your-app-name.onrender.com`

#### 4. First Deployment
1. Click "Create Web Service"
2. Wait for initial deployment (5-10 minutes)
3. Once deployed, run database migrations:
   - In Render shell: `npm run db:push`

#### 5. Custom Domain (Optional)
1. In service settings, add your custom domain
2. Configure DNS records as instructed
3. Update `BASE_URL` environment variable

### Deployment Checklist

**Pre-deployment:**
- [ ] All environment variables configured
- [ ] Database created and connection string copied
- [ ] Repository connected to Render
- [ ] Build and start commands verified

**Post-deployment:**
- [ ] Application loads successfully
- [ ] Database connection working
- [ ] AI document processing functional
- [ ] Email automation working
- [ ] Authentication system operational

### Troubleshooting

**Build Failures:**
- Check Node.js version (should be 20)
- Verify all dependencies in package.json
- Check build logs for specific errors

**Runtime Errors:**
- Verify all environment variables are set
- Check database connection string
- Review application logs in Render dashboard

**Performance Issues:**
- Upgrade to higher plan if needed
- Monitor resource usage in dashboard
- Consider database plan upgrade

### Production Optimizations

1. **Security:**
   - Use strong JWT_SECRET
   - Enable HTTPS (automatic on Render)
   - Configure proper CORS settings

2. **Performance:**
   - Enable Redis for session storage (optional)
   - Configure CDN for static assets
   - Monitor application metrics

3. **Monitoring:**
   - Set up health checks
   - Configure alerts for downtime
   - Monitor database performance

### Support

For deployment issues:
1. Check Render documentation
2. Review application logs
3. Verify environment variables
4. Test database connectivity

Your SafetySync.AI platform includes:
- ✅ AI-powered document processing
- ✅ OSHA compliance management
- ✅ Employee certification tracking
- ✅ Automated email notifications
- ✅ Digital wallet cards with QR codes
- ✅ Comprehensive reporting system