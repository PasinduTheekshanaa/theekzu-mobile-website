export default function ProductLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-200" aria-busy="true" aria-live="polite">
      <div className="h-4 w-44 rounded-full skeleton mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-6 h-80 sm:h-[480px] rounded-[2rem] skeleton" />
        <div className="lg:col-span-6 space-y-5 pt-2">
          <div className="h-5 w-28 rounded-full skeleton" />
          <div className="h-12 w-4/5 rounded-xl skeleton" />
          <div className="h-5 w-2/5 rounded-full skeleton" />
          <div className="h-24 rounded-2xl skeleton" />
          <div className="h-14 rounded-full skeleton" />
        </div>
      </div>
      <p className="mt-6 text-center text-xs font-medium text-slate-500 dark:text-zinc-400">Opening product details…</p>
    </div>
  );
}
