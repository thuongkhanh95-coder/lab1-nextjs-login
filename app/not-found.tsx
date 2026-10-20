import Link from "next/link";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div
      data-testid="not-found"
      className="min-h-screen bg-slate-50 flex flex-col w-full overflow-x-hidden"
    >
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-6xl font-black text-slate-800 mb-2">404</h1>
        <h2 className="text-xl font-bold text-slate-700 mb-2">Page Not Found</h2>
        <p className="text-sm text-slate-500 max-w-sm mb-6">
          The product or page you are looking for does not exist or has been removed.
        </p>
        <Link href="/">
          <Button variant="default">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
