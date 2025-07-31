// File: src/layouts/MainLayout.jsx

import React, { useState } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";

export default function MainLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      {/* Header/Nav */}
      <header className="bg-white/70 backdrop-blur-md shadow-md text-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center space-x-2">
              <img
                src="/logo.svg"
                alt="SafetySync.AI Logo"
                className="h-8 md:h-10 w-auto"
              />
              <span className="text-xl font-semibold text-blue-600 hidden sm:inline">SafetySync.AI</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6 text-sm font-medium">
            <Link href="/features" className="hover:text-blue-600">Features</Link>
            <Link href="/hr-teams" className="hover:text-blue-600">For HR Teams</Link>
            <Link href="/pricing" className="hover:text-blue-600">Pricing</Link>
            <Link href="/case-studies" className="hover:text-blue-600">Case Studies</Link>
            <Link href="/contact" className="hover:text-blue-600">Contact</Link>
            <Link href="/client-portal" className="text-blue-600 font-semibold">Login</Link>
          </nav>

          {/* Mobile Nav Toggle */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow px-6 py-4 space-y-2 text-sm">
            <Link href="/features" className="block">Features</Link>
            <Link href="/hr-teams" className="block">For HR Teams</Link>
            <Link href="/pricing" className="block">Pricing</Link>
            <Link href="/case-studies" className="block">Case Studies</Link>
            <Link href="/contact" className="block">Contact</Link>
            <Link href="/client-portal" className="block font-semibold text-blue-600">Login</Link>
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-blue-700 text-white text-center py-6 text-sm">
        <p>&copy; {new Date().getFullYear()} SafetySync.AI — All rights reserved.</p>
      </footer>
    </div>
  );
}