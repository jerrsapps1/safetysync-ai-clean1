import React from "react";
import { Button } from "../components/ui/button";

export default function TrainingCentersPage() {
  return (
    <div className="bg-white text-gray-900 font-sans">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white text-center py-20 px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">For Training Centers</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Scale your training operations with automated student management, instant certificate generation, and comprehensive compliance tracking across all programs.
        </p>
      </section>

      {/* Problems + Solutions */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-bold mb-4">Training Center Challenges</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Managing hundreds of students across multiple courses</li>
            <li>Manual certificate processing creates bottlenecks</li>
            <li>Difficult to track instructor performance and capacity</li>
            <li>Complex compliance reporting for multiple clients</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">How SafetySync Helps</h2>
          <ul className="list-disc list-inside text-blue-700 space-y-2">
            <li>Automated student enrollment and progress tracking</li>
            <li>Bulk certificate generation with custom branding</li>
            <li>Instructor dashboard with class management tools</li>
            <li>Client-specific reporting and compliance exports</li>
          </ul>
        </div>
      </section>

      {/* Training Center Features */}
      <section className="bg-gray-50 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features for Training Centers</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Multi-Course Management",
              desc: "Manage all OSHA courses, instructors, and students from a unified platform.",
            },
            {
              title: "White-Label Certificates",
              desc: "Generate certificates with your training center branding and instructor credentials.",
            },
            {
              title: "Client Portal Access",
              desc: "Give corporate clients real-time access to their employees' training records.",
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
        <h2 className="text-3xl font-bold mb-4">Scale Your Training Business</h2>
        <p className="text-lg max-w-xl mx-auto mb-8">
          SafetySync helps training centers operate more efficiently, serve more clients, and maintain the highest standards of compliance documentation.
        </p>
        <Button className="bg-white text-blue-800 hover:bg-gray-100 text-lg font-semibold px-6 py-3 rounded-xl">
          Grow Your Training Center
        </Button>
      </section>
    </div>
  );
}