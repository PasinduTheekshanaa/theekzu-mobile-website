"use client";
export default function StoreError({ reset }: { reset: () => void }) {
  return <div className="container-custom py-20 text-center space-y-4"><h1 className="text-2xl font-bold">Temporarily unavailable</h1><p>We could not load this page. Please try again shortly.</p><button className="rounded-xl bg-blue-700 text-white px-6 py-3" onClick={reset}>Try again</button></div>;
}
