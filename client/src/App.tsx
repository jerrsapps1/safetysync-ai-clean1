import React from 'react';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CopyrightProtection } from "@/components/ui/copyright-protection";
import { CartProvider } from "@/contexts/CartContext";
import Navbar from './components/Navbar';
import LandingPage from './pages/landing';


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <CopyrightProtection />
          <Toaster />
          
          <div className="font-sans bg-white min-h-screen">
            <Navbar />
            <LandingPage />
          </div>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
