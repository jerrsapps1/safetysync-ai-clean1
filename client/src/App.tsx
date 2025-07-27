import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CopyrightProtection } from "@/components/ui/copyright-protection";
import { CartProvider } from "@/contexts/CartContext";
import Navbar from './components/Navbar';
import LandingPage from './pages/landing';

// Essential pages only
import WorkspaceSimple from './pages/workspace-simple';
import CaseStudiesPage from "@/pages/case-studies";
import PricingPage from "@/pages/pricing";
import ContactPage from "@/pages/contact";
import ClientPortalPage from "@/pages/client-portal";
import HRTeamsPage from "@/pages/hr-teams";
import NotFound from "@/pages/not-found";



function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <CopyrightProtection />
          <Toaster />

          <Router>
            <Routes>
              {/* Simple App Structure - Just Navbar + Landing Page */}
              <Route path="/" element={
                <>
                  <Navbar />
                  <LandingPage />
                </>
              } />
              
              {/* Keep essential routes for functionality */}
              <Route path="/workspace" element={<WorkspaceSimple />} />
              <Route path="/client-portal" element={<ClientPortalPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/case-studies" element={<CaseStudiesPage />} />
              <Route path="/hr-teams" element={<HRTeamsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
