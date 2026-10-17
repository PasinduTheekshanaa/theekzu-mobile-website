"use client";
export default function StoreError({ reset }: { reset: () => void }) {
  return <div className="container-custom py-20 text-center space-y-4"><h1 className="text-2xl font-bold">Temporarily unavailable</h1><p>We could not load this page. Please try again shortly.</p><button data-ui="primary" className="rounded-xl bg-canvas text-ink px-6 py-3" onClick={reset}>Try again</button></div>;
}
