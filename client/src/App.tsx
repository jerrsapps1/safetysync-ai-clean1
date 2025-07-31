// File: src/App.tsx

import React from "react";
import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// @ts-ignore
import MainLayout from "./layouts/MainLayout";
// @ts-ignore
import WorkspaceLayout from "./layouts/WorkspaceLayout";

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
// @ts-ignore
import Contact from "./pages/contact.jsx";
// @ts-ignore
import ClientPortal from "./pages/client-portal.jsx";
// @ts-ignore
import AdminSupportDashboard from "./pages/admin/support.jsx";
// @ts-ignore
import InstructorPortal from "./pages/instructor-portal.jsx";

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
      <Switch>
        <Route path="/workspace/:rest*" component={WorkspaceLayout} />
        <Route>
          <MainLayout>
            <Switch>
              <Route path="/" component={LandingPage} />
              <Route path="/features" component={Features} />
              <Route path="/hr-teams" component={HRPage} />
              <Route path="/pricing" component={Pricing} />
              <Route path="/case-studies" component={CaseStudies} />
              <Route path="/contact" component={Contact} />
              <Route path="/client-portal" component={ClientPortal} />
              <Route path="/instructor-portal" component={InstructorPortal} />
              <Route path="/admin/support" component={AdminSupportDashboard} />
            </Switch>
          </MainLayout>
        </Route>
      </Switch>
    </QueryClientProvider>
  );
}