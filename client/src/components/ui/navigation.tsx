import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, User } from "lucide-react";
import { SafetySyncIcon } from "@/components/ui/safetysync-icon";
import { Link } from "wouter";

interface NavigationProps {
  onTrialClick: () => void;
  onDemoClick: () => void;
  onLoginClick: () => void;
}

export function Navigation({ onTrialClick, onDemoClick, onLoginClick }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <SafetySyncIcon size={32} className="mr-2 md:mr-3" />
              <span className="text-lg md:text-xl font-bold text-blue-800">SafetySync.AI</span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-blue-600 hover:text-blue-800 hover:bg-gray-100/50 px-3 py-2 text-sm font-medium transition-colors rounded-md"
              >
                Features
              </button>
              <a 
                href="/industry-research"
                className="text-blue-600 hover:text-blue-800 hover:bg-gray-100/50 px-3 py-2 text-sm font-medium transition-colors rounded-md"
              >
                Industry Research
              </a>
              <a 
                href="/case-studies"
                className="text-blue-600 hover:text-blue-800 hover:bg-gray-100/50 px-3 py-2 text-sm font-medium transition-colors rounded-md"
              >
                Case Studies
              </a>
              <a 
                href="/hr"
                className="text-blue-600 hover:text-blue-800 hover:bg-gray-100/50 px-3 py-2 text-sm font-medium transition-colors rounded-md"
              >
                For HR Teams
              </a>
              <a 
                href="/pricing"
                className="text-blue-600 hover:text-blue-800 hover:bg-gray-100/50 px-3 py-2 text-sm font-medium transition-colors rounded-md"
              >
                Pricing
              </a>
              <a 
                href="/blog"
                className="text-blue-600 hover:text-blue-800 hover:bg-gray-100/50 px-3 py-2 text-sm font-medium transition-colors rounded-md"
              >
                Blog
              </a>
              <a 
                href="/resources"
                className="text-blue-600 hover:text-blue-800 hover:bg-gray-100/50 px-3 py-2 text-sm font-medium transition-colors rounded-md"
              >
                Resources
              </a>
              <Link href="/contact">
                <button className="text-blue-600 hover:text-blue-800 hover:bg-gray-100/50 px-3 py-2 text-sm font-medium transition-colors rounded-md">
                  Contact
                </button>
              </Link>
            </div>
          </div>
          
          {/* Desktop CTA buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/client-portal">
              <Button 
                variant="ghost" 
                className="text-blue-600 hover:text-blue-800 hover:bg-gray-100/50 px-3 py-2 text-sm font-medium transition-colors rounded-md"
              >
                Client Login
              </Button>
            </Link>
            <Button 
              onClick={onTrialClick}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Get Started Free
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-blue-800 hover:text-blue-800 hover:bg-gray-200 bg-gray-100 border border-blue-300 shadow-sm"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <button 
                onClick={() => scrollToSection('features')}
                className="block w-full text-left px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Features
              </button>
              <a 
                href="/industry-research"
                className="block w-full text-left px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Industry Research
              </a>
              <a 
                href="/case-studies"
                className="block w-full text-left px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Case Studies
              </a>
              <a 
                href="/hr"
                className="block w-full text-left px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                For HR Teams
              </a>
              <a 
                href="/pricing"
                className="block w-full text-left px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Pricing
              </a>
              <a 
                href="/blog"
                className="block w-full text-left px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Blog
              </a>
              <a 
                href="/resources"
                className="block w-full text-left px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Resources
              </a>
              <Link href="/contact">
                <button className="block w-full text-left px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-800 transition-colors">
                  Contact
                </button>
              </Link>
              
              {/* Mobile CTA buttons */}
              <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
                <Link href="/client-portal">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-center text-blue-600 hover:text-blue-800 hover:bg-gray-100/50 px-3 py-2 text-sm font-medium transition-colors rounded-md"
                  >
                    Client Login
                  </Button>
                </Link>
                <Button 
                  onClick={onTrialClick}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Get Started Free
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
