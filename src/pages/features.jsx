// File: src/pages/features.jsx
import React from "react";

export default function Features() {
  const features = [
    {
      title: "AI-Powered Document Processing",
      description: "Automatically extract training data from certificates and documents using OpenAI GPT-4o technology with 98.7% accuracy.",
      icon: "🧠"
    },
    {
      title: "Digital Wallet Cards",
      description: "Generate mobile-ready digital certification cards that employees can show during OSHA inspections.",
      icon: "📱"
    },
    {
      title: "Live Compliance Dashboard",
      description: "Real-time tracking of employee certifications, training expiration dates, and compliance status.",
      icon: "📊"
    },
    {
      title: "Automated Certificate Generation",
      description: "Professional PDF certificates with OSHA standard references and instructor credentials.",
      icon: "📜"
    },
    {
      title: "QR Code Verification",
      description: "Instant verification system for inspectors to validate employee training credentials.",
      icon: "📷"
    },
    {
      title: "Multi-Location Support",
      description: "Manage training records across multiple facilities with centralized reporting and analytics.",
      icon: "🏢"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-6">
            Platform Features
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Discover how SafetySync.AI transforms OSHA compliance management with intelligent automation and modern technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-blue-100 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <a 
            href="/client-portal" 
            className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
          >
            Start Free Trial
          </a>
        </div>
      </div>
    </div>
  );
}