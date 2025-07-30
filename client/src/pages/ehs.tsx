import React from "react";
import { Button } from "../components/ui/button";

export default function EHSPage() {
  return (
    <div className="bg-white text-gray-900 font-sans">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white text-center py-20 px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Built for EHS Managers
        </h1>
        <p className="text-lg max-w-2xl mx-auto">
          SafetySync helps Environmental, Health & Safety teams eliminate manual paperwork, streamline training, and stay audit-ready—without the chaos.
        </p>
      </section>

      {/* Pain Points + Solution */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-bold mb-4">The Problem</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Disorganized training records and expired certifications</li>
            <li>Stress during inspections and audits</li>
            <li>Too many tools, not enough automation</li>
            <li>Inconsistent data across locations or departments</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">The SafetySync Solution</h2>
          <ul className="list-disc list-inside text-blue-700 space-y-2">
            <li>Live training matrix with auto-updates</li>
            <li>Certificate generation with QR-code verification</li>
            <li>Compliance score dashboard across teams</li>
            <li>Incident reporting and document storage in one place</li>
          </ul>
        </div>
      </section>

      {/* Key Features for EHS */}
      <section className="bg-gray-50 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features for EHS Leaders</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Live Compliance Dashboard",
              desc: "Get real-time visibility into training gaps, compliance status, and department performance.",
            },
            {
              title: "Automated Certificate Generation",
              desc: "Create OSHA-compliant certificates and wallet cards that are QR-verifiable and always accessible.",
            },
            {
              title: "Audit-Ready Reporting",
              desc: "Instantly export proof of training, employee records, and digital documentation for inspections.",
            },
          ].map((f, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow border hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-900 text-white text-center py-20 px-6">
        <h2 className="text-3xl font-bold mb-4">Take Control of Compliance</h2>
        <p className="text-lg max-w-xl mx-auto mb-8">
          Join hundreds of safety professionals using SafetySync to simplify documentation, streamline training, and stay ahead of audits.
        </p>
        <Button className="bg-white text-blue-800 hover:bg-gray-100 text-lg font-semibold px-6 py-3 rounded-xl">
          Start Your Free Trial
        </Button>
      </section>
    </div>
  );
}