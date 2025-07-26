import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Download, 
  Settings,
  CheckCircle,
  AlertTriangle,
  Clock,
  Database,
  Brain,
  Shield,
  Award,
  Users
} from 'lucide-react';
import { SafetySyncIcon } from "@/components/ui/safetysync-icon";

interface BillingInfo {
  plan: string;
  planPrice: number;
  billingCycle: 'monthly' | 'annual';
  nextBilling: string;
  paymentMethod: string;
  planStarted: string;
  status: 'active' | 'past_due' | 'cancelled';
}

interface UsageMetrics {
  certificatesGenerated: number;
  certificatesLimit: number;
  digitalCards: number;
  digitalCardsLimit: number;
  additionalCharges: number;
  employees: number;
  employeesLimit: number;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
  downloadUrl: string;
}

const mockBillingInfo: BillingInfo = {
  plan: 'Professional',
  planPrice: 112.00,
  billingCycle: 'monthly',
  nextBilling: '2025-02-12',
  paymentMethod: '•••• 4242',
  planStarted: '2025-01-12',
  status: 'active'
};

const mockUsage: UsageMetrics = {
  certificatesGenerated: 34,
  certificatesLimit: 50,
  digitalCards: 47,
  digitalCardsLimit: 50,
  additionalCharges: 23.80,
  employees: 147,
  employeesLimit: 500
};

const mockInvoices: Invoice[] = [
  {
    id: 'INV-2025-001',
    date: '2025-01-12',
    amount: 135.80,
    status: 'paid',
    description: 'Professional Plan + Additional Certificates',
    downloadUrl: '/invoices/inv-2025-001.pdf'
  },
  {
    id: 'INV-2024-012',
    date: '2024-12-12',
    amount: 112.00,
    status: 'paid',
    description: 'Professional Plan - Monthly',
    downloadUrl: '/invoices/inv-2024-012.pdf'
  },
  {
    id: 'INV-2024-011',
    date: '2024-11-12',
    amount: 118.75,
    status: 'paid',
    description: 'Professional Plan + Additional Cards',
    downloadUrl: '/invoices/inv-2024-011.pdf'
  }
];

export default function SubscriptionBilling() {
  const [activeTab, setActiveTab] = useState("overview");

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'past_due': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'cancelled': return 'bg-blue-400/20 text-white border-blue-400/30';
      case 'paid': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'overdue': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-blue-400/20 text-white border-blue-400/30';
    }
  };

  const certificateUsage = (mockUsage.certificatesGenerated / mockUsage.certificatesLimit) * 100;
  const cardUsage = (mockUsage.digitalCards / mockUsage.digitalCardsLimit) * 100;
  const employeeUsage = (mockUsage.employees / mockUsage.employeesLimit) * 100;

  return (
    <div className="space-y-6 relative">
      {/* Tech grid background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 opacity-10 rounded-lg"></div>
      
      {/* Floating tech icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 animate-float">
          <CreditCard className="w-8 h-8 text-blue-400/30" />
        </div>
        <div className="absolute top-32 right-20 animate-float-delay-1">
          <Brain className="w-10 h-10 text-purple-400/30" />
        </div>
        <div className="absolute bottom-20 left-20 animate-float-delay-2">
          <TrendingUp className="w-6 h-6 text-green-400/30" />
        </div>
        <div className="absolute bottom-32 right-32 animate-float-delay-3">
          <Shield className="w-7 h-7 text-violet-400/30" />
        </div>
      </div>

      <div className="flex items-center justify-between relative z-10">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <SafetySyncIcon size={32} className="rounded-lg" />
            Subscription & Billing
          </h2>
          <p className="text-white">Manage your subscription, billing, and usage analytics</p>
          <p className="text-white text-sm mt-1">
            💳 {mockBillingInfo.plan} Plan • Next billing: {mockBillingInfo.nextBilling} • {mockBillingInfo.status}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="bg-violet-500 hover:bg-emerald-600 text-white">
            <CreditCard className="w-4 h-4 mr-2" />
            Update Payment
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            <Settings className="w-4 h-4 mr-2" />
            Manage Plan
          </Button>
        </div>
      </div>

      {/* Current Plan Overview */}
      <Card className="bg-black/20 backdrop-blur-sm border-blue-700 relative z-10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Current Plan</CardTitle>
              <CardDescription className="text-white">
                Active since {mockBillingInfo.planStarted}
              </CardDescription>
            </div>
            <Badge className={getStatusColor(mockBillingInfo.status)}>
              {mockBillingInfo.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
              <h3 className="text-3xl font-bold text-white mb-2">{mockBillingInfo.plan}</h3>
              <p className="text-2xl font-semibold text-blue-400">${mockBillingInfo.planPrice.toFixed(2)}</p>
              <p className="text-white">per month</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white">Next Billing Date</span>
                <span className="text-white font-medium">{mockBillingInfo.nextBilling}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Payment Method</span>
                <span className="text-white font-medium">{mockBillingInfo.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Billing Cycle</span>
                <span className="text-white font-medium capitalize">{mockBillingInfo.billingCycle}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-white text-sm mb-2">This Month's Total</p>
                <p className="text-2xl font-bold text-white">${(mockBillingInfo.planPrice + mockUsage.additionalCharges).toFixed(2)}</p>
                <p className="text-green-400 text-sm">
                  ${mockUsage.additionalCharges.toFixed(2)} in additional charges
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="relative z-10">
        <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-sm border-blue-700">
          <TabsTrigger 
            value="overview" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-white hover:text-white transition-all duration-200"
          >
            <TrendingUp className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="usage" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-white hover:text-white transition-all duration-200"
          >
            <Database className="h-4 w-4" />
            Usage
          </TabsTrigger>
          <TabsTrigger 
            value="invoices" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-white hover:text-white transition-all duration-200"
          >
            <FileText className="h-4 w-4" />
            Invoices
          </TabsTrigger>
          <TabsTrigger 
            value="plans" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-white hover:text-white transition-all duration-200"
          >
            <Award className="h-4 w-4" />
            Plans
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-black/20 backdrop-blur-sm border-blue-700">
              <CardHeader>
                <CardTitle className="text-white">Monthly Usage Summary</CardTitle>
                <CardDescription className="text-white">
                  Current billing period usage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white">Plan Base Cost</span>
                    <span className="text-white font-medium">${mockBillingInfo.planPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white">Additional Certificates</span>
                    <span className="text-white font-medium">${mockUsage.additionalCharges.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-blue-600 pt-2">
                    <div className="flex justify-between">
                      <span className="text-white font-medium">Total This Month</span>
                      <span className="text-white font-bold">${(mockBillingInfo.planPrice + mockUsage.additionalCharges).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 backdrop-blur-sm border-blue-700">
              <CardHeader>
                <CardTitle className="text-white">Plan Benefits</CardTitle>
                <CardDescription className="text-white">
                  What's included in your {mockBillingInfo.plan} plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white">50 Certificates/Month</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white">50 Digital Wallet Cards/Month</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white">Up to 500 Employees</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white">Advanced Analytics</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white">Priority Support</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-black/20 backdrop-blur-sm border-blue-700">
              <CardHeader>
                <CardTitle className="text-white">Certificate Generation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white">Used this month</span>
                  <span className="text-white font-bold">{mockUsage.certificatesGenerated} / {mockUsage.certificatesLimit}</span>
                </div>
                <Progress value={certificateUsage} className="h-2" />
                <p className="text-sm text-white">
                  {certificateUsage.toFixed(1)}% of monthly allowance used
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 backdrop-blur-sm border-blue-700">
              <CardHeader>
                <CardTitle className="text-white">Digital Wallet Cards</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white">Used this month</span>
                  <span className="text-white font-bold">{mockUsage.digitalCards} / {mockUsage.digitalCardsLimit}</span>
                </div>
                <Progress value={cardUsage} className="h-2" />
                <p className="text-sm text-white">
                  {cardUsage.toFixed(1)}% of monthly allowance used
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 backdrop-blur-sm border-blue-700">
              <CardHeader>
                <CardTitle className="text-white">Employee Count</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white">Active employees</span>
                  <span className="text-white font-bold">{mockUsage.employees} / {mockUsage.employeesLimit}</span>
                </div>
                <Progress value={employeeUsage} className="h-2" />
                <p className="text-sm text-white">
                  {employeeUsage.toFixed(1)}% of plan limit used
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-black/20 backdrop-blur-sm border-blue-700">
            <CardHeader>
              <CardTitle className="text-white">Usage Trends</CardTitle>
              <CardDescription className="text-white">
                Track your usage patterns over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border border-blue-600 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-white mx-auto mb-2" />
                  <p className="text-white">Usage analytics chart would display here</p>
                  <p className="text-blue-400 text-sm">Showing monthly usage patterns and trends</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <div className="space-y-4">
            {mockInvoices.map((invoice) => (
              <Card key={invoice.id} className="bg-black/20 backdrop-blur-sm border-blue-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{invoice.id}</h3>
                        <p className="text-white">{invoice.description}</p>
                        <p className="text-blue-400 text-sm">{invoice.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-white font-bold">${invoice.amount.toFixed(2)}</p>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </div>
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Essential', 'Professional', 'Enterprise', 'Enterprise Plus'].map((plan, index) => {
              const prices = [49, 112, 258, 686];
              const certificates = [15, 50, 100, 250];
              const employees = [50, 500, 1000, 5000];
              const isCurrent = plan === mockBillingInfo.plan;
              
              return (
                <Card key={plan} className={`bg-black/20 backdrop-blur-sm border-blue-700 ${isCurrent ? 'ring-2 ring-blue-500' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">{plan}</CardTitle>
                      {isCurrent && (
                        <Badge className="bg-blue-500/20 text-blue-400">Current</Badge>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-white">${prices[index]}</p>
                      <p className="text-white">per month</p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-white text-sm">{certificates[index]} Certificates/Month</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-white text-sm">{certificates[index]} Digital Cards/Month</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-white text-sm">Up to {employees[index]} Employees</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-white text-sm">Advanced Analytics</span>
                      </div>
                    </div>
                    <Button 
                      className={`w-full ${isCurrent ? 'bg-blue-500' : 'bg-blue-500 hover:bg-blue-600'}`}
                      disabled={isCurrent}
                    >
                      {isCurrent ? 'Current Plan' : 'Upgrade'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}