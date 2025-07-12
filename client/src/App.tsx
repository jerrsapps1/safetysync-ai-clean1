import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CopyrightProtection } from "@/components/ui/copyright-protection";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import WorkspacePage from "@/pages/workspace";
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
import HelpdeskPage from "@/pages/helpdesk";
import { SkeletonDemo } from "@/components/ui/skeleton-demo";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/workspace" component={WorkspacePage} />
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
      <Route path="/resources" component={LeadMagnetsPage} />
      <Route path="/sitemap" component={SitemapPage} />
      <Route path="/dns-management" component={DNSManagementPage} />
      <Route path="/backup-recovery" component={BackupRecoveryPage} />
      <Route path="/system-health" component={SystemHealthPage} />
      <Route path="/incident-response" component={IncidentResponsePage} />
      <Route path="/operations" component={OperationsDashboardPage} />
      <Route path="/safety-trends" component={SafetyTrendsPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/helpdesk" component={HelpdeskPage} />
      <Route path="/skeleton-demo" component={SkeletonDemo} />
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
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
