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
// @ts-ignore
import Contact from "./pages/contact.jsx";
// @ts-ignore
import ClientPortal from "./pages/client-portal.jsx";
// @ts-ignore
import AdminSupportDashboard from "./pages/admin/support.jsx";
// @ts-ignore
import WorkspaceView from "./pages/workspace-view.jsx";
// @ts-ignore
import InstructorPortal from "./pages/instructor-portal.jsx";
// @ts-ignore
import EmployeeManagement from "./pages/employee-management.jsx";
// @ts-ignore
import UploadTrainingRecord from "./pages/upload-training-record.jsx";
// @ts-ignore
import EmployeeProfile from "./pages/employee-profile.jsx";

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
          <Route path="/workspace-view" component={WorkspaceView} />
          <Route path="/instructor-portal" component={InstructorPortal} />
          <Route path="/employee-management" component={EmployeeManagement} />
          <Route path="/upload-training-record" component={UploadTrainingRecord} />
          <Route path="/employee/:id" component={EmployeeProfile} />
          <Route path="/admin/support" component={AdminSupportDashboard} />
        </Switch>
      </MainLayout>
    </QueryClientProvider>
  );
}