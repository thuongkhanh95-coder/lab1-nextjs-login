"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col w-full overflow-x-hidden">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        <div data-testid="account-page" className="w-full max-w-md">
          <Card className="shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-slate-900">Your Account</CardTitle>
              <CardDescription className="text-slate-500">
                Manage your profile and authentication status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">
                  Email Address
                </p>
                <p data-testid="account-email" className="text-base font-semibold text-slate-900">
                  {user.email}
                </p>
              </div>
              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => signOut()}
                >
                  Log out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
