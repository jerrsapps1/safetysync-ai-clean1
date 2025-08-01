// File: src/pages/hr-teams.jsx
import React from "react";

export default function HRPage() {
  const benefits = [
    {
      title: "Streamlined Employee Onboarding",
      description: "Automatically track new hire safety training requirements and generate completion certificates in minutes, not hours.",
      icon: "👥"
    },
    {
      title: "Centralized Training Records",
      description: "Keep all employee certifications in one secure location with easy search and filtering capabilities.",
      icon: "📋"
    },
    {
      title: "Automated Compliance Alerts",
      description: "Receive notifications before certifications expire, ensuring your workforce stays compliant with OSHA standards.",
      icon: "🔔"
    },
    {
      title: "Instant OSHA Reporting",
      description: "Generate audit-ready reports in seconds with complete training histories and certification status.",
      icon: "📊"
    }
  ];

  const painPoints = [
    "Manual tracking of employee certifications in spreadsheets",
    "Lost or missing training records during OSHA inspections",
    "Time-consuming certificate generation and distribution",
    "Difficulty coordinating training across multiple departments",
    "Last-minute scrambling when certifications expire"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400">
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold text-white mb-6">
            Built for HR Teams
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Stop wasting hours on manual compliance tracking. SafetySync.AI automates your entire safety training workflow, 
            so you can focus on what matters most - your people.
          </p>
          <a 
            href="/client-portal" 
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors text-lg"
          >
            Start 6-Hour Free Trial
          </a>
        </div>

        {/* Pain Points Section */}
        <div className="mb-20">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Tired of These HR Headaches?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {painPoints.map((pain, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-red-300 mr-3 text-xl">✗</span>
                  <p className="text-blue-100">{pain}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            How SafetySync.AI Transforms Your HR Operations
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-blue-100 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ROI Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            See Results in Your First Week
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-white mb-2">85%</div>
              <p className="text-blue-100">Reduction in compliance admin time</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <p className="text-blue-100">OSHA inspection readiness</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">$15K</div>
              <p className="text-blue-100">Average annual savings per 100 employees</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}