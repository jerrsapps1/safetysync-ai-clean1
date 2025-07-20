import React from 'react';
import ResponsiveNavbar from '../components/ResponsiveNavbar';

export default function HRTeamsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ResponsiveNavbar />
      
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              For HR Teams
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Streamline your OSHA compliance training management with SafetySync.ai's comprehensive HR tools
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Employee Training Management
              </h3>
              <p className="text-gray-600">
                Track, schedule, and manage all employee safety training requirements in one centralized system.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Compliance Documentation
              </h3>
              <p className="text-gray-600">
                Generate audit-ready documentation and maintain comprehensive training records automatically.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Digital Certificates
              </h3>
              <p className="text-gray-600">
                Issue and manage digital safety certificates that employees can access via QR codes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Training Matrix
              </h3>
              <p className="text-gray-600">
                Define role-based training requirements and track completion across your organization.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Automated Reminders
              </h3>
              <p className="text-gray-600">
                Never miss training deadlines with automated notifications and renewal reminders.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Reporting & Analytics
              </h3>
              <p className="text-gray-600">
                Get insights into training completion rates, compliance gaps, and organizational safety metrics.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">
              Ready to streamline your HR safety processes?
            </h2>
            <p className="mt-4 text-xl text-blue-100">
              Join thousands of HR professionals using SafetySync.ai
            </p>
            <div className="mt-8">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}