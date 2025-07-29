import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Link, useLocation } from 'wouter';
import { 
  LogIn, 
  UserPlus, 
  Shield, 
  Clock, 
  Award,
  ArrowRight,
  Eye,
  EyeOff,
  Building,
  Mail,
  User,
  Key
} from 'lucide-react';

export default function ClientPortal() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: ''
  });

  const fillTestCredentials = () => {
    setFormData({
      ...formData,
      username: 'testuser',
      password: 'password'
    });
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, register, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  console.log('🔐 CLIENT-PORTAL: Auth state', { isAuthenticated, isLoading });

  // Allow users to access login form even when authenticated
  // Removed automatic redirect to give users control over navigation

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="pt-16 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Checking authentication..." />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        // Login flow
        console.log('🔐 CLIENT-PORTAL: Starting login with credentials', { username: formData.username });
        const result = await login(formData.username, formData.password);
        console.log('🔐 CLIENT-PORTAL: Login result received', result);
        
        if (result.success) {
          toast({
            title: "Login Successful",
            description: "Welcome back to SafetySync.AI!",
          });
          // Redirect to workspace after successful login
          window.location.href = '/workspace';
        } else {
          console.error('🔐 CLIENT-PORTAL: Login failed', result.message);
          toast({
            title: "Login failed",
            description: result.message || "Invalid username or password",
            variant: "destructive",
          });
        }
      } else {
        // Registration flow
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Password mismatch",
            description: "Passwords do not match",
            variant: "destructive",
          });
          return;
        }

        // For now, redirect to login since register function is not available
        toast({
          title: "Registration feature coming soon",
          description: "Please use the login form to access existing accounts",
          variant: "destructive",
        });
        setIsLogin(true);
        return;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="pt-16 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 min-h-screen">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          
          {/* Show authentication status if user is already logged in */}
          {isAuthenticated && (
            <div className="mb-8 p-4 bg-emerald-500/20 border border-emerald-400/30 rounded-lg text-center">
              <p className="text-emerald-200 mb-3">
                You're already logged in! 
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => window.location.href = '/workspace'}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Go to Workspace
                </Button>
                <Button 
                  onClick={() => {
                    localStorage.removeItem('auth_token');
                    window.location.reload();
                  }}
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  Logout & Login as Different User
                </Button>
              </div>
            </div>
          )}
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {isLogin ? 'Welcome Back' : 'Get Started Today'}
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              {isLogin 
                ? 'Access your SafetySync.AI workspace and manage your compliance.' 
                : 'Create your account and transform your safety management in minutes.'
              }
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Shield className="w-4 h-4 mr-2" />
                Enterprise Security
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Clock className="w-4 h-4 mr-2" />
                {isLogin ? 'Instant Access' : '6-Hour Free Trial'}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Award className="w-4 h-4 mr-2" />
                OSHA Compliant
              </Badge>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Login/Registration Form */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl text-center">
                  {isLogin ? 'Sign In to Your Account' : 'Create Your Account'}
                </CardTitle>
                <p className="text-blue-100 text-center">
                  {isLogin 
                    ? 'Enter your credentials to access your workspace' 
                    : 'Join thousands of companies using SafetySync.AI'
                  }
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Username */}
                  <div>
                    <label className="block text-white font-medium mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Username *
                    </label>
                    <Input
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      className="bg-white/10 border-white/30 text-white placeholder:text-blue-200"
                      placeholder="Enter your username"
                    />
                  </div>

                  {/* Email (Registration only) */}
                  {!isLogin && (
                    <div>
                      <label className="block text-white font-medium mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Work Email *
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="bg-white/10 border-white/30 text-white placeholder:text-blue-200"
                        placeholder="your@company.com"
                      />
                    </div>
                  )}

                  {/* Company (Registration only) */}
                  {!isLogin && (
                    <div>
                      <label className="block text-white font-medium mb-2">
                        <Building className="w-4 h-4 inline mr-2" />
                        Company
                      </label>
                      <Input
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/30 text-white placeholder:text-blue-200"
                        placeholder="Your company name"
                      />
                    </div>
                  )}

                  {/* Password */}
                  <div>
                    <label className="block text-white font-medium mb-2">
                      <Key className="w-4 h-4 inline mr-2" />
                      Password *
                    </label>
                    <div className="relative">
                      <Input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="bg-white/10 border-white/30 text-white placeholder:text-blue-200 pr-10"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password (Registration only) */}
                  {!isLogin && (
                    <div>
                      <label className="block text-white font-medium mb-2">
                        <Key className="w-4 h-4 inline mr-2" />
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Input
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                          className="bg-white/10 border-white/30 text-white placeholder:text-blue-200 pr-10"
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Test Credentials Button (Development only) */}
                  {isLogin && (
                    <Button
                      type="button"
                      onClick={fillTestCredentials}
                      variant="outline"
                      className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
                    >
                      Use Test Credentials
                    </Button>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold"
                  >
                    {isSubmitting ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
                    {isLogin ? <LogIn className="w-4 h-4 ml-2" /> : <UserPlus className="w-4 h-4 ml-2" />}
                  </Button>

                  {/* Toggle Form */}
                  <div className="text-center pt-4">
                    <p className="text-blue-100">
                      {isLogin ? "Don't have an account?" : 'Already have an account?'}
                      <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-white font-semibold ml-2 hover:underline"
                      >
                        {isLogin ? 'Sign Up' : 'Sign In'}
                      </button>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Benefits */}
            <div className="space-y-8">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-xl">
                    What You'll Get Access To
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {[
                      'AI-powered document processing with 98.7% accuracy',
                      'Automated OSHA compliance tracking',
                      'Digital certificates and wallet cards',
                      'Employee training management for 200+ employees',
                      'Real-time compliance dashboards',
                      'Audit-ready reporting in seconds',
                      'Mobile QR code verification',
                      'Automated deadline reminders'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start text-blue-100">
                        <Shield className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">127+</div>
                  <p className="text-white font-semibold mb-1">Companies on Lifer Plan</p>
                  <p className="text-blue-100 text-sm">Join the growing community</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer Links */}
          <div className="text-center mt-12">
            <div className="flex flex-wrap justify-center gap-6 text-blue-100">
              <Link href="/pricing" className="hover:text-white transition-colors">
                View Pricing
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact Support
              </Link>
              <Link href="/" className="hover:text-white transition-colors">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}