"use client";
import type { StockSelection } from '@/lib/stockFilter';
export type { StockSelection } from '@/lib/stockFilter';
export function StockFilter({value,onChange}: {value:StockSelection;onChange:(value:StockSelection)=>void}) {
 return <label className="flex flex-col gap-2 text-sm font-semibold sm:max-w-xs">Availability<select value={value} onChange={e=>onChange(e.target.value as StockSelection)} className="w-full min-h-12 rounded-xl border border-neutral-300 bg-canvas text-ink px-4 py-3 focus-visible:outline-offset-4"><option value="all">All Products</option><option value="in-stock">In Stock</option><option value="out-of-stock">Out of Stock</option></select></label>;
}
