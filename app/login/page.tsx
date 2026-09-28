"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [successMessage, setSuccessMessage] = useState("");

  const isValidEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  // Realtime validation: an error disappears once its field is valid
  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (errors.email) {
      if (val.trim() && isValidEmail(val)) {
        setErrors((prev) => ({ ...prev, email: undefined }));
      }
    }
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (errors.password) {
      if (val.length > 0) {
        setErrors((prev) => ({ ...prev, password: undefined }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    const newErrors: { email?: string; password?: string } = {};

    // Validate email
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Validate password
    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSuccessMessage("Login successful (demo)");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col w-full overflow-x-hidden">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-900">Login</CardTitle>
            <CardDescription className="text-slate-500">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit} noValidate data-testid="login-form">
            <CardContent className="space-y-4">
              {successMessage && (
                <div
                  data-testid="form-success"
                  className="p-3 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg"
                >
                  {successMessage}
                </div>
              )}

              {/* Email field */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-slate-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  data-testid="login-email"
                  className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {errors.email && (
                  <p data-testid="error-email" className="text-xs text-red-500 font-medium">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-slate-700">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  data-testid="login-password"
                  className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {errors.password && (
                  <p data-testid="error-password" className="text-xs text-red-500 font-medium">
                    {errors.password}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pt-2">
              <Button type="submit" data-testid="login-submit" className="w-full">
                Sign In
              </Button>
              <p className="text-xs text-center text-slate-500">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-blue-600 hover:underline font-semibold">
                  Register
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
