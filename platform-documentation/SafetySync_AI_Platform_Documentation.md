# SafetySync.AI Platform Documentation

**Generated:** 2025-07-26

## Overview

SafetySync.AI is an advanced AI-powered enterprise safety management platform that transforms workforce document processing and OSHA compliance through intelligent extraction, verification, and proactive risk management.

## Platform Architecture


### Landing & Public Pages


#### Landing Page
- **URL:** `/`
- **Description:** Hero section with SafetySync.AI branding, features showcase, call-to-action buttons for trial signup and demo requests

#### Contact Page
- **URL:** `/contact`
- **Description:** Professional contact form, company information, support channels

#### Case Studies
- **URL:** `/case-studies`
- **Description:** Customer success stories demonstrating OSHA compliance improvements

#### Pricing Plans
- **URL:** `/pricing`
- **Description:** Subscription tiers, feature comparisons, ROI calculator

#### HR Teams Page
- **URL:** `/hr`
- **Description:** HR-specific features including employee training management, compliance documentation, digital certificates


### Authentication System


#### Client Portal
- **URL:** `/client-portal`
- **Description:** Secure login interface with username/password authentication, remember me option, password strength validation

#### Standalone Dashboard
- **URL:** `/dashboard`
- **Description:** Authentication-protected comprehensive dashboard with compliance tracking, AI clone detection, collaboration tools


### Main Workspace Platform


#### User Guide
- **URL:** `/workspace?tab=user-guide`
- **Description:** Comprehensive platform documentation, feature explanations, tutorial content (First Tab)

#### Workspace View
- **URL:** `/workspace?tab=unified-dashboard`
- **Description:** Main compliance dashboard with customizable widgets, employee statistics, safety alerts, training progress (Second Tab)

#### Company Profile
- **URL:** `/workspace?tab=company-profile`
- **Description:** Company setup and configuration, industry selection, contact information management

#### Employee Management
- **URL:** `/workspace?tab=employee-management`
- **Description:** Employee database with 200+ records, department analytics, bulk operations, CSV export, certificate tracking


### Training & Compliance Features


#### Training Document Hub
- **URL:** `/workspace?tab=training-document-hub`
- **Description:** AI-powered document upload and processing, training record management, certificate generation

#### OSHA Compliance Manager
- **URL:** `/workspace?tab=osha-compliance-manager`
- **Description:** Comprehensive OSHA compliance tracking, training matrix, certification monitoring, audit readiness

#### Employee Insights
- **URL:** `/workspace?tab=employee-insights`
- **Description:** Analytics dashboard with department performance, hiring trends, compliance scores, AI-powered insights


### Additional Resources


#### User Guide Standalone
- **URL:** `/user-guide`
- **Description:** Comprehensive platform documentation accessible outside the workspace



## Key Features

- AI-Powered Document Processing with OpenAI GPT-4o integration
- Real-time Compliance Tracking and Monitoring
- Employee Certificate Management with QR Code verification
- Training Matrix and OSHA Standards Alignment
- Mobile-Responsive Design with Adaptive UI Components
- Advanced Security with Authentication and Rate Limiting
- Customizable Dashboard Widgets with Drag-and-Drop Layout
- Bulk Employee Operations and CSV Export
- Department Analytics and Performance Tracking
- AI-Powered Contextual Help System
- Professional Blue Gradient Theme Consistency
- Comprehensive Audit Trail and Reporting

## Technical Stack


### Frontend

- React.js with TypeScript for type safety
- Vite for fast development and optimized builds
- Tailwind CSS with custom blue gradient theming
- Shadcn/UI components for consistent design
- Wouter for lightweight client-side routing
- TanStack Query for server state management
- React Hook Form with Zod validation
- Framer Motion for smooth animations

### Backend

- Node.js with Express.js framework
- TypeScript for full-stack type safety
- PostgreSQL with Drizzle ORM
- Neon Database for serverless PostgreSQL
- JWT-based authentication with secure sessions
- Rate limiting and security middleware
- OpenAI API integration for AI processing
- Comprehensive error handling and logging

### Database Schema

- Users table with authentication and profile data
- Employees table with department and compliance tracking
- Certificates table with expiration monitoring
- Training sessions and completion tracking
- Audit logs and security event tracking
- Lead capture system for trial and demo requests


## Navigation Structure

The platform follows a clean, intuitive navigation structure:

1. **User Guide** (First Tab) - Primary entry point for documentation
2. **Workspace View** (Second Tab) - Main compliance dashboard
3. **Company Profile** - Setup and configuration
4. **Employee Management** - Comprehensive employee tracking
5. **Training Documents** - AI-powered document processing
6. **OSHA Compliance** - Compliance management and reporting

## Security Features

- JWT-based authentication with secure sessions
- Rate limiting and brute force protection
- Input sanitization and XSS prevention
- Comprehensive audit logging
- Role-based access control (admin/user tiers)

## Color Theme

Consistent blue gradient theme throughout the platform:
- Primary: `from-blue-600 via-blue-500 to-blue-400`
- Glass morphism cards: `bg-black/20 backdrop-blur-sm`
- Text: White on colored backgrounds, dark on light backgrounds

---

*This documentation provides a comprehensive overview of the SafetySync.AI platform structure, features, and technical implementation.*