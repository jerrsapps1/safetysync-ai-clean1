import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Star,
  MessageCircle,
  Shield,
  Settings,
  CreditCard,
  Users,
  FileText,
  Phone,
  Mail,
  Clock
} from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  popular?: boolean;
  tags: string[];
}

interface FAQSectionProps {
  onContactSupport?: () => void;
}

export function FAQSection({ onContactSupport }: FAQSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const faqData: FAQItem[] = [
    {
      id: "1",
      question: "How does SafetySync.ai help with OSHA compliance?",
      answer: "SafetySync.ai automates your entire OSHA compliance process by tracking employee training, managing certifications, sending expiration alerts, and generating audit-ready reports. Our platform ensures you stay compliant with all relevant OSHA standards while reducing administrative burden by up to 75%.",
      category: "general",
      popular: true,
      tags: ["osha", "compliance", "automation", "training"]
    },
    {
      id: "2",
      question: "What types of training records can I track?",
      answer: "You can track all types of safety training including OSHA 10-Hour and 30-Hour courses, Fall Protection, Hazard Communication, Confined Space Entry, Respiratory Protection, First Aid/CPR, Equipment Operation certifications, and custom training programs specific to your industry.",
      category: "features",
      popular: true,
      tags: ["training", "certifications", "records"]
    },
    {
      id: "3",
      question: "How quickly can I get started with SafetySync.ai?",
      answer: "Most customers are up and running within 24-48 hours. Our onboarding process includes data migration assistance, team training, and setup of your compliance tracking system. Enterprise customers receive dedicated implementation support with a timeline tailored to their needs.",
      category: "getting-started",
      tags: ["onboarding", "setup", "timeline"]
    },
    {
      id: "4",
      question: "Is my data secure and compliant with privacy regulations?",
      answer: "Yes, SafetySync.ai employs bank-level security with 256-bit encryption, SOC 2 Type II compliance, and GDPR compliance. All data is stored in secure, redundant data centers with regular security audits. We never share your data with third parties without explicit consent.",
      category: "security",
      popular: true,
      tags: ["security", "privacy", "encryption", "compliance"]
    },
    {
      id: "5",
      question: "Can SafetySync.ai integrate with our existing HR systems?",
      answer: "SafetySync offers robust API integrations with popular HR systems including BambooHR, Workday, ADP, and custom HRIS solutions. We also provide CSV import/export functionality and can work with your IT team to establish seamless data synchronization.",
      category: "integrations",
      tags: ["integrations", "api", "hr systems", "data sync"]
    },
    {
      id: "6",
      question: "What happens if an employee's certification expires?",
      answer: "SafetySync automatically sends customizable alerts 90, 60, 30, and 7 days before expiration. You'll receive notifications via email, dashboard alerts, and optional SMS. The system tracks expired certifications and provides action plans to bring employees back into compliance quickly.",
      category: "features",
      popular: true,
      tags: ["alerts", "expiration", "notifications", "compliance"]
    },
    {
      id: "7",
      question: "How much does SafetySync cost?",
      answer: "Pricing starts at $99/month for up to 100 employees with our Starter plan. Professional plans begin at $199/month for up to 500 employees. Enterprise pricing is available for larger organizations. All plans include a 6-hour free trial with no setup fees. Certificate and digital wallet card generation is $5.95 per item with no free inclusions.",
      category: "pricing",
      popular: true,
      tags: ["pricing", "cost", "plans", "trial"]
    },
    {
      id: "8",
      question: "Can I generate reports for OSHA audits?",
      answer: "Yes, SafetySync's one-click report generator creates comprehensive, audit-ready reports including employee training records, compliance metrics, certification status, and detailed analytics. Reports can be exported in PDF, Excel, or CSV formats and are formatted to meet OSHA requirements.",
      category: "features",
      tags: ["reports", "audits", "osha", "export"]
    },
    {
      id: "9",
      question: "Do you offer customer support and training?",
      answer: "We provide comprehensive support including live chat, email support, phone support (on Professional+ plans), video tutorials, documentation, and webinar training sessions. Enterprise customers receive dedicated account management and priority support.",
      category: "support",
      tags: ["support", "training", "help", "customer service"]
    },
    {
      id: "10",
      question: "What if I need to track compliance for multiple locations?",
      answer: "SafetySync supports multi-location management with location-specific dashboards, reporting, and compliance tracking. You can manage different safety requirements across locations while maintaining centralized oversight and reporting capabilities.",
      category: "features",
      tags: ["multi-location", "multiple sites", "centralized"]
    },
    {
      id: "11",
      question: "Is there a mobile app available?",
      answer: "Yes, SafetySync offers mobile apps for iOS and Android that allow field workers and supervisors to access training records, complete safety checklists, report incidents, and receive notifications on the go. The mobile app syncs in real-time with the web platform.",
      category: "mobile",
      tags: ["mobile", "app", "ios", "android"]
    },
    {
      id: "12",
      question: "Can I customize the platform for my industry?",
      answer: "Absolutely! SafetySync can be customized for various industries including construction, manufacturing, healthcare, energy, and transportation. We offer industry-specific training libraries, compliance checklists, and reporting templates tailored to your sector's requirements.",
      category: "customization",
      tags: ["customization", "industry", "templates", "specific"]
    }
  ];

  const categories = [
    { id: "all", name: "All Questions", icon: HelpCircle },
    { id: "general", name: "General", icon: Shield },
    { id: "features", name: "Features", icon: Settings },
    { id: "pricing", name: "Pricing", icon: CreditCard },
    { id: "getting-started", name: "Getting Started", icon: Users },
    { id: "support", name: "Support", icon: MessageCircle },
    { id: "security", name: "Security", icon: Shield },
    { id: "integrations", name: "Integrations", icon: Settings }
  ];

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const popularFAQs = faqData.filter(faq => faq.popular);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <HelpCircle className="w-8 h-8 text-blue-600" />
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
        </div>
        <p className="text-blue-500 max-w-2xl mx-auto">
          Find answers to common questions about SafetySync, OSHA compliance, and our platform features.
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs">
              <category.icon className="w-4 h-4 mr-1" />
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-8">
          {/* Popular Questions (only show when viewing all) */}
          {selectedCategory === "all" && searchQuery === "" && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Popular Questions
                </CardTitle>
                <CardDescription>
                  The most frequently asked questions by our customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {popularFAQs.slice(0, 4).map((faq) => (
                    <div key={faq.id} className="p-4 border rounded-lg hover:bg-blue-100 cursor-pointer"
                         onClick={() => toggleItem(faq.id)}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium mb-2">{faq.question}</h4>
                          <div className="flex flex-wrap gap-1">
                            {faq.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {openItems.includes(faq.id) ? 
                          <ChevronUp className="w-4 h-4 text-blue-600" /> : 
                          <ChevronDown className="w-4 h-4 text-blue-600" />
                        }
                      </div>
                      {openItems.includes(faq.id) && (
                        <div className="mt-3 pt-3 border-t text-sm text-blue-500">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All FAQs */}
          <div className="space-y-4">
            {filteredFAQs.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <HelpCircle className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-lg font-medium mb-2">No questions found</h3>
                  <p className="text-blue-500 mb-4">
                    Try adjusting your search terms or browse different categories.
                  </p>
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredFAQs.map((faq) => (
                <Collapsible key={faq.id} open={openItems.includes(faq.id)} onOpenChange={() => toggleItem(faq.id)}>
                  <Card>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-blue-100 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-left text-lg flex items-center gap-2">
                              {faq.question}
                              {faq.popular && <Star className="w-4 h-4 text-yellow-500" />}
                            </CardTitle>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {faq.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          {openItems.includes(faq.id) ? 
                            <ChevronUp className="w-5 h-5 text-blue-600" /> : 
                            <ChevronDown className="w-5 h-5 text-blue-600" />
                          }
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent>
                        <p className="text-blue-600 leading-relaxed">{faq.answer}</p>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Contact Support */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <MessageCircle className="w-12 h-12 mx-auto text-blue-600" />
            <h3 className="text-xl font-bold">Still have questions?</h3>
            <p className="text-blue-500 max-w-md mx-auto">
              Our support team is here to help you with any questions about SafetySync
              or OSHA compliance requirements.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="text-center p-4">
                <MessageCircle className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <div className="font-medium">Live Chat</div>
                <div className="text-sm text-blue-500">Available 24/7</div>
                <Button variant="outline" size="sm" className="mt-2" onClick={onContactSupport}>
                  Start Chat
                </Button>
              </div>
              <div className="text-center p-4">
                <Mail className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <div className="font-medium">Email Support</div>
                <div className="text-sm text-blue-500">Response within 2 hours</div>
                <Button variant="outline" size="sm" className="mt-2">
                  Send Email
                </Button>
              </div>
              <div className="text-center p-4">
                <Mail className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <div className="font-medium">Premium Support</div>
                <div className="text-sm text-blue-500">Available to paying customers</div>
                <Button variant="outline" size="sm" className="mt-2">
                  Get Support
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}