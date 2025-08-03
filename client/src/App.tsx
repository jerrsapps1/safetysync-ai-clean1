import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CopyrightProtection } from "@/components/ui/copyright-protection";
import { CartProvider } from "@/contexts/CartContext";
import Navbar from './components/Navbar';
import { SmoothLoading } from "@/components/ui/smooth-loading";

// Lazy load pages for better code splitting
const LandingPage = lazy(() => import('./pages/landing'));
const Dashboard = lazy(() => import('./pages/dashboard'));
const Workspace = lazy(() => import('./pages/workspace'));
const WorkspaceSimplified = lazy(() => import('./pages/workspace-simplified'));
const AdminDashboard = lazy(() => import('./pages/admin-dashboard'));
const ClientPortal = lazy(() => import('./pages/client-portal'));
const InvoiceManagement = lazy(() => import('./pages/invoice-management'));
const Contact = lazy(() => import('./pages/contact'));
const Pricing = lazy(() => import('./pages/pricing'));
const Resources = lazy(() => import('./pages/resources'));
const Testimonials = lazy(() => import('./pages/testimonials'));

// Loading fallback component
const PageLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <SmoothLoading />
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Router>
            <CopyrightProtection />
            <Toaster />
            
            <div className="font-sans bg-white min-h-screen">
              <Navbar />
              <Suspense fallback={<PageLoadingFallback />}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/workspace" element={<Workspace />} />
                  <Route path="/workspace-simplified" element={<WorkspaceSimplified />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/client-portal" element={<ClientPortal />} />
                  <Route path="/invoices" element={<InvoiceManagement />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/testimonials" element={<Testimonials />} />
                  {/* Add more routes as needed */}
                </Routes>
              </Suspense>
            </div>
          </Router>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
