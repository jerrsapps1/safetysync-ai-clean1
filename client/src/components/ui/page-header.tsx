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
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">
        {/* Logo & Brand */}
        <Link href="/">
          <div className="flex items-center space-x-3 cursor-pointer">
            <SafetySyncIcon size={36} />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">SafetySync.AI</h1>
              <p className="text-xs text-gray-600 -mt-1">OSHA Compliance Platform</p>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <Link href="/">
            <a className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors">
              Home
            </a>
          </Link>
          <Link href="/case-studies">
            <a className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors">
              Case Studies
            </a>
          </Link>
          <Link href="/hr">
            <a className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors">
              For HR Teams
            </a>
          </Link>
          <Link href="/pricing">
            <a className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors">
              Pricing
            </a>
          </Link>
          <Link href="/resources">
            <a className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors">
              Resources
            </a>
          </Link>
          <Link href="/contact">
            <a className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors">
              Contact
            </a>
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {/* Client Login - Desktop */}
          <div className="hidden md:block">
            <Link href="/client-portal">
              <Button variant="outline" size="sm" className="text-gray-700 border-gray-300 hover:bg-gray-50">
                Client Login
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-sm">
          <div className="container max-w-screen-2xl px-4 py-4">
            <nav className="flex flex-col space-y-3">
              <Link href="/">
                <a 
                  className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </a>
              </Link>
              <Link href="/case-studies">
                <a 
                  className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Case Studies
                </a>
              </Link>
              <Link href="/hr">
                <a 
                  className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  For HR Teams
                </a>
              </Link>
              <Link href="/pricing">
                <a 
                  className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </a>
              </Link>
              <Link href="/resources">
                <a 
                  className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Resources
                </a>
              </Link>
              <Link href="/contact">
                <a 
                  className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </a>
              </Link>
              
              {/* Mobile Client Login */}
              <div className="pt-3 border-t border-gray-200">
                <Link href="/client-portal">
                  <Button 
                    variant="outline" 
                    className="w-full justify-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Client Login
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}