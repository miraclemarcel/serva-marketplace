"use client";

import "./globals.css";

export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en">
      <body className="grid min-h-dvh place-items-center bg-paper px-4 text-ink">
        <title>Something went wrong · Serva</title>
        <div className="max-w-md text-center" role="alert">
          <h1 className="text-3xl font-bold">Something went wrong</h1>
          <p className="mt-3 text-muted">An unexpected error stopped Serva from loading. Please try again.</p>
          {error.digest && <p className="mt-2 text-xs text-muted">Reference: {error.digest}</p>}
          <button type="button" onClick={retry} className="btn-primary mt-6">
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
