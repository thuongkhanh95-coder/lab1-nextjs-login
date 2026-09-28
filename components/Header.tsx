import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-b bg-white sticky top-0 z-50 shadow-sm w-full">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-extrabold text-xl tracking-tight text-slate-900 hover:text-primary transition-colors"
        >
          SE20B Store
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="outline" data-testid="btn-login">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button data-testid="btn-register">
              Register
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
