"use client";

import { useEffect } from "react";

export default function Error({
  error,
  retry: reset,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      data-testid="error-boundary"
      className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 p-4 text-center"
    >
      <h2 className="text-xl font-bold text-slate-800">
        Something went wrong.
      </h2>
      <p className="text-sm text-slate-500">
        Please try again. If the problem continues, reload the page.
      </p>
      <button
        type="button"
        data-testid="btn-retry"
        onClick={reset}
        className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
