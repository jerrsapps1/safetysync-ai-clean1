import React from "react";
import { Button } from "../components/ui/button";

export default function InstructorsPage() {
  return (
    <div className="bg-white text-gray-900 font-sans">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white text-center py-20 px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">For Safety Instructors</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Focus on teaching, not paperwork. SafetySync automates certificate generation, tracks student progress, and ensures every course meets OSHA requirements.
        </p>
      </section>

      {/* Problems + Solutions */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-bold mb-4">Instructor Challenges</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Manual certificate creation takes hours</li>
            <li>Student records scattered across multiple systems</li>
            <li>Difficult to track completion rates and progress</li>
            <li>Time spent on admin instead of teaching</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">How SafetySync Helps</h2>
          <ul className="list-disc list-inside text-blue-700 space-y-2">
            <li>Auto-generate OSHA-compliant certificates instantly</li>
            <li>Centralized student progress tracking</li>
            <li>Digital wallet cards with QR verification</li>
            <li>Streamlined class management and reporting</li>
          </ul>
        </div>
      </section>

      {/* Instructor-Focused Features */}
      <section className="bg-gray-50 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features for Instructors</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Instant Certificate Generation",
              desc: "Create professional OSHA-compliant certificates with your signature in seconds.",
            },
            {
              title: "Student Progress Dashboard",
              desc: "Track attendance, completion rates, and competency assessments in real-time.",
            },
            {
              title: "Digital Credential Verification",
              desc: "QR-enabled certificates and wallet cards for instant verification by employers.",
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
        <h2 className="text-3xl font-bold mb-4">Teach More. Admin Less.</h2>
        <p className="text-lg max-w-xl mx-auto mb-8">
          SafetySync handles the paperwork so you can focus on what matters most—delivering quality safety training that saves lives.
        </p>
        <Button className="bg-white text-blue-800 hover:bg-gray-100 text-lg font-semibold px-6 py-3 rounded-xl">
          Start Teaching with SafetySync
        </Button>
      </section>
    </div>
  );
}