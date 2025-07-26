import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Mail, AlertCircle, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function VerifyEmailPage() {
  const [location, navigate] = useLocation();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
      setVerificationStatus('error');
      setMessage('Invalid verification link. Please check your email for the correct link.');
      return;
    }

    // Verify the email token
    const verifyEmail = async () => {
      try {
        const response = await apiRequest(`/api/auth/verify-email?token=${token}`, {
          method: 'GET'
        });

        if (response.success) {
          setVerificationStatus('success');
          setMessage('Your email has been verified successfully! You can now access your workspace.');
          
          // Show success toast
          toast({
            title: "Email Verified! 🎉",
            description: "Your account is now active. Redirecting to your workspace...",
            duration: 5000,
          });

          // Redirect to workspace after delay
          setTimeout(() => {
            navigate('/workspace');
          }, 3000);
        } else {
          if (response.message?.includes('expired')) {
            setVerificationStatus('expired');
            setMessage('This verification link has expired. Please request a new verification email.');
          } else {
            setVerificationStatus('error');
            setMessage(response.message || 'Email verification failed. Please try again.');
          }
        }
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('error');
        setMessage('Network error occurred during verification. Please try again.');
      }
    };

    verifyEmail();
  }, [toast, navigate]);

  const handleResendEmail = async () => {
    try {
      const response = await apiRequest('/api/auth/resend-verification', {
        method: 'POST'
      });

      if (response.success) {
        toast({
          title: "Email Sent! 📧",
          description: "A new verification email has been sent to your inbox.",
          duration: 5000,
        });
      } else {
        toast({
          title: "Resend Failed",
          description: response.message || "Unable to resend verification email.",
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Unable to resend verification email. Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-blue-700/50 border-blue-600/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {verificationStatus === 'loading' && (
              <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
            )}
            {verificationStatus === 'success' && (
              <CheckCircle className="w-12 h-12 text-emerald-400" />
            )}
            {(verificationStatus === 'error' || verificationStatus === 'expired') && (
              <AlertCircle className="w-12 h-12 text-red-400" />
            )}
          </div>
          
          <CardTitle className="text-xl font-bold text-white">
            {verificationStatus === 'loading' && "Verifying Your Email..."}
            {verificationStatus === 'success' && "Email Verified!"}
            {verificationStatus === 'error' && "Verification Failed"}
            {verificationStatus === 'expired' && "Link Expired"}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          <p className="text-gray-300 leading-relaxed">
            {message}
          </p>
          
          {verificationStatus === 'success' && (
            <div className="space-y-4">
              <div className="bg-emerald-900/20 border border-emerald-700/50 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 text-emerald-300">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Account Activated</span>
                </div>
                <p className="text-emerald-400 text-sm mt-2">
                  You now have full access to SafetySync.AI
                </p>
              </div>
              
              <Button 
                onClick={() => navigate('/workspace')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Access Your Workspace
              </Button>
            </div>
          )}
          
          {verificationStatus === 'expired' && (
            <div className="space-y-4">
              <Button 
                onClick={handleResendEmail}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send New Verification Email
              </Button>
            </div>
          )}
          
          {verificationStatus === 'error' && (
            <div className="space-y-4">
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full border-blue-500 text-gray-300 hover:bg-blue-600"
              >
                Return to Homepage
              </Button>
              
              <Button 
                onClick={handleResendEmail}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Mail className="w-4 h-4 mr-2" />
                Resend Verification Email
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}