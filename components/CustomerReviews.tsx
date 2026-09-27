"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Star,
  CheckCircle2,
  Quote,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  MessageSquarePlus,
  Send,
  AlertCircle,
  X,
  ShieldCheck,
} from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import {
  fetchApprovedCustomerReviews,
  submitCustomerReview,
  CustomerReview as SupabaseReview,
} from "@/lib/supabaseService";

export interface UnifiedReview {
  id: string;
  name: string;
  location?: string;
  rating: number;
  productBought?: string;
  reviewText: string;
  imageUrl?: string;
  verified: boolean;
  date?: string;
  isRealReview?: boolean;
}

export const CustomerReviews: React.FC = () => {
  const [supabaseApprovedReviews, setSupabaseApprovedReviews] = useState<SupabaseReview[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalApproved, setTotalApproved] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [page, setPage] = useState(0);
  const reviewRequest = useRef(0);

  // Carousel State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Feedback Form State
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [formReview, setFormReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  const [formImage, setFormImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!formImage) { setImagePreview(null); return; }
    const url = URL.createObjectURL(formImage);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [formImage]);

  // Load approved reviews from Supabase
  const loadApprovedReviews = async () => {
    const request = ++reviewRequest.current;
    try {
      setIsLoading(true);
      const res = await fetchApprovedCustomerReviews(page);
      if (request !== reviewRequest.current) return;
      setLoadError(!res.tableReady);
      if (res && res.reviews) {
        // Strict requirement: Only approved Supabase reviews can be shown
        const approvedOnly = res.reviews.filter((r) => r.status === "approved");
        setSupabaseApprovedReviews(approvedOnly);
        setAverageRating(res.averageRating || 0);
        setTotalApproved(res.totalCount || approvedOnly.length);
      }
    } catch (err) {
      setLoadError(true);
    } finally { if (request === reviewRequest.current) setIsLoading(false); }
  };

  useEffect(() => {
    setCurrentIndex(0);
    loadApprovedReviews();

    const timer = setInterval(() => { if (document.visibilityState === "visible") loadApprovedReviews(); }, 60000);
    // Supabase Realtime subscription for live storefront updates
    if (isSupabaseConfigured()) {
      const channel = supabase
        .channel("storefront-customer-reviews-channel")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "customer_reviews" },
          () => {
            loadApprovedReviews();
          }
        )
        .subscribe();

      return () => {
        clearInterval(timer);
        ++reviewRequest.current;
        supabase.removeChannel(channel);
      };
    }
    return () => { clearInterval(timer); ++reviewRequest.current; };
  }, [page]);

  // Format submission date nicely (e.g. "Sep 24, 2026")
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dateString;
    }
  };

  // Display only moderated reviews; approval does not imply a verified purchase.
  const allReviews: UnifiedReview[] = useMemo(() => {
    // 1. Approved reviews from Supabase (displayed at front of carousel)
    const liveItems: UnifiedReview[] = supabaseApprovedReviews
      .filter((r) => r.status === "approved")
      .map((r) => ({
        id: r.id,
        name: r.customer_name,
        location: undefined,
        rating: r.rating || 5,
        productBought: undefined,
        reviewText: r.review_text || r.review || "",
        imageUrl: r.image_url,
        verified: false,
        date: formatDate(r.created_at),
        isRealReview: true,
      }));

    return liveItems;
  }, [supabaseApprovedReviews]);

  // Carousel Auto-play every 5 seconds, pauses on mouse hover
  useEffect(() => {
    if (isPaused || allReviews.length <= 1 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allReviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, allReviews.length]);

  const prevSlide = () => {
    if (allReviews.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? allReviews.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    if (allReviews.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % allReviews.length);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = touchStartX.current;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      nextSlide();
    } else if (touchEndX.current - touchStartX.current > 50) {
      prevSlide();
    }
  };

  // Handle Review Submission to Supabase
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedName = formName.trim();
    const trimmedReview = formReview.trim();

    if (trimmedName.length < 2) {
      setFormError("Please enter your name (minimum 2 characters).");
      return;
    }
    if (trimmedName.length > 100) {
      setFormError("Name must be 100 characters or fewer.");
      return;
    }
    if (trimmedReview.length < 10) {
      setFormError("Please share at least 10 characters describing your experience.");
      return;
    }
    if (trimmedReview.length > 1000) {
      setFormError("Review text must be 1000 characters or fewer.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitCustomerReview({
        customerName: trimmedName,
        rating: formRating,
        review: trimmedReview,
        image: formImage,
      });

      if (res.success) {

        setFormSuccess(true);
        setFormName("");
        setFormReview("");
        setFormRating(5);
        setFormImage(null);
        // Refresh reviews in background
        loadApprovedReviews();
      } else {
        setFormError(res.error || "Unable to submit your review. Please try again.");
      }
    } catch (err: any) {
      setFormError(err?.message || "An unexpected error occurred while submitting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentReview = allReviews[currentIndex] || allReviews[0];

  // No rating is displayed until approved reviews exist.
  const displayedAverage = totalApproved > 0 ? averageRating.toFixed(1) : "—";

  return (
    <section onFocusCapture={() => setIsPaused(true)} onBlurCapture={() => setIsPaused(false)} className="container-custom transition-colors duration-300 relative">
      {totalApproved > 12 && <div className="flex justify-center gap-4 py-3"><button disabled={page === 0 || isLoading} onClick={() => setPage(p => p - 1)}>Previous reviews</button><span>Page {page + 1}</span><button disabled={(page + 1) * 12 >= totalApproved || isLoading} onClick={() => setPage(p => p + 1)}>More reviews</button></div>}
      <ScrollReveal direction="up">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/30 text-xs font-bold tracking-widest text-blue-700 dark:text-cyan-400 uppercase shadow-xs">
              <Sparkles className="w-3 h-3" /> Real Client Feedback
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-1">
            What Our Customers Say
          </h2>

          <p className="text-slate-600 dark:text-zinc-400 text-xs sm:text-sm mt-2 max-w-lg mx-auto leading-relaxed">
            Read experiences shared by our customers. Submissions are reviewed before publication.
          </p>

          {/* Rating Summary & Write a Review Action */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/25 shadow-xs">
              <div className="flex text-amber-400 gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(Number(displayedAverage))
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300 dark:text-slate-700"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-black text-slate-900 dark:text-white">
                {displayedAverage}
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400">
                ({totalApproved} {totalApproved === 1 ? "review" : "reviews"}
                {totalApproved > 0 ? ` • ${totalApproved} approved` : ""})
              </span>
            </div>

            <button
              onClick={() => {
                setShowForm(!showForm);
                setFormSuccess(false);
                setFormError(null);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all btn-press"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>{showForm ? "Close Review Form" : "Write a Review"}</span>
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* FEEDBACK SUBMISSION FORM DRAWER */}
      {showForm && (
        <div className="max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-blue-500/30 dark:border-cyan-500/30 shadow-xl bg-white/95 dark:bg-slate-900/95 relative">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 dark:bg-cyan-500/15 border border-blue-500/20 dark:border-cyan-500/30 flex items-center justify-center text-blue-600 dark:text-cyan-400">
                  <MessageSquarePlus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Share Your Experience with Theekzu Mobile
                </h3>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-emerald-700 dark:text-emerald-300">
                  Thank You for Your Feedback!
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 max-w-md mx-auto leading-relaxed">
                  Your review has been submitted successfully. To maintain genuine feedback standards, our team verifies all submissions before they appear live on the storefront.
                </p>
                <button
                  onClick={() => {
                    setFormSuccess(false);
                    setShowForm(false);
                  }}
                  className="mt-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {formError && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="rounded-xl border border-slate-200 dark:border-cyan-500/20 p-4 space-y-3">
                  <label htmlFor="review-photo" className="block text-sm font-bold text-slate-700 dark:text-zinc-300">Add a photo <span className="font-normal">(optional)</span></label>
                  <p id="review-photo-help" className="text-xs text-slate-500 dark:text-zinc-400">JPG, PNG or WebP, up to 3 MB. Your photo is published only after approval.</p>
                  <input ref={imageInput} id="review-photo" type="file" accept="image/jpeg,image/png,image/webp" disabled={isSubmitting} aria-describedby="review-photo-help" className="block w-full text-xs text-slate-600 dark:text-zinc-300 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-white" onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 3 * 1024 * 1024) {
                      setFormError("Choose a JPG, PNG or WebP image up to 3 MB."); e.target.value = ""; return;
                    }
                    setFormError(null); setFormImage(file);
                  }} />
                  {imagePreview && <div className="space-y-2"><img src={imagePreview} alt="Selected review photo preview" className="max-h-48 max-w-full rounded-xl object-contain" /><button type="button" disabled={isSubmitting} className="text-xs font-semibold text-rose-600" onClick={() => { setFormImage(null); if (imageInput.current) imageInput.current.value = ""; }}>Remove photo</button></div>}
                </div>

                {/* Customer Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Kasun Perera"
                    maxLength={100}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 text-xs sm:text-sm focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400 transition-colors"
                  />
                </div>

                {/* Star Rating Picker */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                    Your Rating <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = (hoverRating !== null ? hoverRating : formRating) >= star;
                        return (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFormRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(null)}
                            className="p-1 rounded-lg hover:scale-110 active:scale-95 transition-transform"
                            aria-label={`${star} star`}
                          >
                            <Star
                              className={`w-6 h-6 transition-colors ${
                                isFilled
                                  ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                                  : "text-slate-300 dark:text-slate-700"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-xs font-bold text-slate-600 dark:text-zinc-400 ml-2">
                      {formRating === 5
                        ? "5 Stars - Excellent!"
                        : formRating === 4
                        ? "4 Stars - Very Good"
                        : formRating === 3
                        ? "3 Stars - Good"
                        : formRating === 2
                        ? "2 Stars - Fair"
                        : "1 Star - Poor"}
                    </span>
                  </div>
                </div>

                {/* Feedback Textarea */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                      Your Review <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                      {formReview.length}/1000 chars
                    </span>
                  </div>
                  <textarea
                    required
                    value={formReview}
                    onChange={(e) => setFormReview(e.target.value)}
                    placeholder="Tell us about the device condition, delivery speed, customer service, or your overall shopping experience..."
                    rows={4}
                    maxLength={1000}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 text-xs sm:text-sm focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400 transition-colors resize-none"
                  />
                </div>

                {/* Moderation Notice & Submit */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400 shrink-0" />
                    <span>All reviews undergo verification before public publishing.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Review</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* CAROUSEL CONTAINER (Preserves exact design & styling) */}
      <div
        className="relative max-w-4xl mx-auto"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Main Review Card */}
        <div className="glass-card-glow rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-12 border border-slate-200 dark:border-cyan-500/25 shadow-xl relative overflow-hidden transition-all duration-500">
          
          {/* Ambient Lighting */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-[90px] pointer-events-none" />

          <div className="relative z-10 flex flex-col justify-between min-h-[180px] sm:min-h-[200px]">
            <div>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div className="flex text-amber-500 dark:text-amber-400 gap-1">
                  {Array.from({ length: currentReview?.rating || 0 }).map((_, i) => (
                    <Star key={i} className="w-4 sm:w-5 h-4 sm:h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {currentReview?.verified && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Purchase
                  </span>
                )}
              </div>

              {currentReview?.imageUrl && <img src={currentReview.imageUrl} alt={"Photo shared by " + currentReview.name} loading="lazy" className="mb-5 w-full max-h-80 rounded-2xl object-contain bg-slate-100 dark:bg-slate-900" />}
              <Quote className="w-7 h-7 sm:w-8 sm:h-8 text-blue-500/30 dark:text-cyan-500/30 mb-2 sm:mb-3" />

              <p className="text-sm sm:text-lg md:text-xl text-slate-800 dark:text-zinc-200 italic leading-relaxed font-normal">
                {currentReview?.reviewText || (isLoading ? "Loading reviews…" : loadError ? "Reviews are temporarily unavailable." : "No published reviews yet. Share your experience below.")}
              </p>
            </div>

            <div className="pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-slate-200 dark:border-cyan-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {currentReview?.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  {currentReview?.location ? `${currentReview.location} • ` : ""}
                  {currentReview?.productBought ? (
                    <>
                      Purchased{" "}
                      <span className="text-blue-600 dark:text-cyan-400 font-semibold">
                        {currentReview.productBought}
                      </span>
                    </>
                  ) : null}
                  {currentReview?.date ? (
                    <span className="text-slate-400 dark:text-zinc-500">
                      {currentReview?.productBought ? " • " : ""}
                      {currentReview.date}
                    </span>
                  ) : null}
                </p>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  disabled={allReviews.length < 2}
                  onClick={prevSlide}
                  className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/20 flex items-center justify-center text-slate-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:border-blue-400 transition-colors active:scale-95 shadow-xs"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  disabled={allReviews.length < 2}
                  onClick={nextSlide}
                  className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/20 flex items-center justify-center text-slate-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:border-blue-400 transition-colors active:scale-95 shadow-xs"
                  aria-label="Next review"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Carousel Indicators Dots */}
        {allReviews.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {allReviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? "w-8 bg-gradient-to-r from-blue-600 to-cyan-400 dark:from-cyan-400 dark:to-blue-600"
                    : "w-2 bg-slate-300 dark:bg-slate-800 hover:bg-slate-400"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default CustomerReviews;
