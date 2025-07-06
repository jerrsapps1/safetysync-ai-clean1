# SafetySync OSHA Compliance Platform

## Overview

SafetySync is a full-stack web application designed to simplify OSHA compliance tracking for businesses. The platform provides automated tracking, centralized database management, and audit-ready reporting to help companies manage employee training and certifications without the stress of manual paperwork.

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

### Development Dependencies
- **Vite**: Fast build tool with HMR
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first styling
- **PostCSS**: CSS processing pipeline

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

## Changelog

Changelog:
- July 06, 2025. Initial setup and landing page implementation