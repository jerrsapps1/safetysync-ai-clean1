import React from "react";
import { Button } from "../components/ui/button";

export default function CentersPage() {
  return (
    <div className="bg-white text-gray-900 font-sans">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white text-center py-20 px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Support for Training Centers & Schools</h1>
        <p className="text-lg max-w-2xl mx-auto">
          SafetySync helps you deliver professional, compliant, and auditable results — without changing how you teach.
        </p>
      </section>

      {/* Benefits */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Challenges</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Certificates take time to generate, track, and reissue</li>
            <li>Students and clients lose access to proof of training</li>
            <li>Managing multiple company trainings is messy</li>
            <li>Branding and recordkeeping is inconsistent</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">What SafetySync Enables</h2>
          <ul className="list-disc list-inside text-blue-700 space-y-2">
            <li>Issue branded certificates and wallet cards instantly</li>
            <li>Provide students with digital QR-code verification</li>
            <li>Track training across all company clients</li>
            <li>Export reports for audits, billing, or analytics</li>
          </ul>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">SafetySync Powers Training Operations</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "White-Label Certificates",
              desc: "Generate professional certificates with your school branding and instructor credentials.",
            },
            {
              title: "Student Management Portal",
              desc: "Track enrollment, attendance, and completion across all courses and instructors.",
            },
            {
              title: "Client Reporting Dashboard",
              desc: "Provide corporate clients with real-time access to their employees' training records.",
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
        <h2 className="text-3xl font-bold mb-4">Streamline Your Training Operations</h2>
        <p className="text-lg max-w-xl mx-auto mb-8">
          SafetySync helps training centers deliver professional results while maintaining complete compliance and audit readiness.
        </p>
        <Button className="bg-white text-blue-800 hover:bg-gray-100 text-lg font-semibold px-6 py-3 rounded-xl">
          Get Started for Training Centers
        </Button>
      </section>
    </div>
  );
}