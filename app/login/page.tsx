"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
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
  const { signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  // Realtime client-side validation cleanup
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
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

    // Call real Supabase Auth when client validation passes
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const { error } = await signIn(email, password);
        if (error) {
          setAuthError(error.message);
        } else {
          router.push("/");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setAuthError(err.message);
        } else {
          setAuthError("Failed to log in");
        }
      } finally {
        setLoading(false);
      }
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
              {authError && (
                <div
                  data-testid="error-auth"
                  className="p-3 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg"
                >
                  {authError}
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
              <Button type="submit" data-testid="login-submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
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
