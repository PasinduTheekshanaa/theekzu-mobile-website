"use client";
export interface StockSelection { inStock: boolean; outOfStock: boolean }
export function StockFilter({value,onChange}: {value:StockSelection;onChange:(value:StockSelection)=>void}) {
 return <fieldset className="flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-200 p-4"><legend className="px-2 text-xs font-bold">Availability</legend>{([{key:'inStock',label:'In Stock'},{key:'outOfStock',label:'Out of Stock'}] as const).map(({key,label})=><label key={key} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-neutral-200 px-4 py-2 text-sm"><input type="checkbox" checked={value[key]} onChange={e=>onChange({...value,[key]:e.target.checked})} className="h-4 w-4 accent-black" />{label}</label>)}<p className="text-xs text-neutral-500">Select either option to filter. Both or neither shows all products.</p></fieldset>;
}
