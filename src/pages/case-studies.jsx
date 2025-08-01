// File: src/pages/case-studies.jsx
import React from "react";

export default function CaseStudies() {
  const caseStudies = [
    {
      company: "Midwest Manufacturing Corp",
      industry: "Heavy Manufacturing",
      employees: "750 employees",
      challenge: "Manual tracking of safety certifications across 3 facilities resulted in failed OSHA inspection and $45K in fines.",
      solution: "Implemented SafetySync.AI with automated training tracking and digital wallet cards for all employees.",
      results: [
        "100% OSHA compliance achieved within 90 days",
        "Reduced compliance admin time by 12 hours per week",
        "Eliminated certification tracking errors",
        "Passed surprise OSHA inspection with zero violations"
      ],
      quote: "SafetySync.AI transformed our safety program from a compliance nightmare into a competitive advantage.",
      title: "Safety Manager"
    },
    {
      company: "Coastal Construction LLC",
      industry: "Commercial Construction",
      employees: "200 employees",
      challenge: "Field workers carried multiple physical certification cards that were frequently lost or damaged during projects.",
      solution: "Deployed digital wallet cards and QR code verification system accessible on employee smartphones.",
      results: [
        "Eliminated lost certification incidents",
        "Instant verification during site inspections",
        "Improved inspector confidence and relationships",
        "Reduced recertification costs by 40%"
      ],
      quote: "Our crews love having their certifications on their phones. Inspectors are impressed with our modern approach.",
      title: "HR Director"
    },
    {
      company: "Metro Healthcare System",
      industry: "Healthcare Facilities",
      employees: "1,200 employees",
      challenge: "Managing diverse safety training requirements across hospitals, clinics, and administrative offices.",
      solution: "Centralized training management with role-based certification tracking and automated reporting.",
      results: [
        "Streamlined training for 15 different job categories",
        "Automated compliance reporting to regulatory bodies",
        "Reduced training coordination time by 75%",
        "Improved employee satisfaction with training process"
      ],
      quote: "The multi-location dashboard gives us complete visibility into our compliance status across all facilities.",
      title: "Chief Safety Officer"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-6">
            Success Stories
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            See how organizations across industries have transformed their safety compliance 
            with SafetySync.AI and achieved measurable results.
          </p>
        </div>

        <div className="space-y-12">
          {caseStudies.map((study, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <div className="grid lg:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{study.company}</h3>
                  <p className="text-blue-200 mb-2">{study.industry}</p>
                  <p className="text-blue-100 text-sm">{study.employees}</p>
                </div>
                
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Challenge</h4>
                    <p className="text-blue-100">{study.challenge}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Solution</h4>
                    <p className="text-blue-100">{study.solution}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Results</h4>
                    <ul className="space-y-2">
                      {study.results.map((result, resultIndex) => (
                        <li key={resultIndex} className="flex items-center text-blue-100">
                          <span className="text-green-300 mr-3">✓</span>
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-white italic mb-2">"{study.quote}"</p>
                    <p className="text-blue-200 text-sm">— {study.title}, {study.company}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16 bg-white/10 backdrop-blur-sm rounded-xl p-8">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Join Them?</h2>
          <p className="text-blue-100 mb-6">
            Start your transformation today with a free 6-hour trial
          </p>
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