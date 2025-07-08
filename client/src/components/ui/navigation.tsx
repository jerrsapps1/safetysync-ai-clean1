import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, User } from "lucide-react";

interface NavigationProps {
  onTrialClick: () => void;
  onDemoClick: () => void;
  onLoginClick: () => void;
  user?: any;
  onLogout?: () => void;
}

export function Navigation({ onTrialClick, onDemoClick, onLoginClick, user, onLogout }: NavigationProps) {
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
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SafetySync.AI</span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Features
              </button>
              <a 
                href="/testimonials"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Testimonials
              </a>
              <a 
                href="/case-studies"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Case Studies
              </a>
              <a 
                href="/pricing"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Pricing
              </a>
              <a 
                href="/blog"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Blog
              </a>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Contact
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <a 
                  href="/dashboard"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Dashboard
                </a>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={onLogout}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={onLoginClick}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={onTrialClick}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  Start Free Trial
                </Button>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900"
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
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
