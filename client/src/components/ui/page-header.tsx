import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SafetySyncIcon } from "@/components/ui/safetysync-icon";
import { Menu, X } from "lucide-react";
import { Link } from "wouter";

interface PageHeaderProps {
  // No props needed - this will be the same navigation for all pages
}

export function PageHeader({}: PageHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-baseline h-16">
          {/* Logo */}
          <div className="flex items-center self-center">
            <Link href="/">
              <div className="flex-shrink-0 flex items-center cursor-pointer">
                <SafetySyncIcon size={32} className="mr-2 md:mr-3" />
                <span className="text-lg md:text-xl font-bold text-gray-900">SafetySync.AI</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/">
                <a className="text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 px-3 py-2 text-sm font-medium transition-colors rounded-md">
                  Home
                </a>
              </Link>
              <Link href="/industry-research">
                <a className="text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 px-3 py-2 text-sm font-medium transition-colors rounded-md">
                  Industry Research
                </a>
              </Link>
              <Link href="/case-studies">
                <a className="text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 px-3 py-2 text-sm font-medium transition-colors rounded-md">
                  Case Studies
                </a>
              </Link>
              <Link href="/hr">
                <a className="text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 px-3 py-2 text-sm font-medium transition-colors rounded-md">
                  For HR Teams
                </a>
              </Link>
              <Link href="/pricing">
                <a className="text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 px-3 py-2 text-sm font-medium transition-colors rounded-md">
                  Pricing
                </a>
              </Link>
              <Link href="/blog">
                <a className="text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 px-3 py-2 text-sm font-medium transition-colors rounded-md">
                  Blog
                </a>
              </Link>
              <Link href="/resources">
                <a className="text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 px-3 py-2 text-sm font-medium transition-colors rounded-md">
                  Resources
                </a>
              </Link>
              <Link href="/contact">
                <a className="text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 px-3 py-2 text-sm font-medium transition-colors rounded-md">
                  Contact
                </a>
              </Link>
              <Link href="/client-portal">
                <a className="text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 px-3 py-2 text-sm font-medium transition-colors rounded-md border border-gray-300 -mt-1">
                  Client Login
                </a>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/">
              <a 
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
            </Link>
            <Link href="/industry-research">
              <a 
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Industry Research
              </a>
            </Link>
            <Link href="/case-studies">
              <a 
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Case Studies
              </a>
            </Link>
            <Link href="/hr">
              <a 
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                For HR Teams
              </a>
            </Link>
            <Link href="/pricing">
              <a 
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </a>
            </Link>
            <Link href="/blog">
              <a 
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </a>
            </Link>
            <Link href="/resources">
              <a 
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Resources
              </a>
            </Link>
            <Link href="/contact">
              <a 
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
            </Link>
            
            {/* Mobile Client Login Button */}
            <div className="pt-4 pb-2 border-t border-gray-200">
              <Link href="/client-portal">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-gray-700 border-gray-300 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Client Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}