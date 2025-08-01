import React from "react";

export default function Features() {
  return (
    <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 text-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-6 text-center">Platform Features</h1>
        <p className="text-lg text-center mb-12 max-w-2xl mx-auto">
          Discover the powerful features that make SafetySync.AI the leading OSHA compliance platform.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-gray-900">
            <h3 className="font-bold text-xl mb-3">AI Compliance Engine</h3>
            <p>Process training documents with GPT-4o & Google AI. Extract, verify, and classify automatically.</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-gray-900">
            <h3 className="font-bold text-xl mb-3">Live Dashboard & Analytics</h3>
            <p>Real-time views of training completions, expired certs, and compliance scores.</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-gray-900">
            <h3 className="font-bold text-xl mb-3">Digital Wallet Cards</h3>
            <p>Each employee gets a scannable QR card linked to their training record and cert history.</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-gray-900">
            <h3 className="font-bold text-xl mb-3">Instructor Portal</h3>
            <p>Generate rosters, build sign-in sheets, issue certificates — no spreadsheet needed.</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-gray-900">
            <h3 className="font-bold text-xl mb-3">Multi-Location Support</h3>
            <p>View compliance by site, division, or role — all under one roof.</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-gray-900">
            <h3 className="font-bold text-xl mb-3">Audit-Ready Reports</h3>
            <p>Instantly generate OSHA-compliant training logs with source documents.</p>
          </div>
        </div>
      </div>
    </div>
  );
}