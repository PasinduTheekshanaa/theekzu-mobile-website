"use client";

import { useState } from "react";
import { Product, ProductVariant, ProductCondition, getConditionVariants, getProductConditions } from "@/data/products";
import { useProducts } from "@/context/ProductContext";

type Notify = (message: string, type: "success" | "error" | "info") => void;
const inputClass = "w-full min-w-0 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-canvas px-3 py-2 text-sm text-ink";

function VariantRow({ product, variant, condition, notify }: { product: Product; variant: ProductVariant; condition: ProductCondition; notify: Notify }) {
  const { updateVariant, deleteVariant } = useProducts();
  const [price, setPrice] = useState(String(variant.price));
  const [stock, setStock] = useState(String(variant.stock));
  const [busy, setBusy] = useState(false);
  const dirty = Number(price) !== variant.price || Number(stock) !== variant.stock;
  const save = async () => {
    if (!Number.isFinite(Number(price)) || Number(price) <= 0 || !Number.isInteger(Number(stock)) || Number(stock) < 0 || !stock.trim()) {
      notify("Enter a positive price and a non-negative whole stock quantity.", "error"); return;
    }
    setBusy(true);
    try {
      const result = await updateVariant(product.id, { ...variant, condition, price: Number(price), stock: Number(stock) });
      notify(result.success ? `${condition}: ${variant.storage} / ${variant.color} saved` : result.error || "Could not save variant", result.success ? "success" : "error");
    } catch { notify("Could not save variant. Please try again.", "error"); }
    finally { setBusy(false); }
  };
  return <div className="grid grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto] gap-3 items-end rounded-xl border border-neutral-200 dark:border-neutral-700 p-3">
    <div className="col-span-2 lg:col-span-1 min-w-0"><p className="text-sm font-bold">{variant.storage} · {variant.color}</p><p className="text-xs break-all mt-1">{variant.sku}</p></div>
    <label className="text-xs font-semibold">Price (LKR)<input aria-label={`${condition} ${variant.storage} ${variant.color} price`} type="number" min="1" step="any" value={price} disabled={busy} onChange={e => setPrice(e.target.value)} className={inputClass} /></label>
    <label className="text-xs font-semibold">Stock quantity<input aria-label={`${condition} ${variant.storage} ${variant.color} stock`} type="number" min="0" step="1" value={stock} disabled={busy} onChange={e => setStock(e.target.value)} className={inputClass} /></label>
    <div className="col-span-2 lg:col-span-1 flex gap-2">
      <button type="button" data-ui="primary" disabled={busy || !dirty} onClick={() => void save()} className="rounded-lg px-4 py-2 text-xs font-bold disabled:opacity-40">{busy ? "Saving…" : dirty ? "Save changes" : "Saved"}</button>
      <button type="button" disabled={busy} className="rounded-lg border border-neutral-300 px-3 py-2 text-xs" onClick={async () => {
        if (!confirm(`Delete ${condition} ${variant.storage} / ${variant.color}?`)) return;
        setBusy(true);
        try { const result = await deleteVariant(product.id, variant.id); notify(result.success ? "Variant deleted" : result.error || "Could not delete variant", result.success ? "info" : "error"); }
        finally { setBusy(false); }
      }}>Delete</button>
    </div>
  </div>;
}

function ConditionSection({ product, condition, notify }: { product: Product; condition: ProductCondition; notify: Notify }) {
  const { addVariant } = useProducts();
  const variants = getConditionVariants(product, condition);
  const [storage, setStorage] = useState("");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [busy, setBusy] = useState(false);
  const enabled = getProductConditions(product).includes(condition);
  const add = async () => {
    if (!storage.trim() || !color.trim() || !Number.isFinite(Number(price)) || Number(price) <= 0 || !stock.trim() || !Number.isInteger(Number(stock)) || Number(stock) < 0) {
      notify("Enter storage, colour, a positive price and a whole stock quantity.", "error"); return;
    }
    if (variants.some(v => v.storage.toLowerCase() === storage.trim().toLowerCase() && v.color.toLowerCase() === color.trim().toLowerCase())) {
      notify("This combination already exists in this condition. Edit its price above.", "error"); return;
    }
    setBusy(true);
    try {
      const sku = `TM-${product.slug}-${storage.trim()}-${color.trim()}-${condition === "Used" ? "USED" : "NEW"}`.replace(/\s+/g, "-");
      const ok = await addVariant(product.id, { id: `new-${Date.now()}`, condition, storage: storage.trim(), color: color.trim(), price: Number(price), stock: Number(stock), sku });
      if (ok) { setStorage(""); setColor(""); setPrice(""); setStock("0"); }
      notify(ok ? `${condition} variant added` : "Could not add variant. Check that the condition-variants database migration has been applied.", ok ? "success" : "error");
    } catch { notify("Could not add variant. Please try again.", "error"); }
    finally { setBusy(false); }
  };
  return <section aria-label={`${condition} variants`} className="rounded-2xl border border-neutral-300 dark:border-neutral-600 p-4 sm:p-5 space-y-4">
    <div><h3 className="text-base font-bold">{condition}{product.category === "iphones" ? " iPhones" : " accessories"} — prices & stock</h3>
      <p className="text-xs mt-1">{variants.length} variants · {product.category === "iphones" ? "Separate pricing and inventory for this condition." : "Accessories are always Brand New."}</p>
      {!enabled && <p className="text-xs mt-2">This condition is hidden from customers. Enable it under Available conditions when ready.</p>}
    </div>
    {variants.length === 0 && <p className="text-sm">No {condition.toLowerCase()} variants yet. Add a price and stock below.</p>}
    <div className="space-y-3">{variants.map(v => <VariantRow key={`${v.id}:${v.price}:${v.stock}`} product={product} variant={v} condition={condition} notify={notify} />)}</div>
    <form onSubmit={e => { e.preventDefault(); void add(); }} className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-600 p-3 space-y-3">
      <h4 className="text-sm font-bold">Add {condition} variant</h4>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <label className="text-xs">{product.category === "iphones" ? "Storage" : "Model / option"}<input required value={storage} onChange={e => setStorage(e.target.value)} placeholder={product.category === "iphones" ? "128GB" : "Standard"} className={inputClass} /></label>
        <label className="text-xs">Colour<input required value={color} onChange={e => setColor(e.target.value)} placeholder="Black" className={inputClass} /></label>
        <label className="text-xs">Price (LKR)<input required type="number" min="1" step="any" value={price} onChange={e => setPrice(e.target.value)} className={inputClass} /></label>
        <label className="text-xs">Stock quantity<input required type="number" min="0" step="1" value={stock} onChange={e => setStock(e.target.value)} className={inputClass} /></label>
      </div>
      <button data-ui="primary" disabled={busy} className="rounded-lg px-4 py-2 text-xs font-bold disabled:opacity-40">{busy ? "Adding…" : `Add ${condition} variant`}</button>
    </form>
  </section>;
}

export function ConditionVariantManager({ product, notify }: { product: Product; notify: Notify }) {
  const conditions: ProductCondition[] = product.category === "iphones" ? ["Brand New", "Used"] : ["Brand New"];
  return <div className="space-y-5 p-4 sm:p-6 border-t border-neutral-200 dark:border-neutral-700">
    {conditions.map(condition => <ConditionSection key={condition} product={product} condition={condition} notify={notify} />)}
  </div>;
}
