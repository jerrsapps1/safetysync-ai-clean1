import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'pricing' | 'features' | 'security' | 'support';
}

const faqData: FAQItem[] = [
  {
    question: "How does the pay-per-use model work for certificates and wallet cards?",
    answer: "All subscription plans now operate on a pay-per-use basis at $5.95 per certificate or digital wallet card. This includes both Basic and Enterprise plans - there are no free allowances included in any tier.",
    category: "pricing"
  },
  {
    question: "What's included in the 6-hour trial period?",
    answer: "The 6-hour trial provides full access to SafetySync.AI platform features including AI document processing, employee management, compliance tracking, and certificate generation (with pay-per-use pricing for certificates).",
    category: "pricing"
  },
  {
    question: "Can I upgrade or downgrade my subscription plan?",
    answer: "Yes, you can change your subscription plan at any time. Upgrades take effect immediately, while downgrades take effect at your next billing cycle. Certificate pricing remains $5.95 across all plans.",
    category: "pricing"
  },
  {
    question: "Do you offer volume discounts for certificate generation?",
    answer: "Yes! We offer volume discounts: 15-29 certificates (10% off), 30-49 certificates (15% off), and 50+ certificates (20% off). Discounts apply automatically in your shopping cart.",
    category: "pricing"
  },
  {
    question: "What's the difference between certificates and digital wallet cards?",
    answer: "Certificates are formal compliance documents, while digital wallet cards are mobile-friendly versions that employees can carry on their phones. Both cost $5.95 each and serve different verification needs.",
    category: "features"
  },
  {
    question: "How accurate is the AI document processing?",
    answer: "Our OpenAI GPT-4o powered system achieves 98.7% accuracy in extracting training information from documents including employee names, instructor credentials, training dates, and OSHA standards compliance.",
    category: "features"
  },
  {
    question: "Can I integrate SafetySync.AI with existing HR systems?",
    answer: "Professional and Enterprise plans include API access for integration with existing HR, payroll, and training management systems. Contact our support team for integration assistance.",
    category: "features"
  },
  {
    question: "What industries do you serve?",
    answer: "We serve 20+ safety-critical industries including construction, manufacturing, healthcare, energy, mining, aerospace, automotive, and more. Our platform adapts to industry-specific OSHA requirements.",
    category: "features"
  },
  {
    question: "Is my company data secure on SafetySync.AI?",
    answer: "Yes, we use enterprise-grade security including JWT authentication, PostgreSQL encryption, SSL certificates, rate limiting, and SOC 2 compliance. Your data is protected with bank-level security.",
    category: "security"
  },
  {
    question: "Do you provide data backup and recovery?",
    answer: "Enterprise and Professional plans include automated daily backups with 30-day retention. Point-in-time recovery and custom backup schedules are available for Enterprise clients.",
    category: "security"
  },
  {
    question: "What support options are available?",
    answer: "Basic: Email support, Pro: Priority email + chat, Professional: Phone support, Enterprise: Dedicated account manager with 24/7 phone support and custom training sessions.",
    category: "support"
  },
  {
    question: "Do you offer training for new users?",
    answer: "Yes! All plans include access to our comprehensive user guide. Professional and Enterprise plans include live onboarding sessions and custom training for your team.",
    category: "support"
  }
];

export default function PricingFAQ() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleItem = (index: string) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  const categories = [
    { id: 'all', label: 'All Questions', count: faqData.length },
    { id: 'pricing', label: 'Pricing & Billing', count: faqData.filter(item => item.category === 'pricing').length },
    { id: 'features', label: 'Features & Capabilities', count: faqData.filter(item => item.category === 'features').length },
    { id: 'security', label: 'Security & Privacy', count: faqData.filter(item => item.category === 'security').length },
    { id: 'support', label: 'Support & Training', count: faqData.filter(item => item.category === 'support').length }
  ];

  const filteredFAQ = selectedCategory === 'all' 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <HelpCircle className="h-8 w-8 text-blue-400" />
          Frequently Asked Questions
        </h2>
        <p className="text-blue-200 text-lg max-w-2xl mx-auto">
          Get answers to common questions about SafetySync.AI pricing, features, and implementation
        </p>
      </div>

      {/* Category Filter */}
      <Card className="bg-white/10 backdrop-blur-sm border-blue-700/50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-3 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-blue-200 hover:bg-white/20'
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold">{category.label}</div>
                  <div className="text-xs opacity-75">({category.count})</div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFAQ.map((item, index) => {
          const itemKey = `${selectedCategory}-${index}`;
          const isOpen = openItems.includes(itemKey);
          
          return (
            <Card key={itemKey} className="bg-white/10 backdrop-blur-sm border-blue-700/50">
              <Collapsible
                open={isOpen}
                onOpenChange={() => toggleItem(itemKey)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-white/5 transition-colors">
                    <CardTitle className="text-white flex items-center justify-between text-left">
                      <span className="text-lg font-semibold">{item.question}</span>
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          item.category === 'pricing' ? 'bg-blue-600 text-white' :
                          item.category === 'features' ? 'bg-emerald-600 text-white' :
                          item.category === 'security' ? 'bg-amber-600 text-white' :
                          'bg-purple-600 text-white'
                        }`}>
                          {item.category}
                        </div>
                        {isOpen ? (
                          <ChevronDown className="h-5 w-5 text-blue-400" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-blue-400" />
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 pb-6">
                    <div className="text-blue-200 leading-relaxed pl-4 border-l-2 border-blue-600">
                      {item.answer}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>

      {/* Contact Support */}
      <Card className="bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 border-0">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Still have questions?
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Our support team is here to help you understand how SafetySync.AI can transform your safety management processes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Contact Support
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Schedule Demo
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}