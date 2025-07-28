import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { SafetySyncIcon } from '@/components/ui/safetysync-icon';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <SafetySyncIcon className="w-8 h-8 text-white" />
              <span className="text-xl font-bold text-white">SafetySync.AI</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/case-studies" className={`transition-colors ${location === '/case-studies' ? 'text-blue-100' : 'text-white hover:text-blue-100'}`}>
              Case Studies
            </Link>
            <Link href="/hr-teams" className={`transition-colors ${location === '/hr-teams' ? 'text-blue-100' : 'text-white hover:text-blue-100'}`}>
              For HR Teams
            </Link>
            <Link href="/pricing" className={`transition-colors ${location === '/pricing' ? 'text-blue-100' : 'text-white hover:text-blue-100'}`}>
              Pricing
            </Link>
            <Link href="/contact" className={`transition-colors ${location === '/contact' ? 'text-blue-100' : 'text-white hover:text-blue-100'}`}>
              Contact
            </Link>
            <Link href="/client-portal">
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Client Login
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-blue-100 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-blue-600/95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/case-studies"
                className={`block px-3 py-2 transition-colors ${location === '/case-studies' ? 'text-blue-100' : 'text-white hover:text-blue-100'}`}
                onClick={() => setIsOpen(false)}
              >
                Case Studies
              </Link>
              <Link
                href="/hr-teams"
                className={`block px-3 py-2 transition-colors ${location === '/hr-teams' ? 'text-blue-100' : 'text-white hover:text-blue-100'}`}
                onClick={() => setIsOpen(false)}
              >
                For HR Teams
              </Link>
              <Link
                href="/pricing"
                className={`block px-3 py-2 transition-colors ${location === '/pricing' ? 'text-blue-100' : 'text-white hover:text-blue-100'}`}
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/contact"
                className={`block px-3 py-2 transition-colors ${location === '/contact' ? 'text-blue-100' : 'text-white hover:text-blue-100'}`}
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/client-portal"
                className="block px-3 py-2"
                onClick={() => setIsOpen(false)}
              >
                <Button 
                  variant="outline" 
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Client Login
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}