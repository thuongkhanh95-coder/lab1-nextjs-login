"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b bg-white sticky top-0 z-50 shadow-sm w-full">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-extrabold text-xl tracking-tight text-slate-900 hover:text-primary transition-colors"
          >
            SE20B Store
          </Link>
          {user && (
            <Link
              href="/account"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Account
            </Link>
          )}
        </div>
        <nav className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span data-testid="user-email" className="text-sm font-medium text-slate-700">
                {user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                data-testid="btn-logout"
                onClick={() => signOut()}
              >
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" data-testid="btn-login">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button data-testid="btn-register">Register</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
