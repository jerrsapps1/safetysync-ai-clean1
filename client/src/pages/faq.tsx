import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "How does SafetySync's AI document processing work?",
      answer: "Our AI uses OpenAI GPT-4o technology to extract training data from certificates, transcripts, and safety documents with 98.7% accuracy. It automatically identifies OSHA-relevant training, instructor credentials, completion dates, and compliance requirements."
    },
    {
      question: "What's included in each pricing plan?",
      answer: "All plans include full platform access, AI document processing, compliance dashboards, and employee management. You only pay $5.95 per certificate or digital wallet card generated. Essential ($49/mo) supports 25 employees, Professional ($149/mo) supports 100 employees, Enterprise ($349/mo) supports 500 employees, and Enterprise Plus ($749/mo) has unlimited employees."
    },
    {
      question: "How long is the free trial?",
      answer: "We offer a 6-hour focused trial that gives you full access to explore all platform features, upload documents, and see how our AI processes your training records. This concentrated trial lets you quickly evaluate if SafetySync fits your needs."
    },
    {
      question: "Can I integrate SafetySync with our existing HR systems?",
      answer: "Yes! Our Enterprise plans include HR integration capabilities. We support common HRIS systems and can export compliance data in multiple formats. Our team provides integration support to ensure smooth data flow between systems."
    },
    {
      question: "What types of training documents can SafetySync process?",
      answer: "SafetySync processes certificates, transcripts, training records, instructor credentials, equipment operator cards, and safety documentation. Our AI recognizes OSHA standards like Fall Protection (29 CFR 1910.30), HAZWOPER (29 CFR 1910.120), HazCom (29 CFR 1910.1200), and more."
    },
    {
      question: "How secure is our employee data?",
      answer: "We use enterprise-grade security with encrypted data storage, secure API connections, and compliance with data protection standards. Employee information is protected with JWT authentication, PostgreSQL database security, and regular security audits."
    },
    {
      question: "Can we customize certificates and digital wallet cards?",
      answer: "Yes! Enterprise Plus plans include custom branding for certificates and digital wallet cards. You can add your company logo, colors, and formatting. All generated documents include QR codes for instant verification."
    },
    {
      question: "What support is available?",
      answer: "We provide email support with 2-hour response times during business hours (Mon-Fri 9am-6pm EST). Enterprise plans include priority support, and Enterprise Plus includes dedicated onboarding assistance."
    },
    {
      question: "How does volume pricing work for certificates?",
      answer: "Certificate generation costs $5.95 each across all plans. Volume discounts apply: 10% off for 15-29 certificates, 15% off for 30-49 certificates, and 20% off for 50+ certificates per billing cycle."
    },
    {
      question: "Can SafetySync help us prepare for OSHA inspections?",
      answer: "Absolutely! SafetySync maintains audit-ready compliance records, tracks training matrices by job title, monitors certification expiration dates, and generates comprehensive reports that demonstrate your training program's effectiveness to OSHA inspectors."
    }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 text-white font-sans min-h-screen">
      {/* Header */}
      <section className="text-center py-20 px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          Get answers to common questions about SafetySync's OSHA compliance platform.
        </p>
      </section>

      {/* FAQ Section */}
      <section className="px-6 pb-20 max-w-4xl mx-auto">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur rounded-xl border border-white/20 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-white/5 transition-colors"
              >
                <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
                {openFAQ === index ? (
                  <ChevronUp className="w-5 h-5 text-blue-200 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-blue-200 flex-shrink-0" />
                )}
              </button>
              
              {openFAQ === index && (
                <div className="px-6 pb-4">
                  <div className="border-t border-white/20 pt-4">
                    <p className="text-blue-100 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="text-center pb-20 px-6">
        <div className="bg-white/10 backdrop-blur p-8 rounded-xl border border-white/20 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-blue-100 mb-6">
            Our safety compliance experts are here to help you get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-xl transition-colors inline-block"
            >
              Contact Sales
            </a>
            <a
              href="mailto:hello@safetysync.ai"
              className="border border-white text-white hover:bg-white/10 font-semibold py-3 px-6 rounded-xl transition-colors inline-block"
            >
              Email Support
            </a>
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