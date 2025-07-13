import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Home, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle, 
  HeadphonesIcon,
  Shield,
  Users,
  Building,
  HelpCircle,
  FileText,
  Zap,
  Ticket
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    contactReason: "",
    urgency: "normal"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message Sent Successfully",
        description: "Thank you for contacting us. We'll respond within 24 hours.",
      });
      
      setFormData({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
        contactReason: "",
        urgency: "normal"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactOptions = [
    {
      title: "Sales & Pricing",
      description: "Get pricing information and discuss your compliance needs",
      icon: Building,
      color: "bg-blue-500",
      email: "sales@safetysync.ai",
      response: "Within 2 hours"
    },
    {
      title: "Technical Support",
      description: "Get help with platform features and troubleshooting",
      icon: HeadphonesIcon,
      color: "bg-green-500",
      email: "support@safetysync.ai",
      response: "Within 4 hours (business hours)"
    },
    {
      title: "Partnership Inquiries",
      description: "Explore partnership opportunities and integrations",
      icon: Users,
      color: "bg-purple-500",
      email: "partnerships@safetysync.ai",
      response: "Within 24 hours"
    },
    {
      title: "Security & Compliance",
      description: "Security questions and compliance documentation",
      icon: Shield,
      color: "bg-red-500",
      email: "security@safetysync.ai",
      response: "Within 6 hours"
    }
  ];

  const faqs = [
    {
      question: "How quickly can I get started?",
      answer: "Most customers are up and running within 30 minutes. Our setup wizard guides you through the entire process."
    },
    {
      question: "Do you offer implementation support?",
      answer: "Yes, we provide dedicated implementation support for Professional and Enterprise plans, including data migration and team training."
    },
    {
      question: "What integrations do you support?",
      answer: "We integrate with popular HRIS systems, training platforms, and compliance management tools. Contact us for specific integration questions."
    },
    {
      question: "Is there a minimum contract length?",
      answer: "No, all plans are month-to-month with no long-term contracts required. Enterprise customers can opt for annual billing with discounts."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Home Button */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto">
          <Link href="/">
            <Button variant="secondary" className="flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to streamline your OSHA compliance? We're here to help you get started, 
            answer questions, and ensure your safety management success.
          </p>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactOptions.map((option) => (
            <Card key={option.title} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 ${option.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                  <option.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">{option.title}</CardTitle>
                <CardDescription className="text-sm">
                  {option.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="font-medium">{option.email}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>Response: {option.response}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Send us a Message
              </CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you promptly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    placeholder="Acme Construction Co."
                  />
                </div>

                <div>
                  <Label htmlFor="contactReason">How can we help you?</Label>
                  <Select value={formData.contactReason} onValueChange={(value) => handleInputChange("contactReason", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Sales & Pricing Information</SelectItem>
                      <SelectItem value="demo">Request a Demo</SelectItem>
                      <SelectItem value="support">Technical Support</SelectItem>
                      <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                      <SelectItem value="security">Security Questions</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    required
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    required
                    rows={5}
                    placeholder="Please provide details about your inquiry..."
                  />
                </div>

                <div>
                  <Label htmlFor="urgency">Urgency Level</Label>
                  <Select value={formData.urgency} onValueChange={(value) => handleInputChange("urgency", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - General inquiry</SelectItem>
                      <SelectItem value="normal">Normal - Standard response</SelectItem>
                      <SelectItem value="high">High - Need quick response</SelectItem>
                      <SelectItem value="urgent">Urgent - Critical issue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Company Info & Quick Links */}
          <div className="space-y-6">
            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  SafetySync.AI
                </CardTitle>
                <CardDescription>
                  AI-Powered OSHA Compliance Platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Headquarters</p>
                    <p className="text-sm text-gray-600">
                      Remote-First Company<br />
                      Serving clients nationwide
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">General Inquiries</p>
                    <p className="text-sm text-gray-600">hello@safetysync.ai</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Support Hours</p>
                    <p className="text-sm text-gray-600">
                      Mon-Fri: 7AM-7PM CT<br />
                      Weekend: Limited availability
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/pricing">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    View Pricing Plans
                  </Button>
                </Link>
                <Link href="/resources">
                  <Button variant="outline" className="w-full justify-start">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Download Resources
                  </Button>
                </Link>
                <Link href="/user-guide">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    User Guide
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>
              Quick answers to common questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-sm text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Support Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Clock className="w-5 h-5" />
              Support Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700 mb-4">
              Our support team is available during business hours to help you with any questions or issues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                <Mail className="w-4 h-4 mr-2" />
                support@safetysync.ai
              </Button>
              <p className="text-sm text-blue-600 self-center">
                Monday-Friday: 7AM-7PM CT
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Helpdesk System */}
        <Card className="bg-emerald-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-800">
              <Ticket className="w-5 h-5" />
              Full Helpdesk System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-emerald-700 mb-4">
              Access our comprehensive helpdesk system for ticket management, conversation tracking, and priority support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/helpdesk">
                <Button variant="secondary" className="bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100">
                  <Ticket className="w-4 h-4 mr-2" />
                  Access Helpdesk
                </Button>
              </Link>
              <p className="text-sm text-emerald-600 self-center">
                Available 24/7 for ticket submission
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Home Button */}
        <div className="bg-white border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-6 mt-12">
          <div className="max-w-7xl mx-auto text-center">
            <Link href="/">
              <Button variant="secondary" className="flex items-center gap-2 mx-auto bg-gray-100 text-gray-700 hover:bg-gray-200">
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}