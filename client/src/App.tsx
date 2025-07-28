import React from 'react';
import { Router, Route, Switch } from 'wouter';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CopyrightProtection } from "@/components/ui/copyright-protection";
import { CartProvider } from "@/contexts/CartContext";
import Navbar from './components/Navbar';
import LandingPage from './pages/landing';
import Home from './pages/home';
import CaseStudies from './pages/case-studies';
import HRTeams from './pages/hr-teams';
import Pricing from './pages/pricing';
import Contact from './pages/contact';
import Leads from './pages/leads';
import ClientPortal from './pages/client-portal';
import Workspace from './pages/workspace';
import InvoiceManagement from './pages/invoice-management';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <CopyrightProtection />
          <Toaster />
          
          <div className="font-sans min-h-screen">
            <Navbar />
            <Router>
              <Switch>
                <Route path="/" component={LandingPage} />
                <Route path="/home" component={Home} />
                <Route path="/case-studies" component={CaseStudies} />
                <Route path="/hr-teams" component={HRTeams} />
                <Route path="/pricing" component={Pricing} />
                <Route path="/contact" component={Contact} />
                <Route path="/leads" component={Leads} />
                <Route path="/client-portal" component={ClientPortal} />
                <Route path="/workspace" component={Workspace} />
                <Route path="/admin/invoice-management" component={InvoiceManagement} />
                <Route>
                  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-white mb-4">404 - Page Not Found</h1>
                      <p className="text-blue-100 mb-8">The page you're looking for doesn't exist.</p>
                      <a href="/" className="text-white hover:text-blue-200 underline">
                        Return to Home
                      </a>
                    </div>
                  </div>
                </Route>
              </Switch>
            </Router>
          </div>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
