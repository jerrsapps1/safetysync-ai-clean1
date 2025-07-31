// File: src/App.jsx

import React from "react";
import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// @ts-ignore
import MainLayout from "./layouts/MainLayout";

// Pages
import LandingPage from "./pages/landing-replit-ready";
// @ts-ignore
import Features from "./pages/features.jsx";
// @ts-ignore
import HRPage from "./pages/hr-teams.jsx";
// @ts-ignore
import Pricing from "./pages/pricing.jsx";
// @ts-ignore
import CaseStudies from "./pages/case-studies.jsx";
import Contact from "./pages/contact";
import ClientPortal from "./pages/client-portal";
// @ts-ignore
import AdminSupportDashboard from "./pages/admin/support.jsx";

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainLayout>
        <Switch>
          <Route path="/" component={LandingPage} />
          <Route path="/features" component={Features} />
          <Route path="/hr-teams" component={HRPage} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/case-studies" component={CaseStudies} />
          <Route path="/contact" component={Contact} />
          <Route path="/client-portal" component={ClientPortal} />
          <Route path="/admin/support" component={AdminSupportDashboard} />
        </Switch>
      </MainLayout>
    </QueryClientProvider>
  );
}