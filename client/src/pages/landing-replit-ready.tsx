// File: src/pages/landing.jsx (Replit-ready full feature landing)

import React from "react";
import { Button } from "../components/ui/button";
import { Link } from "wouter";

export default function LandingPage() {
  return (
    <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 text-white">
      {/* Hero */}
      <section className="text-center py-20 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Automate OSHA Compliance. <br /> Empower Your Safety Teams.
        </h1>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          SafetySync.AI is an intelligent compliance hub for tracking training, generating certifications, and managing workforce readiness.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/client-portal"><Button>Get Started</Button></Link>
          <Link href="/contact"><Button variant="outline">Request Demo</Button></Link>
        </div>
      </section>

      {/* Pain Points */}
      <section className="bg-white text-gray-800 py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">Lost Paperwork?</h3>
            <p>Replace binders with digital, searchable records. Never miss an audit again.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Manual Tracking Fatigue?</h3>
            <p>Use AI to automate training recordkeeping and expiration monitoring.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Training Center Chaos?</h3>
            <p>Give instructors smart tools to issue certificates, verify attendance, and manage documents.</p>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 px-6 text-center max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-10">Platform Highlights</h2>
        <div className="grid md:grid-cols-3 gap-10 text-left">
          <div className="bg-white rounded-xl shadow-lg p-6 text-gray-900">
            <h3 className="font-bold text-xl mb-2">AI Compliance Engine</h3>
            <p>Process training docs with GPT-4o & Google AI. Extract, verify, and classify automatically.</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-gray-900">
            <h3 className="font-bold text-xl mb-2">Live Dashboard & Analytics</h3>
            <p>Real-time views of training completions, expired certs, and compliance scores.</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-gray-900">
            <h3 className="font-bold text-xl mb-2">Digital Wallet Cards</h3>
            <p>Each employee gets a scannable QR card linked to their training record and cert history.</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-gray-900">
            <h3 className="font-bold text-xl mb-2">Instructor & Consultant Portal</h3>
            <p>Generate rosters, build sign-in sheets, issue certificates — no spreadsheet needed.</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-gray-900">
            <h3 className="font-bold text-xl mb-2">Multi-Location Company Support</h3>
            <p>View compliance by site, division, or role — all under one roof.</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-gray-900">
            <h3 className="font-bold text-xl mb-2">Audit-Ready Reports</h3>
            <p>Instantly generate OSHA-compliant training logs with source documents.</p>
          </div>
        </div>
      </section>

      {/* Personas CTA */}
      <section className="bg-emerald-600 text-white py-16 text-center">
        <h2 className="text-3xl font-semibold mb-6">Built for Safety Pros, HR, and Trainers</h2>
        <p className="mb-6">Whether you're managing 20 employees or 2,000 — SafetySync.AI adapts to your needs.</p>
        <Link href="/pricing"><Button>See Plans & Pricing</Button></Link>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-8">What Our Users Say</h2>
        <blockquote className="italic mb-6">
          "SafetySync.AI helped us pass a surprise OSHA audit without scrambling. We'll never go back."
        </blockquote>
        <p className="text-sm text-gray-300">— EHS Manager, Construction Firm</p>
      </section>

      {/* Footer CTA */}
      <footer className="bg-blue-700 py-10 text-center">
        <h2 className="text-xl font-semibold mb-4">Ready to Get Audit-Ready?</h2>
        <div className="flex justify-center gap-4">
          <Link href="/client-portal"><Button>Start Your Free Trial</Button></Link>
          <Link href="/contact"><Button variant="outline">Contact Sales</Button></Link>
        </div>
      </footer>
    </div>
  );
}