"use client";

import { useId, useState } from "react";
import { AccessoryTypeOption, normalizeAccessoryType } from "@/lib/accessoryTypes";

export function AccessoryTypeSelect({ value, onChange, options }: {
  value: string;
  onChange: (value: string) => void;
  options: AccessoryTypeOption[];
}) {
  const id = useId();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const selectedValue = options.find(option => option.value.toLowerCase() === value.toLowerCase())?.value || value;
  const add = () => {
    const clean = normalizeAccessoryType(name);
    if (!clean) { setError("Enter a specific accessory type name."); return; }
    const existing = options.find(option => [option.value, option.label].some(label => label.toLowerCase() === clean.toLowerCase()));
    onChange(existing?.value || clean);
    setName("");
    setError("");
    setAdding(false);
  };
  return <div className="min-w-0">
    <label htmlFor={id} className="font-bold block mb-1">Accessory Type:</label>
    <select id={id} value={selectedValue} onChange={e => onChange(e.target.value)} className="w-full p-2 rounded-xl bg-canvas text-ink border border-line focus:outline-none">
      {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
    <button type="button" onClick={() => setAdding(!adding)} aria-expanded={adding} className="mt-2 text-xs font-bold underline underline-offset-4">
      {adding ? "Cancel new type" : "+ Add Type"}
    </button>
    {adding && <div className="mt-2 space-y-2">
      <label htmlFor={`${id}-new`} className="block text-xs font-semibold">New accessory type</label>
      <input id={`${id}-new`} autoFocus value={name} onChange={e => setName(e.target.value)} maxLength={60}
        onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
        placeholder="e.g. Earbuds & Headphones" className="w-full p-2 rounded-xl bg-canvas text-ink border border-line" />
      <button type="button" data-ui="primary" disabled={!name.trim()} onClick={add} className="px-3 py-2 rounded-xl text-xs font-bold">Use Type</button>
      {error && <p role="alert" className="text-xs">{error}</p>}
      <p className="text-xs leading-relaxed">The type is saved with this product and becomes available for other products.</p>
    </div>}
  </div>;
}
