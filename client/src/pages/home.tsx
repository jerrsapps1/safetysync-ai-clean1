import React from 'react';
import ContactForm from '../components/ContactForm';
import { PageHeader } from '../components/ui/page-header';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400">
      <PageHeader 
        title="Home"
        subtitle="Welcome to SafetySync.AI"
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Welcome to SafetySync.AI
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            AI-powered OSHA compliance management that transforms workplace safety tracking 
            and automated reporting for businesses of all sizes.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-white mb-4">AI Document Processing</h3>
            <p className="text-blue-100">
              Intelligent extraction and verification of training documents with 98.7% accuracy.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Automated Compliance</h3>
            <p className="text-blue-100">
              Real-time compliance monitoring and audit-ready reporting for OSHA requirements.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Digital Certificates</h3>
            <p className="text-blue-100">
              Generate professional digital wallet cards with QR code verification.
            </p>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Get in Touch</h2>
            <p className="text-blue-100">
              Ready to streamline your OSHA compliance? Contact us to learn more.
            </p>
          </div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}