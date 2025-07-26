import React from 'react';
import { PageHeader } from '@/components/ui/page-header';

export default function HRTeamsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400">
      <PageHeader />
      
      {/* Main Content with Sidebar Margin */}
      <div className="md:ml-16">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              For HR Teams
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Streamline your OSHA compliance training management with SafetySync.ai's comprehensive HR tools
            </p>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            
            <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-lg backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-200">
              <h3 className="text-lg font-semibold text-white mb-3">
                Employee Training Management
              </h3>
              <p className="text-gray-300">
                Track, schedule, and manage all employee safety training requirements in one centralized system.
              </p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-lg backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-200">
              <h3 className="text-lg font-semibold text-white mb-3">
                Compliance Documentation
              </h3>
              <p className="text-gray-300">
                Generate audit-ready documentation and maintain comprehensive training records automatically.
              </p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-lg backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-200">
              <h3 className="text-lg font-semibold text-white mb-3">
                Digital Certificates
              </h3>
              <p className="text-gray-300">
                Issue and manage digital safety certificates that employees can access via QR codes.
              </p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-lg backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-200">
              <h3 className="text-lg font-semibold text-white mb-3">
                Training Matrix
              </h3>
              <p className="text-gray-300">
                Define role-based training requirements and track completion across your organization.
              </p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-lg backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-200">
              <h3 className="text-lg font-semibold text-white mb-3">
                Automated Reminders
              </h3>
              <p className="text-gray-300">
                Never miss training deadlines with automated notifications and renewal reminders.
              </p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-lg backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-200">
              <h3 className="text-lg font-semibold text-white mb-3">
                Reporting & Analytics
              </h3>
              <p className="text-gray-300">
                Get insights into training completion rates, compliance gaps, and organizational safety metrics.
              </p>
            </div>

          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to streamline your HR safety processes?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of HR professionals using SafetySync.ai
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg">
                Start Free Trial
              </button>
              <button className="bg-white/10 border border-white/30 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all duration-200">
                Book a Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}