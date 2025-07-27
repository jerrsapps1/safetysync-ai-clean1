# SafetySync.AI - Enterprise OSHA Compliance Platform

An advanced AI-powered enterprise safety management platform that transforms workforce document processing and compliance through intelligent extraction, verification, and proactive risk management.

## 🚀 Features

- **AI-Powered Document Processing**: OpenAI GPT-4o integration for intelligent training document analysis
- **Real-time Compliance Tracking**: Automated OSHA compliance monitoring and reporting
- **Digital Wallet Cards**: QR code-enabled digital certification cards for employees
- **Enterprise Dashboard**: Comprehensive analytics and reporting dashboard
- **Email Automation**: Automated compliance notifications and reporting
- **Feature Flag Management**: LaunchDarkly integration for A/B testing and feature rollouts
- **Advanced Analytics**: Microsoft Clarity integration for user behavior tracking

## 🛠 Technology Stack

### Frontend
- **React.js** with TypeScript for robust frontend development
- **Tailwind CSS** for responsive and modern UI design
- **Vite** for fast development and optimized builds
- **TanStack Query** for server state management
- **React Hook Form** with Zod validation

### Backend
- **Node.js** with Express.js framework
- **PostgreSQL** with Drizzle ORM for data management
- **JWT Authentication** with session management
- **OpenAI GPT-4o** for AI document processing
- **LaunchDarkly** for feature flag management

### Infrastructure
- **Neon Database** for PostgreSQL hosting
- **Brevo API** for email automation
- **Microsoft Clarity** for analytics
- **Comprehensive security** with rate limiting and input sanitization

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- OpenAI API key
- Brevo API key (for email features)
- LaunchDarkly client ID (for feature flags)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/safetysync-ai.git
   cd safetysync-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure these required environment variables:
   ```
   DATABASE_URL=your_postgresql_connection_string
   OPENAI_API_KEY=your_openai_api_key
   BREVO_API_KEY=your_brevo_api_key
   VITE_LAUNCHDARKLY_CLIENT_ID=your_launchdarkly_client_id
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 📚 Project Structure

```
safetysync-ai/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utility libraries
│   │   └── hooks/          # Custom React hooks
├── server/                 # Backend Express application
│   ├── routes.ts           # API route definitions
│   └── storage.ts          # Database interface
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Database schema definitions
└── scripts/                # Utility scripts
```

## 🔧 Development

### Database Migrations
```bash
npm run db:push    # Push schema changes to database
npm run db:studio  # Open Drizzle Studio for database management
```

### Code Quality
```bash
npm run type-check  # TypeScript type checking
npm run lint        # ESLint code linting
```

## 🌟 Key Components

### AI Document Processing
- Multi-layered PDF processing with advanced AI extraction
- Intelligent OSHA standard detection and compliance mapping
- Automated certificate generation from training documents

### Compliance Management
- Real-time training matrix tracking
- Automated retraining notifications
- Audit-ready documentation generation

### Digital Certification System
- QR code-enabled digital wallet cards
- Mobile-responsive certificate verification
- Integration with employee management system

## 📈 Analytics & Monitoring

- **Microsoft Clarity**: User behavior tracking and heatmaps
- **LaunchDarkly**: Feature flag management and A/B testing
- **Custom Analytics**: Subscription tracking and user engagement metrics

## 🔒 Security Features

- JWT-based authentication with secure session management
- Rate limiting and input sanitization
- CSRF protection and security headers
- Audit logging for security events

## 🚀 Deployment

The application is designed for deployment on platforms like:
- Replit (primary deployment platform)
- Vercel
- Netlify
- AWS/Azure/GCP

### Environment Setup for Production
Ensure all environment variables are configured in your deployment platform.

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Contributing

This is a private project. Contact the maintainers for contribution guidelines.

## 📞 Support

For support and inquiries:
- Email: hello@safetysync.ai
- Website: https://safetysync.ai

---

© 2025 SafetySync.AI. All rights reserved.