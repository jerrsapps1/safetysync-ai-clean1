// Responsive Navbar with 'For HR Teams' Link
import React, { useState } from 'react';

export default function ResponsiveNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-900 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center font-bold text-xl text-blue-600">
              SafetySync.ai
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <a href="/" className="text-sm font-medium text-blue-600 hover:text-blue-600 transition">Home</a>
              <a href="/features" className="text-sm font-medium text-blue-600 hover:text-blue-600 transition">Features</a>
              <a href="/hr" className="text-sm font-medium text-blue-600 hover:text-blue-600 transition">For HR Teams</a>
            </div>
          </div>
          <div className="-mr-2 flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-blue-600 focus:outline-none">
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden px-4 pt-2 pb-3 space-y-1">
          <a href="/" className="block px-4 py-2 text-blue-600  rounded">Home</a>
          <a href="/features" className="block px-4 py-2 text-blue-600  rounded">Features</a>
          <a href="/hr" className="block px-4 py-2 text-blue-600  rounded">For HR Teams</a>
        </div>
      )}
    </nav>
  );
}