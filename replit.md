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
- **July 06, 2025** - Added Legal Terms and Conditions System:
  - Created comprehensive service agreement with professional contract language
  - Implemented terms acceptance workflow that triggers before account creation
  - Added database schema for tracking terms acceptance (termsAccepted, termsAcceptedAt fields)
  - Built enterprise-grade cancellation policy: 30-day data migration period, no prorated refunds
  - Created scrollable legal document with subscription details, billing terms, and data policies
  - Integrated terms dialog with trial signup and demo request flows
  - Added contract establishment that creates binding agreement upon acceptance
  - Implemented GDPR-compliant data retention and export policies
  - Enhanced enterprise readiness with volume discounts and 10,000 employee capacity
- **July 06, 2025** - Built Comprehensive Enterprise Developer Portal:
  - Created full API documentation with authentication, endpoints, and SDKs
  - Added comprehensive REST API reference with code examples in 4 languages (JavaScript, Python, PHP, C#)
  - Built interactive API testing playground with real-time endpoint testing
  - Implemented developer tools including Postman collections and GitHub integration
  - Added webhook documentation with real-time event notifications
  - Created API status dashboard with uptime monitoring and performance metrics
  - Built integration examples for HRIS, training platforms, and automated reporting
  - Added enterprise SDK libraries with official support for major programming languages
- **July 06, 2025** - Implemented Advanced Enterprise Analytics Dashboard:
  - Built comprehensive compliance analytics with department-level insights
  - Created real-time training metrics with completion tracking and performance analysis
  - Added incident trend analysis with safety metrics and hazard reporting
  - Implemented cost savings analysis showing ROI from compliance automation
  - Built risk management dashboard with vulnerability tracking and audit results
  - Added interactive charts using Recharts for data visualization
  - Created certification distribution analytics with progress tracking
  - Implemented filtering and export capabilities for enterprise reporting
- **July 06, 2025** - Created Enterprise Security Operations Center:
  - Built real-time security monitoring dashboard with threat detection
  - Implemented AI-powered security analytics with intelligent threat classification
  - Added geographic threat tracking with country-based risk analysis
  - Created comprehensive vulnerability management with severity categorization
  - Built compliance framework tracking (SOC 2, ISO 27001, GDPR, HIPAA, PCI DSS)
  - Added active security alert system with real-time incident response
  - Implemented system health monitoring with component-level uptime tracking
  - Created AI-powered security recommendations with actionable insights
- **July 06, 2025** - Implemented Tier-Based Promo Code System for Maximum Profitability:
  - Restricted promo codes by customer tier to protect profit margins
  - Essential Tier: Generous discounts (35-40% off) for customer acquisition
  - Professional Tier: Moderate discounts (15-25% off) for growth companies
  - Enterprise Tier: Conservative discounts (15% off, $500 fixed) for high-value clients
  - Enterprise Plus: No promo codes, volume discounts only (10-20% automatic)
  - Added tier indicator showing customers their qualifying tier and available codes
  - Implemented smart validation preventing tier misuse and margin erosion
  - Enhanced pricing calculator with real-time tier-appropriate promo suggestions
- **July 06, 2025** - Refined Service Model and Automated Audit Review System:
  - Removed compliance consulting and custom training development services
  - Transformed audit support into automated monthly compliance gap analysis
  - Created Audit Settings dashboard tab for customer control and opt-out capability
  - Implemented automated review system with configurable scheduling and reporting
  - Added comprehensive audit review settings: schedule, format, recipients, and scope options
  - Enabled customers to customize review parameters and disable service if desired
  - Updated pricing calculator to reflect "Automated Audit Review" at $99/month
  - Focused service offering on automated platform features rather than manual consulting
  - Moved custom branding to Essential plan for future customer profile identification
- **July 06, 2025** - Implemented Complete Feature Alignment and AI-Powered Quick Actions:
  - Added certification document upload functionality to employees tab
  - Created comprehensive custom branding settings with logo upload and color customization
  - Built multi-location management interface with cross-location analytics
  - Implemented functional CSV export for employee certification data
  - Added real-time risk assessment dashboard with AI recommendations and risk scoring
  - Created AI-powered quick action sidebar with intelligent automation assistance
  - Built contextual AI chat for compliance guidance, training schedules, and regulatory updates
  - Added smart insights system with trend analysis and actionable recommendations
  - Integrated automated training assignment, certification monitoring, and report generation
  - All pricing plan features now fully implemented and aligned with promotional promises
- **July 06, 2025** - Created Comprehensive User Guide and Navigation Alignment:
  - Built complete step-by-step user guide covering all platform features
  - Organized guides by plan level with searchable categories (Getting Started, Daily Tasks, Advanced, Troubleshooting)
  - Added detailed walkthroughs for setup, collaboration, AI features, reporting, and API integration
  - Reorganized dashboard tab order to match user guide's logical learning progression
  - Added in-app navigation hints directing users through optimal setup sequence
  - Created plan-specific feature filtering and quick start recommendations
  - Aligned app navigation flow with recommended user journey for maximum efficiency
- **July 06, 2025** - Integrated Authentic OSHA Training Content:
  - Replaced basic syllabi with official OSHA regulatory training content from 29 CFR 1910 & 1926
  - Added comprehensive training modules: Fall Protection, HAZWOPER, HazCom, Hearing Conservation, PPE, First Aid/CPR, LOTO, Respiratory Protection
  - Included detailed syllabi with hands-on demonstrations, practical evaluations, and knowledge reviews
  - Added target audience specifications and recertification requirements for each training
  - Created annual training calendar template for systematic compliance management
  - Enhanced training cards with regulation citations, duration, audience, and compliance verification
  - Integrated month-by-month scheduling system with comprehensive OSHA requirements
- **July 06, 2025** - Added Equipment Operation Training Subjects:
  - Integrated Power Industrial Trucks training (29 CFR 1910.178) with 4-hour practical evaluation for forklift/PIT operators
  - Added Material Handling Equipment training (29 CFR 1910.176/1926.602) with 3-hour demonstration for warehouse staff
  - Implemented Earth-moving Equipment training (29 CFR 1926.602) with 6-hour field demonstration for heavy equipment operators
  - Updated annual training calendar to include equipment operation training in September-November schedule
  - Added comprehensive syllabi covering vehicle inspection, load capacity, stability principles, and emergency procedures
  - Implemented 3-year recertification cycles for specialized equipment operators to maintain compliance
- **July 06, 2025** - Added Training Evaluation Storage Requirements:
  - Implemented training evaluation storage guidelines in Training tab and User Guide
  - Added requirement to store evaluations with training documents for OSHA standards compliance
  - Specified requirements for Power Industrial Trucks, Fall Protection, Earth-moving Equipment practical evaluations
  - Recommended yearly evaluation uploads as best practice even when not required
  - Enhanced compliance documentation workflow for comprehensive audit readiness
- **July 06, 2025** - Integrated Evaluation Alerts and Calendar Notifications:
  - Added evaluation reminders to dashboard "Upcoming Deadlines & Evaluation Reminders" section
  - Implemented separate tracking for required evaluations vs. recommended annual uploads
  - Enhanced AI recommendations to prioritize missing practical evaluations for audit compliance
  - Updated annual training calendar to include evaluation requirements for September-December
  - Added AI Quick Actions for scanning missing evaluation documentation
  - Integrated evaluation alerts into AI insights with high-confidence notifications for compliance gaps
- **July 06, 2025** - Added Professional Certificate Generation and Printable Wallet Card Services:
  - Created comprehensive add-on services section in pricing page ($15/certificate, $8/wallet card)
  - Added dedicated "Certificates" tab to dashboard with full service ordering interface
  - Implemented certificate generation service with high-resolution PDF (300 DPI), custom branding, OSHA-compliant format
  - Built printable wallet card service optimized for CR80 format (3.375" x 2.125") and 30mil PVC cards
  - Added card printer compatibility specifications for client-side printing setup
  - Integrated volume discount structure (15% for 10-50 items, 25% for 51-100, 35% for 100+)
  - Created order history tracking and bulk pricing calculator for enterprise clients
  - Platform generates professional files, clients print with their own equipment and PVC card stock
  - Enhanced service descriptions to match professional examples with centered layouts, CFR compliance references, contact hours, unique certificate numbers
  - Added sample output previews showing professional certificate format and front/back wallet card designs
  - Integrated equipment authorization lists and detailed compliance statements for wallet cards
  - Created preview functionality with eye icons for customers to see exact output quality before ordering
- **July 06, 2025** - Implemented Essential Plan Certificate Generation Benefits:
  - Added certificate and card generation to Essential plan with 90-day free period
  - After 90 days, Essential plan users pay only $0.50 per certificate or card (added to monthly billing)
  - Updated pricing calculator to show "Certificate & card generation (FREE first 90 days, then $0.50 per item)"
  - Restructured pricing page to highlight Essential plan benefits alongside premium stand-alone services
  - Added automatic billing integration for usage-based certificate generation charges
  - Updated dashboard certificate generation buttons to reflect new $0.50 pricing with 90-day free period notice
  - Created tiered pricing structure: Essential ($0.50 after 90 days), Premium Stand-alone ($15), Wallet Cards ($8 or $0.50 with Essential)
  - Enhanced value proposition for safety professionals by making certificates accessible from day one
- **July 06, 2025** - Extended 90-Day Certificate Generation Period to All Subscription Tiers:
  - Added certificate and card generation benefits (FREE first 90 days, then $0.50 per item) to Professional, Enterprise, and Enterprise Plus plans
  - Updated all pricing tier feature lists to include certificate generation with consistent 90-day free period
  - Modified pricing page messaging to reflect "All subscription plans include 90-day free certificate generation"
  - Updated billing notices to apply to all subscription tiers rather than just Essential plan
  - Enhanced dashboard certificate generation pricing notes to specify "any subscription plan" instead of Essential only
  - Unified certificate generation value proposition across all subscription levels for maximum accessibility
  - Maintained same professional quality and card printer compatibility across all tiers
- **July 06, 2025** - Removed Volume Discount Structure:
  - Eliminated bulk pricing discounts (15%, 25%, 35%) from certificate and card generation services
  - Removed volume discount sections from pricing page and dashboard certificate tabs
  - Simplified pricing to flat rate: $0.50 per certificate/card after 90-day free period for all subscription plans
  - Streamlined pricing structure focuses on usage-based billing without complexity of volume tiers
  - Removed standalone pricing options ($15 certificates, $8 wallet cards) to focus exclusively on subscription-based services
  - All certificate generation now integrated into subscription plans with consistent 90-day free period across all tiers
  - Updated printer terminology from "HID printer" to "card printer" for broader compatibility
  - Added file format specification (.efi) for certificate and wallet card generation

## Changelog

Changelog:
- July 06, 2025. Initial setup and landing page implementation