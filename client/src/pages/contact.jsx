// File: src/pages/contact.jsx
import React, { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
    requestType: "general"
  });
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          leadType: "contact"
        })
      });
      
      if (response.ok) {
        setStatus("Message sent successfully! We'll get back to you within 24 hours.");
        setFormData({ name: "", email: "", company: "", message: "", requestType: "general" });
      } else {
        setStatus("Failed to send message. Please try again.");
      }
    } catch (error) {
      setStatus("Network error. Please try again.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactMethods = [
    {
      title: "Sales Inquiries",
      description: "Ready to transform your safety compliance?",
      contact: "sales@safetysync.ai",
      icon: "💼"
    },
    {
      title: "Technical Support",
      description: "Need help with your account or platform?",
      contact: "support@safetysync.ai",
      icon: "🔧"
    },
    {
      title: "General Questions",
      description: "Have questions about our platform?",
      contact: "hello@safetysync.ai",
      icon: "💬"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Ready to revolutionize your OSHA compliance? We're here to help you get started 
            or answer any questions about SafetySync.AI.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-blue-200 border border-white/30 focus:border-white focus:outline-none"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-blue-200 border border-white/30 focus:border-white focus:outline-none"
                    placeholder="your@company.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-white mb-2">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-blue-200 border border-white/30 focus:border-white focus:outline-none"
                  placeholder="Your company name"
                />
              </div>
              
              <div>
                <label className="block text-white mb-2">How can we help?</label>
                <select
                  name="requestType"
                  value={formData.requestType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:border-white focus:outline-none"
                >
                  <option value="general">General Questions</option>
                  <option value="demo">Request a Demo</option>
                  <option value="pricing">Pricing Information</option>
                  <option value="technical">Technical Support</option>
                  <option value="partnership">Partnership Inquiry</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white mb-2">Message *</label>
                <textarea
                  name="message"
                  required
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-blue-200 border border-white/30 focus:border-white focus:outline-none resize-none"
                  placeholder="Tell us about your safety compliance needs..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Send Message
              </button>
              
              {status && (
                <p className="text-center text-blue-100 mt-4">{status}</p>
              )}
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Other Ways to Reach Us</h2>
              
              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="text-3xl">{method.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{method.title}</h3>
                      <p className="text-blue-100 mb-2">{method.description}</p>
                      <a href={`mailto:${method.contact}`} className="text-white hover:text-blue-200 font-medium">
                        {method.contact}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">Quick Start</h3>
              <p className="text-blue-100 mb-6">
                Ready to see SafetySync.AI in action? Start your free 6-hour trial now.
              </p>
              <a 
                href="/client-portal" 
                className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Start Free Trial
              </a>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">Response Times</h3>
              <ul className="space-y-2 text-blue-100">
                <li>• Sales inquiries: Same business day</li>
                <li>• Technical support: Within 2 hours</li>
                <li>• General questions: Within 24 hours</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}