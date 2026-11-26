"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ReviewPhotoGallery({ photos, customerName }: { photos: string[]; customerName: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const moveTo = (index: number) => {
    const element = track.current;
    if (!element) return;
    const next = Math.max(0, Math.min(photos.length - 1, index));
    element.scrollTo({ left: next * element.clientWidth, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <div className="min-w-0 bg-neutral-100 p-4 sm:p-6 flex flex-col justify-center" role="region" aria-roledescription={photos.length > 1 ? "carousel" : undefined} aria-label={"Photos shared by " + customerName}
      onKeyDown={event => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          moveTo(active + (event.key === "ArrowRight" ? 1 : -1));
        }
      }}>
      <div ref={track} className="review-photo-track flex w-full snap-x snap-mandatory overflow-x-auto rounded-2xl" style={{ scrollbarWidth: "none" }}
        onScroll={event => {
          const element = event.currentTarget;
          if (element.clientWidth) setActive(Math.max(0, Math.min(photos.length - 1, Math.round(element.scrollLeft / element.clientWidth))));
        }}>
        {photos.map((url, index) => (
          <div key={index} className="w-full shrink-0 snap-center snap-always" role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${photos.length}`}>
            <a href={url} target="_blank" rel="noopener noreferrer" className="flex h-72 sm:h-80 w-full items-center justify-center rounded-xl focus-visible:outline-offset-[-3px]" aria-label={`Open photo ${index + 1} shared by ${customerName}`}>
              <img src={url} alt={`Photo ${index + 1} shared by ${customerName}`} loading="lazy" decoding="async" draggable={false} className="h-full w-full object-contain" />
            </a>
          </div>
        ))}
      </div>
      {photos.length > 1 && <div className="mt-3 flex items-center justify-between gap-2">
        <button type="button" onClick={() => moveTo(active - 1)} disabled={active === 0} aria-label="Previous photo" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white transition-colors hover:bg-neutral-200 disabled:opacity-30"><ChevronLeft className="h-5 w-5" aria-hidden="true" /></button>
        <div className="flex flex-col items-center">
          <div className="flex items-center" aria-label="Choose a photo">
            {photos.map((_, index) => <button key={index} type="button" onClick={() => moveTo(index)} aria-label={`Show photo ${index + 1}`} aria-current={active === index ? "true" : undefined} className="flex h-8 w-8 items-center justify-center rounded-full"><span className={"h-2 rounded-full transition-all motion-reduce:transition-none " + (active === index ? "w-5 bg-black" : "w-2 bg-neutral-400")} /></button>)}
          </div>
          <p className="text-xs text-neutral-600" aria-live="polite" aria-atomic="true">{active + 1} / {photos.length}</p>
        </div>
        <button type="button" onClick={() => moveTo(active + 1)} disabled={active === photos.length - 1} aria-label="Next photo" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white transition-colors hover:bg-neutral-200 disabled:opacity-30"><ChevronRight className="h-5 w-5" aria-hidden="true" /></button>
      </div>}
    </div>
  );
}
