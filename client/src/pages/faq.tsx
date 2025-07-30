import React from "react";

export default function FAQPage() {
  const faqs = [
    {
      category: "General",
      q: "Does SafetySync.AI provide training content?",
      a: "No. We help manage training documentation and compliance, but do not offer training courses.",
    },
    {
      category: "General",
      q: "How does SafetySync's AI document processing work?",
      a: "Our AI uses OpenAI GPT-4o technology to extract training data from certificates, transcripts, and safety documents with 98.7% accuracy. It automatically identifies OSHA-relevant training, instructor credentials, completion dates, and compliance requirements."
    },
    {
      category: "General",
      q: "What types of training documents can SafetySync process?",
      a: "SafetySync processes certificates, transcripts, training records, instructor credentials, equipment operator cards, and safety documentation. Our AI recognizes OSHA standards like Fall Protection (29 CFR 1910.30), HAZWOPER (29 CFR 1910.120), HazCom (29 CFR 1910.1200), and more."
    },
    {
      category: "Plans & Billing",
      q: "What's included in each pricing plan?",
      a: "All plans include full platform access, AI document processing, compliance dashboards, and employee management. You only pay $5.95 per certificate or digital wallet card generated. Essential ($49/mo) supports 25 employees, Professional ($149/mo) supports 100 employees, Enterprise ($349/mo) supports 500 employees, and Enterprise Plus ($749/mo) has unlimited employees."
    },
    {
      category: "Plans & Billing",
      q: "How long is the free trial?",
      a: "We offer a 6-hour focused trial that gives you full access to explore all platform features, upload documents, and see how our AI processes your training records. This concentrated trial lets you quickly evaluate if SafetySync fits your needs."
    },
    {
      category: "Plans & Billing",
      q: "How does volume pricing work for certificates?",
      a: "Certificate generation costs $5.95 each across all plans. Volume discounts apply: 10% off for 15-29 certificates, 15% off for 30-49 certificates, and 20% off for 50+ certificates per billing cycle."
    },
    {
      category: "Platform & Integrations",
      q: "Can I integrate SafetySync with our existing HR systems?",
      a: "Yes! Our Enterprise plans include HR integration capabilities. We support common HRIS systems and can export compliance data in multiple formats. Our team provides integration support to ensure smooth data flow between systems."
    },
    {
      category: "Platform & Integrations",
      q: "Can we customize certificates and digital wallet cards?",
      a: "Yes! Enterprise Plus plans include custom branding for certificates and digital wallet cards. You can add your company logo, colors, and formatting. All generated documents include QR codes for instant verification."
    },
    {
      category: "Security & Compliance",
      q: "How secure is our employee data?",
      a: "We use enterprise-grade security with encrypted data storage, secure API connections, and compliance with data protection standards. Employee information is protected with JWT authentication, PostgreSQL database security, and regular security audits."
    },
    {
      category: "Security & Compliance",
      q: "Can SafetySync help us prepare for OSHA inspections?",
      a: "Absolutely! SafetySync maintains audit-ready compliance records, tracks training matrices by job title, monitors certification expiration dates, and generates comprehensive reports that demonstrate your training program's effectiveness to OSHA inspectors."
    },
    {
      category: "Support",
      q: "What support is available?",
      a: "We provide email support with 2-hour response times during business hours (Mon-Fri 9am-6pm EST). Enterprise plans include priority support, and Enterprise Plus includes dedicated onboarding assistance."
    }
  ];

  return (
    <div className="bg-white text-gray-900 font-sans py-16 px-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-10">Frequently Asked Questions</h1>
      {["General", "Plans & Billing", "Platform & Integrations", "Security & Compliance", "Support"].map((category) => (
        <div key={category} className="mb-10">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">{category}</h2>
          <div className="space-y-4">
            {faqs.filter((f) => f.category === category).map((item, idx) => (
              <div key={idx} className="border-b border-gray-200 pb-4">
                <h3 className="font-medium text-lg mb-2">{item.q}</h3>
                <p className="text-gray-700 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {/* Contact CTA */}
      <div className="text-center mt-16 p-8 bg-blue-50 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
        <p className="text-gray-700 mb-6">
          Our safety compliance experts are here to help you get started.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/contact"
            className="bg-blue-600 text-white hover:bg-blue-700 font-semibold py-3 px-6 rounded-xl transition-colors inline-block"
          >
            Contact Sales
          </a>
          <a
            href="mailto:hello@safetysync.ai"
            className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-xl transition-colors inline-block"
          >
            Email Support
          </a>
        </div>
      </div>

      {/* Back to Home */}
      <div className="text-center mt-8">
        <a href="/" className="text-blue-600 hover:underline text-lg">
          ← Back to Home
        </a>
      </div>
    </div>
  );
}