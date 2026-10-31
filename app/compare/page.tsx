"use client";

import { useState } from "react";
import Link from "next/link";
import { useProducts } from "@/context/ProductContext";
import { getEnabledVariants, getProductConditionLabel } from "@/data/products";
import { formatLKR } from "@/config/store";

export default function ComparePage() {
  const { products, isLoading, getLowestPrice, getProductPrimaryImage, catalogError } = useProducts();
  const phones = products.filter(p => p.category === "iphones");
  const [selection, setSelection] = useState<string[]>(["", "", ""]);
  const [budget, setBudget] = useState("");
  const [differences, setDifferences] = useState(false);
  const chosen = selection.map(id => phones.find(p => p.id === id));
  const candidates = phones.filter(p => !budget || (getLowestPrice(p) > 0 && getLowestPrice(p) <= Number(budget))).sort((a,b) => getLowestPrice(a)-getLowestPrice(b));
  const rows = [
    { label: "Device only price", values: chosen.map(p => p ? getLowestPrice(p) > 0 ? `From ${formatLKR(getLowestPrice(p))}` : "Ask for price" : "—") },
    { label: "Condition", values: chosen.map(p => p ? getProductConditionLabel(p) : "—") },
    { label: "Available storage", values: chosen.map(p => p ? [...new Set(getEnabledVariants(p).filter(v => v.stock > 0).map(v => v.storage))].join(", ") || "Check availability" : "—") },
    ...[ ["chip", "Chip"], ["display", "Display"], ["camera", "Camera"], ["battery", "Battery"], ["build", "Build"] ].map(([key,label]) => ({ label, values: chosen.map(p => p ? p.specifications[key] || "Details coming soon" : "—") })),
  ];
  const count = chosen.filter(Boolean).length;
  return <div className="container-custom py-8 sm:py-12 space-y-8">
    <header className="max-w-2xl space-y-4"><p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Find your fit</p><h1 className="text-3xl sm:text-5xl font-black tracking-tight">Advanced iPhone Comparison</h1><p className="text-neutral-600">Compare up to three iPhones side by side. Explore prices, storage and specifications to find the right model for you.</p></header>
    <section className="rounded-3xl border border-neutral-200 p-5 sm:p-7 space-y-5" aria-label="Find models within your budget">
      <label className="block text-sm font-semibold">Your maximum budget (LKR)<input type="number" min="0" step="1000" value={budget} onChange={e => setBudget(e.target.value)} placeholder="Any budget" className="mt-2 block w-full sm:max-w-xs rounded-xl border border-neutral-300 p-3" /></label>
      <p className="text-sm text-neutral-600">{isLoading ? "Loading iPhones…" : `${candidates.length} models${budget ? " within your budget" : " to explore"}. Prices depend on condition and storage.`}</p>
      {catalogError && <p role="status" className="text-sm">Some catalog information could not be loaded. Please refresh or contact us for availability.</p>}
      <div className="grid sm:grid-cols-3 gap-4">{selection.map((id,i) => <label key={i} className="text-sm font-semibold">iPhone {i+1}<select value={id} onChange={e => setSelection(previous => previous.map((v,j) => j === i ? e.target.value : v))} className="mt-2 w-full rounded-xl border border-neutral-300 bg-white p-3"><option value="">Select a model</option>{phones.filter(p => p.id === id || candidates.some(c => c.id === p.id)).map(p => <option key={p.id} value={p.id} disabled={selection.includes(p.id) && id !== p.id}>{p.name}</option>)}</select></label>)}</div>
    </section>
    <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={differences} onChange={e => setDifferences(e.target.checked)} disabled={count < 2} />Show differences only</label>
    {count === 0 ? <div className="rounded-3xl bg-neutral-50 border p-10 text-center text-neutral-600">Choose your first iPhone above to start comparing.</div> : <div className="overflow-x-auto rounded-3xl border border-neutral-200"><table className="w-full min-w-[700px] text-sm text-left"><caption className="sr-only">Selected iPhone specifications and prices</caption><thead><tr><th scope="col" className="p-5 w-40">Compare models</th>{chosen.map((p,i) => <th scope="col" key={i} className="p-5 min-w-[180px]">{p ? <div className="space-y-3"><img src={getProductPrimaryImage(p)} alt={p.name} className="h-36 w-full object-contain" /><p className="text-lg font-bold">{p.name}</p><Link href={`/product/${p.slug}`} className="inline-flex rounded-full bg-black text-white px-4 py-2 text-xs">View device →</Link></div> : "Select a model"}</th>)}</tr></thead><tbody>{rows.filter(row => !differences || new Set(row.values.filter((_,i) => chosen[i])).size > 1).map(row => <tr key={row.label} className="border-t border-neutral-200 even:bg-neutral-50"><th scope="row" className="p-5 font-semibold">{row.label}</th>{row.values.map((value,i) => <td key={i} className="p-5 leading-relaxed">{value}</td>)}</tr>)}</tbody></table></div>}
    <p className="text-xs text-neutral-500">Specifications reflect our current catalog. Battery condition on used devices varies by unit; confirm details before ordering. On mobile, swipe the comparison table sideways.</p>
  </div>;
}
