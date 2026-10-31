"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { inspectionCategories, ViewerMedia } from "@/lib/viewerMedia";
import { createPortal } from "react-dom";
import { useScrollLock } from "@/hooks/useScrollLock";

export function DeviceViewer({ images, frames = [], name, productId, color }: { images: string[]; frames?: string[]; name: string; productId?: string; color?: string }) {
  const [open, setOpen] = useState(false);
  const [media, setMedia] = useState<ViewerMedia[]>([]);
  const [category, setCategory] = useState("");
  const [auto, setAuto] = useState(false);
  const [, setMediaError] = useState(false);
  const pointers = useRef(new Map<number, {x:number;y:number}>());
  const pinch = useRef(0);
  const lastTap = useRef(0);
  const gestureStart = useRef(0);
  useEffect(() => { if(!open || !productId) return; let live=true; void supabase.from("product_viewer_media").select("*").eq("product_id", productId).order("display_order").then(({data,error}) => {if(live){setMedia(data || []);setMediaError(Boolean(error));}}); return () => {live=false;}; }, [open,productId]);
  const [spin, setSpin] = useState(false);
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number } | null>(null);
  const matching = media.filter(m => !m.color || m.color === color);
  const rotation = matching.filter(m => m.media_type === "rotation").sort((a,b)=>a.frame_sequence-b.frame_sequence).map(m=>m.image_url);
  const sequence = rotation.length > 1 ? rotation : frames;
  const details = matching.filter(m => m.media_type === "photo" && (!category || m.inspection_category === category));
  const photos = spin ? sequence : category ? details.map(m=>m.image_url) : [...new Set([...images,...details.map(m=>m.image_url)])];
  useEffect(() => { if(!open || !auto || !spin || sequence.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; const timer=window.setInterval(()=>setIndex(i=>(i+1)%sequence.length),100);return ()=>window.clearInterval(timer);},[open,auto,spin,sequence.length]);
  useEffect(() => { if(!open || !spin || !sequence.length) return; [1,-1].forEach(offset=>{const image=new window.Image();image.src=sequence[(index+offset+sequence.length)%sequence.length];}); },[open,spin,index,sequence.join("|")]);
  useScrollLock(open);
  const move = (step: number) => { if(!photos.length)return; setAuto(false); setIndex(i => (i + step + photos.length) % photos.length); setPan({x:0,y:0}); };
  useEffect(() => { if (!open) return; const key = (e: KeyboardEvent) => { if(e.key === "Escape") setOpen(false); if((e.target as HTMLElement).matches("input,select,textarea"))return; if(e.key === "ArrowRight"){e.preventDefault();move(1);} if(e.key === "ArrowLeft"){e.preventDefault();move(-1);} }; window.addEventListener("keydown",key); return () => window.removeEventListener("keydown",key); });
  if (!images.length) return null;
  return <>
    <button onClick={() => {setSpin(false);setCategory("");setAuto(false);pointers.current.clear();setOpen(true);setIndex(0);setZoom(1);setPan({x:0,y:0});}} className="w-full min-h-12 rounded-2xl border border-neutral-300 px-5 py-3 font-semibold">INSPECT THIS IPHONE</button>
    {open && createPortal(<div role="dialog" aria-modal="true" aria-label={`${name} inspection viewer`} className="fixed inset-0 z-[9999] bg-white text-black dark:bg-black dark:text-white flex flex-col p-4 sm:p-6" onKeyDown={e => {if(e.key === "Tab") {const els=e.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled),input,select');const first=els[0],last=els[els.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}}}>
      <div className="flex items-center justify-between gap-4"><h2 className="font-bold truncate">{name}</h2><button autoFocus onClick={() => setOpen(false)} className="rounded-full border px-4 py-3">Close ✕</button></div>
      <div className="flex flex-wrap gap-3 my-3"><button className="border rounded-full px-4 py-2" onClick={() => {setCategory("");setSpin(false);setAuto(false);setPan({x:0,y:0});setIndex(0);setZoom(1);}}>Photos</button>{sequence.length > 1 && <button className="border rounded-full px-4 py-2" onClick={() => {setSpin(true);setIndex(0);setZoom(1);}}>360° rotation</button>}{sequence.length > 1 && <button disabled={sequence.length < 2} title={sequence.length < 2 ? "Genuine 360° images have not been uploaded" : "Automatic rotation"} className="border rounded-full px-4 py-2 disabled:opacity-40" onClick={()=>{setAuto(v=>!v);setSpin(true);setIndex(0);}}>{auto ? "Pause" : "Auto rotate"}</button>}{matching.some(m=>m.media_type === "photo" && m.inspection_category) && <select aria-label="Inspection category" value={category} className="border rounded-xl p-2 bg-white text-black" onChange={e=>{setCategory(e.target.value);setSpin(false);setIndex(0);setZoom(1);setPan({x:0,y:0});}}><option value="">All photos</option>{inspectionCategories.filter(c=>matching.some(m=>m.media_type === "photo" && m.inspection_category===c)).map(c=><option key={c}>{c}</option>)}</select>}</div>
      {sequence.length < 2 && <p className="mb-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 px-4 py-3 text-xs">Photo gallery · Genuine 360° photography is not available for this device. You can browse and zoom the available product photos.</p>}
      <div className="relative flex-1 min-h-0 overflow-hidden bg-white dark:bg-black rounded-2xl touch-none" onDoubleClick={()=>{setZoom(z=>z===1?3:1);setPan({x:0,y:0});setAuto(false);}} onWheel={e=>{setAuto(false);setZoom(z=>Math.max(1,Math.min(5,z-e.deltaY*0.005)));}} onPointerDown={e => {if(e.pointerType==="touch" && pointers.current.size===0){const now=Date.now();if(now-lastTap.current<280){setZoom(z=>z===1?3:1);setPan({x:0,y:0});}lastTap.current=now;}setAuto(false);gestureStart.current=e.clientX;pointers.current.set(e.pointerId,{x:e.clientX,y:e.clientY});drag.current={x:e.clientX,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={e => {if(pointers.current.has(e.pointerId)) pointers.current.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.current.size===2){const [a,b]=Array.from(pointers.current.values());const distance=Math.hypot(a.x-b.x,a.y-b.y);if(pinch.current) setZoom(z=>Math.max(1,Math.min(5,z*distance/pinch.current)));pinch.current=distance;return;}if(!drag.current)return;const dx=e.clientX-drag.current.x,dy=e.clientY-drag.current.y;if(spin && zoom===1){if(Math.abs(dx)>8){move(dx>0?1:-1);drag.current={x:e.clientX,y:e.clientY};}}else if(zoom>1){setPan(p=>({x:Math.max(-500,Math.min(500,p.x+dx)),y:Math.max(-500,Math.min(500,p.y+dy))}));drag.current={x:e.clientX,y:e.clientY};}}} onPointerUp={e => {if(!spin && zoom===1 && pointers.current.size===1 && Math.abs(e.clientX-gestureStart.current)>45)move(e.clientX<gestureStart.current?1:-1);pointers.current.delete(e.pointerId);pinch.current=0;drag.current=null;}} onPointerCancel={e => {pointers.current.delete(e.pointerId);pinch.current=0;drag.current=null;}}>
        <img onError={e=>{e.currentTarget.alt="Photo unavailable. Try another view.";}} key={photos[index]} src={photos[index] || images[0]} alt={`${name}, view ${index+1}`} draggable={false} className="w-full h-full object-contain select-none" style={{transform:`translate(${pan.x}px,${pan.y}px) scale(${zoom})`,transition:drag.current ? "none" : "transform 150ms ease"}} />
        {!spin && <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2 pointer-events-none">{(details.find(m=>m.image_url===photos[index])?.markers || []).map((m,i)=><span key={i} className="rounded-xl bg-black/80 text-white px-3 py-2 text-xs">Verified mark {i+1}: {m.label} ({m.x}%, {m.y}%)</span>)}</div>}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 py-4"><button aria-label="Previous view" className="border rounded-xl p-3" onClick={() => move(-1)}>←</button><span aria-live="polite">{index+1} / {photos.length}</span><button aria-label="Next view" className="border rounded-xl p-3" onClick={() => move(1)}>→</button><button aria-label="Zoom out" className="border rounded-xl p-3" onClick={()=>setZoom(z=>Math.max(1,z-0.5))}>−</button><button aria-label="Zoom in" className="border rounded-xl p-3" onClick={()=>setZoom(z=>Math.min(5,z+0.5))}>+</button><label className="flex items-center gap-2">Zoom<input aria-label="Image zoom" type="range" min="1" max="5" step="0.1" value={zoom} onChange={e => setZoom(Number(e.target.value))} /></label><button className="border rounded-xl p-3" onClick={() => {setIndex(0);setAuto(false);setZoom(1);setPan({x:0,y:0});}}>Reset</button></div>
      <p className="text-xs text-neutral-600 text-center">{spin ? "Drag sideways to rotate. " : "Use arrows to explore available photos. "}Zoom and drag to inspect camera lenses and visible marks. {sequence.length < 2 && "360° photography is not available for this device yet. "}Catalog photos may not show the exact unit; request current condition photos before ordering.</p>
    </div>,document.body)}
  </>;
}
