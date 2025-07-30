import React from "react";
import { Button } from "./components/ui/button";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="bg-gradient-to-tr from-blue-600 via-blue-500 to-blue-400 text-white font-sans">
      {/* Hero */}
      <section className="text-center py-20 px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          OSHA Compliance, Automated for Every Role
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Whether you manage safety, support HR, or deliver training — SafetySync saves hours and keeps your business audit-ready.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Button variant="secondary">Book a Demo</Button>
          <Button variant="outline">Get Started Free</Button>
        </div>
      </section>

      {/* Persona Grid */}
      <section className="bg-white text-gray-900 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Who is SafetySync For?</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { title: "EHS Managers", href: "/ehs" },
            { title: "HR Teams", href: "/hr" },
            { title: "Instructors & Consultants", href: "/instructors" }
          ].map((item, i) => (
            <a
              key={i}
              href={item.href}
              className="bg-blue-100 hover:bg-blue-200 transition p-6 rounded-xl shadow text-center font-semibold"
            >
              {item.title}
              <ArrowRight className="inline-block ml-2" size={18} />
            </a>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Why SafetySync?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "AI-Powered Document Processing",
              desc: "Extract, verify, and align training records with OSHA standards — instantly.",
            },
            {
              title: "Live Training Matrix",
              desc: "Auto-update training records, show progress by department, and stay inspection-ready.",
            },
            {
              title: "Certificate & Wallet Card Generator",
              desc: "Generate QR-verifiable certificates and digital ID cards for every employee.",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur p-6 rounded-xl border border-white/20"
            >
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-blue-700 py-16 text-center px-6">
        <blockquote className="text-xl italic max-w-2xl mx-auto text-white">
          "I've worked in safety for 15 years — this is the tool we've needed all along. SafetySync handles the compliance chaos."
        </blockquote>
        <p className="mt-4 font-semibold">— Gerardo H., Safety Director</p>
      </section>

      {/* CTA Banner */}
      <section className="py-20 text-center px-6 bg-white text-blue-800">
        <h2 className="text-3xl font-bold mb-4">Ready to Simplify Compliance?</h2>
        <p className="text-lg mb-8 max-w-xl mx-auto">
          Try SafetySync free or book a personalized walkthrough with our team.
        </p>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-lg font-semibold">
          Start My Free Trial
        </Button>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8 px-6 text-sm text-center">
        © {new Date().getFullYear()} SafetySync.AI · All rights reserved ·
        <a href="/ehs" className="text-white hover:underline ml-2">For EHS Managers</a> ·
        <a href="/hr" className="text-white hover:underline ml-2">For HR Teams</a> ·
        <a href="/instructors" className="text-white hover:underline ml-2">For Instructors</a> ·
        <a href="/privacy" className="underline ml-2">Privacy Policy</a>
      </footer>
    </div>
  );
}