"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return (
    <main className="site dark api-error-page">
      <section className="api-empty-state">
        <h1>We could not load this page</h1>
        <p>The content API did not return a usable response.</p>
        <button type="button" className="gradient-button" onClick={reset}>Try again</button>
      </section>
    </main>
  );
}
