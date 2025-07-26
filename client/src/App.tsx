import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CopyrightProtection } from "@/components/ui/copyright-protection";
import { CartProvider } from "@/contexts/CartContext";

import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import LandingPageSimple from "@/pages/landing-simple";
import Dashboard from "@/pages/dashboard";

import WorkspacePage from "@/pages/workspace";
import WorkspaceSimplified from "@/pages/workspace-simplified";
import WorkspaceBasic from "@/pages/workspace-basic";
import AdminPanel from "@/pages/admin";
import AdminDashboard from "@/pages/admin-dashboard";
import TestimonialsPage from "@/pages/testimonials";
import CaseStudiesPage from "@/pages/case-studies";
import PricingPage from "@/pages/pricing";
import CertificateServicesPage from "@/pages/certificate-services";
import DeveloperPortal from "@/pages/developer-portal";
import AnalyticsPage from "@/pages/analytics";
import AnalyticsDashboard from "@/pages/analytics-dashboard";
import EmailPreviewPage from "@/pages/email-preview";
import ABTestingDashboard from "@/pages/ab-testing-dashboard";
import SEOBlogPage from "@/pages/seo-blog";
import BlogPostPage from "@/pages/blog-post";
import SitemapPage from "@/pages/sitemap";
import LeadMagnetsPage from "@/pages/lead-magnets";
import UserGuidePage from "@/pages/user-guide";
import DNSManagementPage from "@/pages/dns-management";
import BackupRecoveryPage from "@/pages/backup-recovery";
import SystemHealthPage from "@/pages/system-health";
import IncidentResponsePage from "@/pages/incident-response";
import OperationsDashboardPage from "@/pages/operations-dashboard";
import SafetyTrendsPage from "@/pages/safety-trends";
import ContactPage from "@/pages/contact";
import VerifyEmailPage from "@/pages/verify-email";
import UploadFormPage from "@/pages/upload-form";
import DashboardRecordsPage from "@/pages/dashboard-records";
import HelpdeskPage from "@/pages/helpdesk";
import ClientPortalPage from "@/pages/client-portal";
import HRTeamsPage from "@/pages/hr-teams";
import AuthTest from "@/pages/auth-test";
import PublicEmployeeCertificates from "@/components/PublicEmployeeCertificates";
import { SkeletonDemo } from "@/components/ui/skeleton-demo";
import SidebarDemoPage from "@/pages/sidebar-demo";
import DownloadDocsPage from "@/pages/download-docs";
import AdminEmailPage from "@/pages/admin-email";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/landing-simple" element={<LandingPageSimple />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/workspace" element={<WorkspacePage />} />
      <Route path="/workspace-basic" element={<WorkspaceBasic />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/industry-research" element={<TestimonialsPage />} />
      <Route path="/case-studies" element={<CaseStudiesPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/certificate-services" element={<CertificateServicesPage />} />
      <Route path="/user-guide" element={<UserGuidePage />} />
      <Route path="/developers" element={<DeveloperPortal />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/conversion-tracking" element={<AnalyticsDashboard />} />
      <Route path="/email-automation" element={<EmailPreviewPage />} />
      <Route path="/ab-testing" element={<ABTestingDashboard />} />
      <Route path="/blog" element={<SEOBlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />

      <Route path="/sitemap" element={<SitemapPage />} />
      <Route path="/dns-management" element={<DNSManagementPage />} />
      <Route path="/backup-recovery" element={<BackupRecoveryPage />} />
      <Route path="/system-health" element={<SystemHealthPage />} />
      <Route path="/incident-response" element={<IncidentResponsePage />} />
      <Route path="/operations" element={<OperationsDashboardPage />} />
      <Route path="/safety-trends" element={<SafetyTrendsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/upload" element={<UploadFormPage />} />
      <Route path="/dashboard-records" element={<DashboardRecordsPage />} />
      <Route path="/helpdesk" element={<HelpdeskPage />} />
      <Route path="/client-portal" element={<ClientPortalPage />} />
      <Route path="/hr" element={<HRTeamsPage />} />
      <Route path="/auth-test" element={<AuthTest />} />
      <Route path="/employee-certs/:qrCodeData" element={<PublicEmployeeCertificates />} />
      <Route path="/skeleton-demo" element={<SkeletonDemo />} />
      <Route path="/sidebar-demo" element={<SidebarDemoPage />} />
      <Route path="/download-docs" element={<DownloadDocsPage />} />
      <Route path="/admin-email" element={<AdminEmailPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <CopyrightProtection />
          <Toaster />

          <Router>
            <AppRouter />
          </Router>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
