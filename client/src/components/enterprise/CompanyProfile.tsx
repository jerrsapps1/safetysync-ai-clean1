import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Building2, MapPin, Phone, Mail, Globe, Users, Shield, Settings, Palette, Database, Brain, TrendingUp } from 'lucide-react';
import { SafetySyncIcon } from "@/components/ui/safetysync-icon";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const companyProfileSchema = z.object({
  userId: z.number(),
  companyName: z.string().min(1, "Company name is required"),
  industry: z.string().min(1, "Industry is required"),
  companySize: z.string().min(1, "Company size is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  country: z.string().default("United States"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  description: z.string().optional(),
  safetyOfficer: z.string().min(1, "Safety officer is required"),
  safetyOfficerEmail: z.string().email("Invalid email address"),
  safetyOfficerPhone: z.string().min(1, "Safety officer phone is required"),
  complianceManager: z.string().min(1, "Compliance manager is required"),
  complianceManagerEmail: z.string().email("Invalid email address"),
  primaryColor: z.string().default("#10b981"),
  secondaryColor: z.string().default("#1e40af"),
  showBranding: z.boolean().default(true),
  customDomain: z.string().optional(),
  logoUrl: z.string().optional(),
});

type CompanyProfileFormData = z.infer<typeof companyProfileSchema>;

interface CompanyProfile {
  id: number;
  userId: number;
  companyName: string;
  industry: string;
  companySize: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  description?: string;
  safetyOfficer: string;
  safetyOfficerEmail: string;
  safetyOfficerPhone: string;
  complianceManager: string;
  complianceManagerEmail: string;
  primaryColor: string;
  secondaryColor: string;
  showBranding: boolean;
  customDomain?: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function CompanyProfile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("business");

  const form = useForm<CompanyProfileFormData>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: {
      userId: 1, // Mock user ID
      companyName: "",
      industry: "",
      companySize: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      phone: "",
      email: "",
      website: "",
      description: "",
      safetyOfficer: "",
      safetyOfficerEmail: "",
      safetyOfficerPhone: "",
      complianceManager: "",
      complianceManagerEmail: "",
      primaryColor: "#10b981",
      secondaryColor: "#1e40af",
      showBranding: true,
      customDomain: "",
      logoUrl: "",
    },
  });

  // Fetch company profile
  const { data: profile, isLoading, error } = useQuery<CompanyProfile>({
    queryKey: ['/api/company-profile'],
    retry: false,
  });

  // Create/Update company profile mutation
  const mutation = useMutation({
    mutationFn: async (data: CompanyProfileFormData) => {
      if (profile) {
        // Update existing profile
        return await apiRequest("PUT", `/api/company-profile/${data.userId}`, data);
      } else {
        // Create new profile
        return await apiRequest("POST", "/api/company-profile", data);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/company-profile'] });
      toast({
        title: "Success",
        description: profile ? "Company profile updated successfully!" : "Company profile created successfully!",
      });
    },
    onError: (error) => {
      console.error("Error saving company profile:", error);
      toast({
        title: "Error",
        description: "Failed to save company profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update form when profile data is loaded
  useEffect(() => {
    if (profile) {
      form.reset({
        userId: profile.userId,
        companyName: profile.companyName,
        industry: profile.industry,
        companySize: profile.companySize,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        zipCode: profile.zipCode,
        country: profile.country,
        phone: profile.phone,
        email: profile.email,
        website: profile.website || "",
        description: profile.description || "",
        safetyOfficer: profile.safetyOfficer,
        safetyOfficerEmail: profile.safetyOfficerEmail,
        safetyOfficerPhone: profile.safetyOfficerPhone,
        complianceManager: profile.complianceManager,
        complianceManagerEmail: profile.complianceManagerEmail,
        primaryColor: profile.primaryColor,
        secondaryColor: profile.secondaryColor,
        showBranding: profile.showBranding,
        customDomain: profile.customDomain || "",
        logoUrl: profile.logoUrl || "",
      });
    }
  }, [profile, form]);

  const onSubmit = async (data: CompanyProfileFormData) => {
    await mutation.mutateAsync(data);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Floating tech icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 animate-float">
            <Database className="w-8 h-8 text-blue-400/30" />
          </div>
          <div className="absolute top-32 right-20 animate-float-delay-1">
            <Brain className="w-10 h-10 text-purple-400/30" />
          </div>
          <div className="absolute bottom-20 left-20 animate-float-delay-2">
            <TrendingUp className="w-6 h-6 text-green-400/30" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <SafetySyncIcon size={32} className="rounded-lg" />
              Company Profile
            </h2>
            <p className="text-gray-400">Manage your company information and settings</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-black/20 backdrop-blur-sm border-gray-800 animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Tech grid background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 opacity-10 rounded-lg"></div>
      
      {/* Floating tech icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 animate-float">
          <Database className="w-8 h-8 text-blue-400/30" />
        </div>
        <div className="absolute top-32 right-20 animate-float-delay-1">
          <Brain className="w-10 h-10 text-purple-400/30" />
        </div>
        <div className="absolute bottom-20 left-20 animate-float-delay-2">
          <TrendingUp className="w-6 h-6 text-green-400/30" />
        </div>
        <div className="absolute bottom-32 right-32 animate-float-delay-3">
          <Shield className="w-7 h-7 text-emerald-400/30" />
        </div>
      </div>

      <div className="flex items-center justify-between relative z-10">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <SafetySyncIcon size={32} className="rounded-lg" />
            Company Profile
          </h2>
          <p className="text-gray-400">Manage your company information and settings</p>
          <p className="text-blue-300 text-sm mt-1">
            💡 This information will be used for billing, invoices, and official documentation
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {profile && (
            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              🤖 AI-Verified Complete
            </Badge>
          )}
          {!profile && (
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              Setup Required
            </Badge>
          )}
          <Button
            type="submit"
            form="company-profile-form"
            disabled={mutation.isPending}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 border-0"
          >
            {mutation.isPending ? "Saving..." : profile ? "Update Profile" : "Create Profile"}
          </Button>
        </div>
      </div>

      {/* Information Card */}
      <Card className="bg-blue-500/10 border-blue-500/30 backdrop-blur-sm relative z-10">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <Shield className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Company Profile Usage</h3>
              <p className="text-gray-300 text-sm mt-1">
                Your company profile information is used for billing, invoices, certificates, and official documentation. 
                You can edit this information at any time to keep your account details current.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form id="company-profile-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-sm border-gray-800">
              <TabsTrigger 
                value="business" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200"
              >
                <Building2 className="h-4 w-4" />
                Business Info
              </TabsTrigger>
              <TabsTrigger 
                value="contacts" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200"
              >
                <Users className="h-4 w-4" />
                Key Contacts
              </TabsTrigger>
              <TabsTrigger 
                value="branding" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200"
              >
                <Palette className="h-4 w-4" />
                Branding
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200"
              >
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="business" className="space-y-6">
              <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Building2 className="h-5 w-5 text-blue-400" />
                    Company Information
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Basic information about your organization (editable anytime)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter company name" className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Industry</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-800 border-gray-700 text-white">
                              <SelectItem value="construction">Construction</SelectItem>
                              <SelectItem value="manufacturing">Manufacturing</SelectItem>
                              <SelectItem value="healthcare">Healthcare</SelectItem>
                              <SelectItem value="transportation">Transportation</SelectItem>
                              <SelectItem value="warehousing">Warehousing</SelectItem>
                              <SelectItem value="mining">Mining</SelectItem>
                              <SelectItem value="utilities">Utilities</SelectItem>
                              <SelectItem value="agriculture">Agriculture</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="companySize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Company Size</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                                <SelectValue placeholder="Select company size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-800 border-gray-700 text-white">
                              <SelectItem value="1-10">1-10 employees</SelectItem>
                              <SelectItem value="11-50">11-50 employees</SelectItem>
                              <SelectItem value="51-200">51-200 employees</SelectItem>
                              <SelectItem value="201-500">201-500 employees</SelectItem>
                              <SelectItem value="501-1000">501-1000 employees</SelectItem>
                              <SelectItem value="1001-5000">1001-5000 employees</SelectItem>
                              <SelectItem value="5001-10000">5001-10000 employees</SelectItem>
                              <SelectItem value="10000+">10000+ employees</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Website</FormLabel>
                          <FormControl>
                            <Input placeholder="https://www.example.com" className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Company Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief description of your company and operations"
                            className="min-h-[100px] bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <MapPin className="h-5 w-5 text-green-400" />
                    Business Address
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Primary business location (used for billing address)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main Street" className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">City</FormLabel>
                          <FormControl>
                            <Input placeholder="City" className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">State</FormLabel>
                          <FormControl>
                            <Input placeholder="State" className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">ZIP Code</FormLabel>
                          <FormControl>
                            <Input placeholder="12345" className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Country</FormLabel>
                        <FormControl>
                          <Input placeholder="United States" className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Phone className="h-5 w-5 text-purple-400" />
                    Contact Information
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Primary contact details (used for billing and invoices)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="contact@company.com" className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contacts" className="space-y-6">
              <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Shield className="h-5 w-5 text-emerald-400" />
                    Safety Officer
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Primary safety officer information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="safetyOfficer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="safetyOfficerPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="safetyOfficerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="safety@company.com" className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Users className="h-5 w-5 text-blue-400" />
                    Compliance Manager
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Primary compliance manager information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="complianceManager"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Jane Smith" className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="complianceManagerEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="compliance@company.com" className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="branding" className="space-y-6">
              <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Palette className="h-5 w-5 text-pink-400" />
                    Brand Customization
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Customize your company's brand appearance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="primaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Primary Color</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <Input type="color" className="w-20 h-10 bg-gray-800/50 border-gray-700" {...field} />
                              <Input placeholder="#10b981" className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="secondaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Secondary Color</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <Input type="color" className="w-20 h-10 bg-gray-800/50 border-gray-700" {...field} />
                              <Input placeholder="#1e40af" className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="logoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Logo URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/logo.png" className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-gray-300 text-base">Show Company Branding</Label>
                      <p className="text-sm text-gray-500">
                        Display your company branding on reports and certificates
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="showBranding"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Globe className="h-5 w-5 text-cyan-400" />
                    Domain Settings
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure custom domain settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="customDomain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Custom Domain</FormLabel>
                        <FormControl>
                          <Input placeholder="safety.yourcompany.com" className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-sm text-blue-300">
                      <strong>Note:</strong> Custom domain configuration requires DNS setup. 
                      Contact support for assistance with domain configuration.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}