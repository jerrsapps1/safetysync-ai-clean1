import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Mail, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Send,
  CheckCircle,
  ArrowRight,
  Users,
  Calendar,
  Headphones
} from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Thanks! We'll be in touch.",
          description: "We'll get back to you within 2 hours during business hours.",
        });
        setFormData({
          name: '',
          email: '',
          company: '',
          role: '',
          message: ''
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Something went wrong. Try again.",
        description: "Please try again or contact us directly at hello@safetysync.ai",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant answers to your questions",
      detail: "Available 24/7",
      action: "Start Chat",
      color: "bg-emerald-500"
    },
    {
      icon: Mail,
      title: "Email Support", 
      description: "Send us a detailed message",
      detail: "Response within 2 hours",
      action: "Send Email",
      color: "bg-blue-500"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Talk to our safety experts",
      detail: "Mon-Fri 8AM-6PM EST",
      action: "Call Now",
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="pt-16 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Ready to streamline your safety compliance? Our team of OSHA experts is here to help 
            you find the perfect solution for your organization.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Clock className="w-4 h-4 mr-2" />
              2-Hour Response Time
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Users className="w-4 h-4 mr-2" />
              OSHA Certified Experts
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Headphones className="w-4 h-4 mr-2" />
              24/7 Live Chat
            </Badge>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className={`p-4 rounded-lg ${method.color} w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
                    <method.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-white text-xl">
                    {method.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-blue-100 mb-2">
                    {method.description}
                  </p>
                  <p className="text-emerald-400 font-semibold mb-4">
                    {method.detail}
                  </p>
                  <Button 
                    className="w-full bg-white/20 text-white border border-white/30 hover:bg-white/30"
                  >
                    {method.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form */}
          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl">
                  Send us a Message
                </CardTitle>
                <p className="text-blue-100">
                  Fill out the form below and we'll get back to you within 2 hours during business hours.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="bg-white/10 border-white/30 text-white placeholder:text-blue-200"
                      placeholder="Your Name"
                    />
                  </div>

                  <div>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="bg-white/10 border-white/30 text-white placeholder:text-blue-200"
                      placeholder="Your Email"
                    />
                  </div>

                  <div>
                    <Input
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="bg-white/10 border-white/30 text-white placeholder:text-blue-200"
                      placeholder="Company (optional)"
                    />
                  </div>

                  <div>
                    <Input
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="bg-white/10 border-white/30 text-white placeholder:text-blue-200"
                      placeholder="Your Role (optional)"
                    />
                  </div>

                  <div>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="bg-white/10 border-white/30 text-white placeholder:text-blue-200"
                      placeholder="Your Message"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-white text-blue-600 hover:bg-gray-100"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                    <Send className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info & Office */}
            <div className="space-y-8">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-xl flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Our Office
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-white font-semibold">SafetySync.AI Headquarters</p>
                    <p className="text-blue-100">
                      123 Safety Street<br />
                      Compliance City, CC 12345<br />
                      United States
                    </p>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Business Hours</p>
                    <p className="text-blue-100">
                      Monday - Friday: 8:00 AM - 6:00 PM EST<br />
                      Saturday: 9:00 AM - 3:00 PM EST<br />
                      Sunday: Closed
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-xl">
                    Why Companies Choose Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      "OSHA-certified safety experts on staff",
                      "98.7% customer satisfaction rating",
                      "2-hour average response time",
                      "Free migration from your current system",
                      "30-day money-back guarantee"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start text-blue-100">
                        <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white/10 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to See SafetySync.AI in Action?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Schedule a personalized demo and see how we can transform your safety compliance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Demo
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}