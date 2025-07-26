import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CopyrightProtection } from "@/components/ui/copyright-protection";
import { AchievementNotificationManager } from "@/components/achievements/DynamicAchievementNotification";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";

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

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />

      <Route path="/workspace" component={WorkspacePage} />
      <Route path="/workspace-basic" component={WorkspaceBasic} />
      <Route path="/admin" component={AdminPanel} />
      <Route path="/admin-dashboard" component={AdminDashboard} />
      <Route path="/industry-research" component={TestimonialsPage} />
      <Route path="/case-studies" component={CaseStudiesPage} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/certificate-services" component={CertificateServicesPage} />
      <Route path="/user-guide" component={UserGuidePage} />
      <Route path="/developers" component={DeveloperPortal} />
      <Route path="/analytics" component={AnalyticsPage} />
      <Route path="/conversion-tracking" component={AnalyticsDashboard} />
      <Route path="/email-automation" component={EmailPreviewPage} />
      <Route path="/ab-testing" component={ABTestingDashboard} />
      <Route path="/blog" component={SEOBlogPage} />
      <Route path="/blog/:slug" component={BlogPostPage} />

      <Route path="/sitemap" component={SitemapPage} />
      <Route path="/dns-management" component={DNSManagementPage} />
      <Route path="/backup-recovery" component={BackupRecoveryPage} />
      <Route path="/system-health" component={SystemHealthPage} />
      <Route path="/incident-response" component={IncidentResponsePage} />
      <Route path="/operations" component={OperationsDashboardPage} />
      <Route path="/safety-trends" component={SafetyTrendsPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/verify-email" component={VerifyEmailPage} />
      <Route path="/upload" component={UploadFormPage} />
      <Route path="/dashboard-records" component={DashboardRecordsPage} />
      <Route path="/helpdesk" component={HelpdeskPage} />
      <Route path="/client-portal" component={ClientPortalPage} />
      <Route path="/hr" component={HRTeamsPage} />
      <Route path="/auth-test" component={AuthTest} />
      <Route path="/employee-certs/:qrCodeData" component={PublicEmployeeCertificates} />
      <Route path="/skeleton-demo" component={SkeletonDemo} />
      <Route path="/sidebar-demo" component={SidebarDemoPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CopyrightProtection />
        <Toaster />
        <AchievementNotificationManager />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
