import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Mail, Phone, Clock, MapPin } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      alert("Thanks! We'll be in touch within 2 hours.");
      setFormData({ name: '', email: '', company: '', role: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 text-white font-sans min-h-screen">
      {/* Header */}
      <section className="text-center py-20 px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          Ready to automate your OSHA compliance? We're here to help you get started.
        </p>
      </section>

      {/* Contact Options & Form */}
      <section className="px-6 pb-20 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            
            {[
              {
                icon: <Mail className="w-6 h-6" />,
                title: "Email Support",
                content: "hello@safetysync.ai",
                subtitle: "Response within 2 hours"
              },
              {
                icon: <Phone className="w-6 h-6" />,
                title: "Phone Support",
                content: "(555) 123-SAFE",
                subtitle: "Mon-Fri 9am-6pm EST"
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: "Business Hours",
                content: "Monday - Friday",
                subtitle: "9:00 AM - 6:00 PM EST"
              },
              {
                icon: <MapPin className="w-6 h-6" />,
                title: "Headquarters",
                content: "Austin, Texas",
                subtitle: "Remote-first company"
              }
            ].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur p-6 rounded-xl border border-white/20">
                <div className="flex items-start space-x-4">
                  <div className="text-yellow-400 mt-1">{item.icon}</div>
                  <div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-white">{item.content}</p>
                    <p className="text-blue-100 text-sm">{item.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="bg-white/10 backdrop-blur p-8 rounded-xl border border-white/20">
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="company"
                  placeholder="Company Name"
                  value={formData.company}
                  onChange={handleChange}
                  className="px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <input
                  type="text"
                  name="role"
                  placeholder="Your Role"
                  value={formData.role}
                  onChange={handleChange}
                  className="px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
              
              <textarea
                name="message"
                placeholder="How can we help you with OSHA compliance?"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <section className="text-center pb-20 px-6">
        <a href="/" className="text-white hover:underline text-lg">
          ← Back to Home
        </a>
      </section>
    </div>
  );
}