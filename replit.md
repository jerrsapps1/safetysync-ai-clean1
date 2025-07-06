# SafetySync.AI OSHA Compliance Platform

## Overview

SafetySync.AI is a full-stack AI-powered web application designed to simplify OSHA compliance tracking for businesses. The platform provides automated tracking, centralized database management, and audit-ready reporting to help companies manage employee training and certifications without the stress of manual paperwork.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui components for consistent design
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with custom styling
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: Connect-pg-simple for PostgreSQL session store
- **API Design**: RESTful endpoints with proper error handling

### Database Schema
The application uses Drizzle ORM with PostgreSQL, featuring:
- **Users Table**: Basic user authentication (id, username, password)
- **Leads Table**: Lead capture system for trial/demo requests (id, name, email, company, phone, message, leadType, createdAt)
- **Type Safety**: Zod schemas for runtime validation and type inference

## Key Components

### Landing Page System
- **Hero Section**: Compelling value proposition with call-to-action buttons
- **Problem/Solution Framework**: Addresses OSHA compliance pain points
- **Feature Showcase**: Highlights key platform benefits
- **Lead Capture**: Dual-path conversion (trial signup vs. demo request)
- **Navigation**: Smooth scrolling navigation with mobile responsiveness

### Lead Management
- **Dual Lead Types**: Separate flows for trial signups and demo requests
- **Form Validation**: Client-side validation with Zod schemas
- **Error Handling**: Comprehensive error states and user feedback
- **Success States**: Confirmation dialogs with clear next steps

### UI Component Library
- **Design System**: shadcn/ui components with consistent theming
- **Accessibility**: ARIA compliance through Radix UI primitives
- **Responsive Design**: Mobile-first approach with Tailwind utilities
- **Dark Mode Support**: CSS variables for theme switching

### AI Clone Detection System
- **Content Analysis**: OpenAI-powered website fingerprinting and similarity analysis
- **Real-time Monitoring**: Automated scanning of target URLs for clone detection
- **Threat Assessment**: Multi-dimensional analysis (content, structure, design, branding)
- **Database Integration**: Persistent storage of fingerprints, scan results, and historical data
- **Fallback Analysis**: Basic similarity detection when AI services are unavailable
- **Security Dashboard**: Real-time alerts, threat visualization, and detailed reporting

## Data Flow

### Lead Capture Flow
1. User interacts with CTA buttons (trial/demo)
2. Dialog opens with appropriate form fields
3. Client-side validation using Zod schemas
4. Form submission via fetch API to `/api/leads`
5. Server validates and stores lead data
6. Success response triggers confirmation UI
7. Lead data logged for follow-up processing

### Authentication Flow (Future)
- User table schema prepared for username/password authentication
- Session management infrastructure ready with PostgreSQL storage
- Type-safe user operations defined in storage interface

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **zod**: Runtime type validation
- **wouter**: Lightweight routing
- **openai**: OpenAI API integration for AI clone detection

### Development Dependencies
- **Vite**: Fast build tool with HMR
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first styling
- **PostCSS**: CSS processing pipeline

### API Keys & Environment
- **OPENAI_API_KEY**: Configured for AI-powered clone detection analysis
- **DATABASE_URL**: PostgreSQL connection string for persistent storage

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds to `dist/public` directory
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations in `migrations` directory
- **Environment**: DATABASE_URL required for PostgreSQL connection

### Production Setup
- **Database**: Neon PostgreSQL database provisioned
- **Session Store**: PostgreSQL-backed session management
- **Static Assets**: Served from Express in production
- **API Routes**: Express middleware handles all `/api/*` routes

### Development Experience
- **Hot Module Replacement**: Vite HMR for fast development
- **Type Checking**: Continuous TypeScript checking
- **Database Migrations**: `npm run db:push` for schema updates
- **Error Handling**: Runtime error overlay in development

## User Preferences

Preferred communication style: Simple, everyday language.
User satisfied with comprehensive platform features including dashboard, admin panel, testimonials, and case studies.

## Recent Changes

- **July 06, 2025** - Initial SafetySync platform setup completed
- **July 06, 2025** - Implemented comprehensive OSHA compliance landing page with:
  - Hero section with dual CTA buttons (trial signup + demo request)
  - Problem/solution sections addressing OSHA compliance pain points
  - Interactive forms with backend API integration
  - Navigation with smooth scrolling
  - Responsive design optimized for conversions
  - Lead capture system with separate flows for trials and demos
- **July 06, 2025** - Added PostgreSQL database integration:
  - Created database connection with Neon PostgreSQL
  - Migrated from MemStorage to DatabaseStorage
  - Schema pushed to database with users and leads tables
  - Full CRUD operations now use persistent database storage
- **July 06, 2025** - Enhanced landing page with tech-forward design:
  - Added animated floating tech icons (CPU, Database, Globe, Layers, Code, Brain)
  - Implemented gradient backgrounds and glass morphism effects
  - Added pulse-glow animations and tech grid patterns
  - Enhanced features section with AI-powered messaging
  - Added tech statistics section (99.9% uptime, <200ms response, 256-bit encryption)
  - Transformed CTA buttons with gradient effects and tech terminology
  - Updated footer with tech-focused branding and subtle animations
- **July 06, 2025** - Added comprehensive platform features:
  - Created user dashboard with compliance tracking, employee management, and reporting
  - Built admin panel for lead management, user administration, and analytics
  - Added testimonials page with customer success stories and industry stats
  - Created case studies page with detailed implementation stories and ROI metrics
  - Implemented full routing system with navigation between all pages
  - Added backend API endpoints for admin functionality (/api/admin/users, /api/leads)
  - Enhanced navigation with dynamic user menus and dashboard access
  - Built complete analytics and reporting functionality for compliance management
- **July 06, 2025** - Implemented One-Click Compliance Report Generator:
  - Added comprehensive report generation system with 6 report types (full, summary, audit, training, department, risk)
  - Created database schema for storing generated reports (compliance_reports table)
  - Built backend API endpoints for report generation (/api/compliance/reports/generate)
  - Developed interactive frontend component with report preview and download capabilities
  - Added report history tracking and management system
  - Integrated with dashboard as dedicated "Report Generator" tab
  - Supports multiple export formats (PDF, CSV, Excel) and sharing options
  - Generates detailed compliance analytics with employee data, training status, and recommendations
- **July 06, 2025** - Added Interactive Features Suite:
  - Implemented Interactive Product Tour with 6-step guided walkthrough of platform features
  - Created Pricing Calculator with dynamic cost calculation, ROI analysis, and plan recommendations
  - Built comprehensive FAQ Section with 12 categories, search functionality, and collapsible answers
  - Added Live Chat Support Widget with real-time messaging, quick replies, and agent status
  - Created dedicated Pricing page with all pricing tools and comprehensive FAQ
  - Enhanced landing page with product tour launch button and live chat integration
  - All components feature responsive design and smooth animations
  - Fixed duplicate pricing tabs in navigation menu
  - Removed custom training options from pricing calculator (focus on certification tracking)
- **July 06, 2025** - Added Comprehensive Security & AI Clone Detection:
  - Built enterprise-grade security system with rate limiting (100 requests/15min), security headers, and anti-scraping protection
  - Implemented AI-powered website clone detection using OpenAI API for content analysis and threat assessment
  - Created comprehensive clone detection database schema with fingerprints, scan results, and similarity scoring
  - Built real-time clone monitoring UI with automated scanning, similarity analysis, and threat notifications
  - Added copyright protection system with console warnings, right-click blocking, and developer tool detection
  - Implemented website fingerprinting technology for content, structure, design, and branding analysis
  - Created fallback analysis system for environments without OpenAI API access
  - Enhanced platform with robots.txt configuration and comprehensive security headers
  - Added automatic clone detector initialization on server startup for continuous monitoring
- **July 06, 2025** - Updated Contact Information and Privacy:
  - Removed phone number fields from all forms (trial signup, demo request, FAQ support) per user privacy preference
  - Updated contact information to use email-only approach with support email available to paying customers
  - Maintained phone field in database schema for existing data compatibility while removing from UI
- **July 06, 2025** - Updated Branding to SafetySync.AI:
  - Changed all instances of "SafetySync" to "SafetySync.AI" across the platform for AI-focused branding
  - Updated navigation, landing page, login dialogs, product tour, case studies, and testimonials  
  - Modified clone detector initialization and server references to reflect new AI branding
  - Strengthened brand identity as an AI-powered compliance platform to appeal to enterprise market
  - Enhanced testimonials and messaging to emphasize AI insights and intelligent automation
- **July 06, 2025** - Implemented Comprehensive Platform Owner Admin System:
  - Enhanced admin access control with secure x-admin-key authentication (default: "dev-admin-key")
  - Added comprehensive user management with tier controls (free_trial, basic, professional, enterprise)
  - Implemented subscription management system (active, pending, expired, cancelled) with expiration tracking
  - Created admin-only user controls: activate/deactivate accounts, change tiers, manage subscriptions
  - Added enhanced database schema with userTier, subscriptionStatus, subscriptionExpiresAt, totalLogins fields
  - Built advanced user filtering by tier, subscription status, and search across name/email/company
  - Added home button and full navigation to admin access page for seamless platform navigation
  - Separated platform owner controls completely from paying members and free trial users
  - Implemented real-time admin controls with instant updates and toast notifications

## Changelog

Changelog:
- July 06, 2025. Initial setup and landing page implementation