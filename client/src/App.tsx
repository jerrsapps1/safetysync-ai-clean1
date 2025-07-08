import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CopyrightProtection } from "@/components/ui/copyright-protection";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import AdminPanel from "@/pages/admin";
import TestimonialsPage from "@/pages/testimonials";
import CaseStudiesPage from "@/pages/case-studies";
import PricingPage from "@/pages/pricing";
import DeveloperPortal from "@/pages/developer-portal";
import AnalyticsPage from "@/pages/analytics";
import AnalyticsDashboard from "@/pages/analytics-dashboard";
import UserGuidePage from "@/pages/user-guide";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/admin" component={AdminPanel} />
      <Route path="/testimonials" component={TestimonialsPage} />
      <Route path="/case-studies" component={CaseStudiesPage} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/user-guide" component={UserGuidePage} />
      <Route path="/developers" component={DeveloperPortal} />
      <Route path="/analytics" component={AnalyticsPage} />
      <Route path="/conversion-tracking" component={AnalyticsDashboard} />
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
