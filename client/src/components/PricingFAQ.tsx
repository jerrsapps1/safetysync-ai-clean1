import { useState } from 'react';

const faqs = [
  {
    question: 'What is included in the Basic plan?',
    answer: 'The Basic plan includes unlimited user tracking, OSHA 1910/1926 compliance logs, and email support.',
  },
  {
    question: 'What is a Lifer Plan?',
    answer: 'Lifer Plans are limited-time licenses offering lifetime access to SafetySync.ai with one flat fee. Ideal for early adopters.',
  },
  {
    question: 'Can I switch plans later?',
    answer: 'Yes, you can upgrade, downgrade, or switch plans at any time from your admin dashboard.',
  },
  {
    question: 'Are there per-user fees?',
    answer: 'No. All our plans are priced per company—not per seat. Use freely with your whole team.',
  },
  {
    question: 'Do you offer a free trial?',
    answer: 'Yes. Every plan includes a 6-hour free trial with full feature access. No credit card required to start.',
  },
  {
    question: 'How does the pay-per-use model work for certificates and wallet cards?',
    answer: 'All subscription plans operate on a pay-per-use basis at $5.95 per certificate or digital wallet card across all tiers.',
  },
  {
    question: 'Do you offer volume discounts for certificate generation?',
    answer: 'Yes! We offer volume discounts: 15-29 certificates (10% off), 30-49 certificates (15% off), and 50+ certificates (20% off).',
  },
  {
    question: 'How accurate is the AI document processing?',
    answer: 'Our OpenAI GPT-4o powered system achieves 98.7% accuracy in extracting training information from documents.',
  },
];

export default function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="space-y-4">
      {faqs.map((faq, i) => (
        <div key={i} className="border rounded">
          <button
            className="w-full text-left px-4 py-3 font-medium text-gray-800 bg-white hover:bg-gray-50"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            {faq.question}
          </button>
          {openIndex === i && (
            <div className="px-4 py-2 text-sm text-gray-600 border-t bg-gray-50">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}