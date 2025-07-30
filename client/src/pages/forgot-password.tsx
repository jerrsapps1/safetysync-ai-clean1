import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "wouter";
import { CheckCircle, ArrowLeft, Mail } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);
      } else {
        setError(result.message || "Failed to send reset email");
      }
    } catch (error) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-white text-2xl">Check Your Email</CardTitle>
            <CardDescription className="text-blue-100">
              Password reset instructions sent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-4">
              <div className="bg-blue-800/20 p-4 rounded-lg border border-blue-400/30">
                <Mail className="mx-auto mb-2 w-8 h-8 text-blue-200" />
                <p className="text-blue-100 text-sm">
                  If an account with that email exists, we've sent you password reset instructions.
                </p>
                <p className="text-blue-200 text-xs mt-2">
                  The reset link will expire in 1 hour for security.
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-blue-100 text-sm">Didn't receive the email?</p>
                <Button
                  variant="outline"
                  className="w-full bg-transparent border-white/30 text-white hover:bg-white/10"
                  onClick={() => {
                    setIsSuccess(false);
                    form.reset();
                  }}
                >
                  Try Again
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-white/20">
              <Link href="/client-portal">
                <Button
                  variant="ghost"
                  className="w-full text-blue-100 hover:text-white hover:bg-white/10"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-white text-2xl">Reset Password</CardTitle>
          <CardDescription className="text-blue-100">
            Enter your email address and we'll send you reset instructions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert className="bg-red-500/10 border-red-400/30 text-red-100">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email address"
                        className="bg-white/10 border-white/30 text-white placeholder:text-blue-200 focus:border-white/50"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Instructions"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 pt-4 border-t border-white/20">
            <Link href="/client-portal">
              <Button
                variant="ghost"
                className="w-full text-blue-100 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}