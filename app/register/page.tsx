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

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState("");

  const isValidEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  // Realtime validation: an error disappears once its field is valid
  const handleFullNameChange = (val: string) => {
    setFullName(val);
    if (errors.fullName && val.trim().length > 0) {
      setErrors((prev) => ({ ...prev, fullName: undefined }));
    }
  };

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
    if (errors.password && val.length >= 6) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
    // Also clear confirm password error if matching
    if (errors.confirmPassword && confirmPassword && val === confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    }
  };

  const handleConfirmPasswordChange = (val: string) => {
    setConfirmPassword(val);
    if (errors.confirmPassword && val.length > 0 && val === password) {
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    const newErrors: FormErrors = {};

    // 1. Full name: empty or spaces only -> "Full name is required"
    if (!fullName || fullName.trim().length === 0) {
      newErrors.fullName = "Full name is required";
    }

    // 2. Email: empty -> "Email is required" / not valid -> "Please enter a valid email address"
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // 3. Password: empty -> "Password is required" / fewer than 6 -> "Password must be at least 6 characters"
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // 4. Confirm password: empty -> "Confirm password is required" / different -> "Passwords do not match"
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSuccessMessage("Registration successful (demo)");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col w-full overflow-x-hidden">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg bg-white my-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-900">Create an account</CardTitle>
            <CardDescription className="text-slate-500">
              Enter your details below to create your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit} noValidate data-testid="register-form">
            <CardContent className="space-y-4">
              {successMessage && (
                <div
                  data-testid="form-success"
                  className="p-3 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg"
                >
                  {successMessage}
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-slate-700">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => handleFullNameChange(e.target.value)}
                  data-testid="register-name"
                  className={errors.fullName ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {errors.fullName && (
                  <p data-testid="error-name" className="text-xs text-red-500 font-medium">
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-slate-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  data-testid="register-email"
                  className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {errors.email && (
                  <p data-testid="error-email" className="text-xs text-red-500 font-medium">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-slate-700">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  data-testid="register-password"
                  className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {errors.password && (
                  <p data-testid="error-password" className="text-xs text-red-500 font-medium">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-slate-700">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  data-testid="register-confirm-password"
                  className={errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {errors.confirmPassword && (
                  <p data-testid="error-confirm-password" className="text-xs text-red-500 font-medium">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pt-2">
              <Button type="submit" data-testid="register-submit" className="w-full">
                Register
              </Button>
              <p className="text-xs text-center text-slate-500">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:underline font-semibold">
                  Login
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
