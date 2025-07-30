import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link, useLocation } from "wouter";
import { CheckCircle, Eye, EyeOff, Shield, AlertTriangle } from "lucide-react";

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [location] = useLocation();

  useEffect(() => {
    // Extract token from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('token');
    
    if (resetToken) {
      setToken(resetToken);
    } else {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [location]);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = form.watch("password");

  // Password strength validation
  const passwordStrength = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const strengthScore = Object.values(passwordStrength).filter(Boolean).length;

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError("Invalid reset token. Please request a new password reset.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);
      } else {
        setError(result.message || "Failed to reset password");
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
            <CardTitle className="text-white text-2xl">Password Reset Successful</CardTitle>
            <CardDescription className="text-blue-100">
              Your password has been updated successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-4">
              <div className="bg-green-500/10 p-4 rounded-lg border border-green-400/30">
                <Shield className="mx-auto mb-2 w-8 h-8 text-green-200" />
                <p className="text-green-100 text-sm">
                  Your password has been successfully reset. You can now log in with your new password.
                </p>
              </div>
            </div>

            <Link href="/client-portal">
              <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold">
                Continue to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-white text-2xl">Invalid Reset Link</CardTitle>
            <CardDescription className="text-blue-100">
              This password reset link is invalid or has expired
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-red-500/10 border-red-400/30 text-red-100">
              <AlertDescription>
                Please request a new password reset to continue.
              </AlertDescription>
            </Alert>

            <Link href="/forgot-password">
              <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold">
                Request New Reset
              </Button>
            </Link>

            <Link href="/client-portal">
              <Button
                variant="ghost"
                className="w-full text-blue-100 hover:text-white hover:bg-white/10"
              >
                Back to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-white text-2xl">Set New Password</CardTitle>
          <CardDescription className="text-blue-100">
            Choose a strong password for your account
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your new password"
                          className="bg-white/10 border-white/30 text-white placeholder:text-blue-200 focus:border-white/50 pr-10"
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 text-blue-200 hover:text-white"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />

              {password && (
                <div className="space-y-2">
                  <div className="text-xs text-blue-100">Password strength:</div>
                  <div className="space-y-1">
                    {[
                      { key: 'length', label: 'At least 8 characters' },
                      { key: 'uppercase', label: 'One uppercase letter' },
                      { key: 'lowercase', label: 'One lowercase letter' },
                      { key: 'number', label: 'One number' },
                      { key: 'special', label: 'One special character' },
                    ].map((requirement) => (
                      <div key={requirement.key} className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            passwordStrength[requirement.key as keyof typeof passwordStrength]
                              ? 'bg-green-400'
                              : 'bg-white/30'
                          }`}
                        />
                        <span
                          className={`text-xs ${
                            passwordStrength[requirement.key as keyof typeof passwordStrength]
                              ? 'text-green-200'
                              : 'text-blue-200'
                          }`}
                        >
                          {requirement.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                          i <= strengthScore
                            ? strengthScore <= 2
                              ? 'bg-red-400'
                              : strengthScore <= 4
                              ? 'bg-yellow-400'
                              : 'bg-green-400'
                            : 'bg-white/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Confirm New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your new password"
                          className="bg-white/10 border-white/30 text-white placeholder:text-blue-200 focus:border-white/50 pr-10"
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 text-blue-200 hover:text-white"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold"
                disabled={isLoading || strengthScore < 5}
              >
                {isLoading ? "Updating Password..." : "Update Password"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}