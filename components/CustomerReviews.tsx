"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Star,
  CheckCircle2,
  Quote,
  MessageSquarePlus,
  Send,
  AlertCircle,
  X,
  ShieldCheck,
} from "lucide-react";
import { MAX_REVIEW_PHOTOS, MAX_REVIEW_PHOTO_BYTES } from "@/lib/reviewPhotos";
import { ReviewPhotoGallery } from "@/components/ReviewPhotoGallery";
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
  imageUrls?: string[];
  verified: boolean;
  date?: string;
  isRealReview?: boolean;
}

export const CustomerReviews: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      setNearViewport(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setNearViewport(true);
        observer.disconnect();
      }
    }, { rootMargin: "400px" });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);
  const [supabaseApprovedReviews, setSupabaseApprovedReviews] = useState<SupabaseReview[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalApproved, setTotalApproved] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [page, setPage] = useState(0);
  const reviewRequest = useRef(0);

  // Feedback Form State
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [formReview, setFormReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  const [formImages, setFormImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const imageInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const urls = formImages.map(file => URL.createObjectURL(file));
    setImagePreviews(urls);
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [formImages]);

  // Load approved reviews from Supabase
  const loadApprovedReviews = async () => {
    const request = ++reviewRequest.current;
    try {
      setIsLoading(true);
      const res = await fetchApprovedCustomerReviews(0, (page + 1) * 12);
      if (request !== reviewRequest.current) return;
      setLoadError(!res.tableReady);
      if (!res.tableReady) return;
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
    if (!nearViewport) return;
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
  }, [page, nearViewport]);

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
    // Approved customer reviews, newest first.
    const liveItems: UnifiedReview[] = supabaseApprovedReviews
      .filter((r) => r.status === "approved")
      .map((r) => ({
        id: r.id,
        name: r.customer_name,
        location: undefined,
        rating: r.rating || 5,
        productBought: undefined,
        reviewText: r.review_text || r.review || "",
        imageUrls: r.image_urls || (r.image_url ? [r.image_url] : []),
        verified: false,
        date: formatDate(r.created_at),
        isRealReview: true,
      }));

    return liveItems;
  }, [supabaseApprovedReviews]);

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
        images: formImages,
      });

      if (res.success) {

        setFormSuccess(true);
        setFormName("");
        setFormReview("");
        setFormRating(5);
        setFormImages([]);
        if (imageInput.current) imageInput.current.value = "";
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

  // No rating is displayed until approved reviews exist.
  const displayedAverage = totalApproved > 0 ? averageRating.toFixed(1) : "—";

  return (
    <section ref={sectionRef} className="container-custom transition-colors duration-300 relative">
      <ScrollReveal direction="up">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-canvas dark:bg-canvas border border-neutral-500/20 dark:border-neutral-500/30 text-xs font-bold tracking-widest text-ink dark:text-ink uppercase shadow-xs">
              Real Client Feedback
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-ink dark:text-ink mt-1">
            What Our Customers Say
          </h2>

          <p className="text-ink dark:text-ink text-xs sm:text-sm mt-2 max-w-lg mx-auto leading-relaxed">
            Read experiences shared by our customers. Submissions are reviewed before publication.
          </p>

          {/* Rating Summary & Write a Review Action */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-canvas dark:bg-canvas border border-neutral-200 dark:border-neutral-500/25 shadow-xs">
              <div className="flex text-ink gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(Number(displayedAverage))
                        ? "fill-[#FFC107] text-[#FFC107]"
                        : "text-neutral-300 dark:text-neutral-700"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-black text-ink dark:text-ink">
                {displayedAverage}
              </span>
              <span className="text-xs text-ink dark:text-ink">
                ({totalApproved} {totalApproved === 1 ? "review" : "reviews"}
                {totalApproved > 0 ? ` • ${totalApproved} approved` : ""})
              </span>
            </div>

            <button data-ui="primary"
              onClick={() => {
                setShowForm(!showForm);
                setFormSuccess(false);
                setFormError(null);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-canvas     text-ink text-xs font-bold shadow-md shadow-neutral-500/20 active:scale-95 transition-all btn-press"
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
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-neutral-500/30 dark:border-neutral-500/30 shadow-xl bg-canvas dark:bg-canvas relative">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-canvas dark:bg-canvas border border-neutral-500/20 dark:border-neutral-500/30 flex items-center justify-center text-ink dark:text-ink">
                  <MessageSquarePlus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-ink dark:text-ink">
                  Share Your Experience with Theekzu Mobile
                </h3>
              </div>
              <button data-ui="primary"
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded-xl text-ink hover:text-ink dark:hover:text-ink hover:bg-canvas dark:hover:bg-canvas transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formSuccess ? (
              <div className="p-6 rounded-2xl bg-canvas border border-neutral-500/30 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-canvas text-ink dark:text-ink flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-ink dark:text-ink">
                  Thank You for Your Feedback!
                </h4>
                <p className="text-xs sm:text-sm text-ink dark:text-ink max-w-md mx-auto leading-relaxed">
                  Your review has been submitted successfully. To maintain genuine feedback standards, our team verifies all submissions before they appear live on the storefront.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                <button data-ui="primary"
                  onClick={() => {
                    setFormSuccess(false);
                    setFormError(null);
                  }}
                  className="mt-2 px-5 py-2 rounded-xl text-xs font-bold"
                >
                  Submit another review
                </button>
                <button data-ui="primary"
                  onClick={() => {
                    setFormSuccess(false);
                    setShowForm(false);
                  }}
                  className="mt-2 px-5 py-2 rounded-xl bg-canvas hover:bg-canvas text-ink text-xs font-bold transition-all shadow-xs"
                >
                  Done
                </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {formError && (
                  <div className="p-3.5 rounded-xl bg-canvas border border-neutral-500/30 text-ink dark:text-ink text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="rounded-xl border border-neutral-200 p-4 space-y-3">
                  <label htmlFor="review-photo" className="block text-sm font-bold">Add photos <span className="font-normal">(optional, up to 5)</span></label>
                  <p id="review-photo-help" className="text-xs text-neutral-600">No photos required. JPG, PNG or WebP, up to 3 MB each. Photos appear only after approval.</p>
                  <input ref={imageInput} id="review-photo" type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={isSubmitting || formImages.length >= MAX_REVIEW_PHOTOS} aria-describedby="review-photo-help" className="block w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-100 file:px-3 file:py-2" onChange={e => {
                    const files = Array.from(e.target.files || []);
                    e.target.value = "";
                    if (!files.length) return;
                    if (files.length + formImages.length > MAX_REVIEW_PHOTOS) {
                      setFormError("You can add up to 5 photos. Remove a photo to choose another."); return;
                    }
                    if (files.some(file => !["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size === 0 || file.size > MAX_REVIEW_PHOTO_BYTES)) {
                      setFormError("Choose JPG, PNG or WebP photos up to 3 MB each."); return;
                    }
                    setFormError(null);
                    setFormImages(current => [...current, ...files]);
                  }} />
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-neutral-500" aria-live="polite">{formImages.length} / 5 photos selected</p>
                    {formImages.length > 0 && <button type="button" disabled={isSubmitting} className="min-h-11 rounded-lg px-2 text-xs font-semibold underline underline-offset-4 hover:bg-neutral-100 disabled:opacity-50" onClick={() => { setFormImages([]); setFormError(null); }}>Remove all photos</button>}
                  </div>
                  {imagePreviews.length > 0 && <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {imagePreviews.map((url, index) => <div key={url} className="relative rounded-xl border border-neutral-200 bg-neutral-100 p-1">
                      <img src={url} alt={"Selected review photo " + (index + 1)} className="h-28 w-full rounded-xl object-contain bg-neutral-100" />
                      <button type="button" disabled={isSubmitting} aria-label={"Remove photo " + (index + 1)} title={"Remove photo " + (index + 1)} className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-black shadow-md transition-colors hover:bg-neutral-200 focus-visible:outline-offset-2 disabled:opacity-50" onClick={() => { setFormImages(current => current.filter((_, position) => position !== index)); setFormError(null); }}><X className="h-5 w-5" aria-hidden="true" /></button>
                      <p className="truncate px-2 py-1 text-xs text-neutral-600">{formImages[index]?.name}</p>
                    </div>)}
                  </div>}
                </div>

                {/* Customer Name */}
                <div>
                  <label className="block text-xs font-bold text-ink dark:text-ink mb-1">
                    Your Name <span className="text-ink">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Kasun Perera"
                    maxLength={100}
                    className="w-full px-4 py-2.5 rounded-xl bg-canvas dark:bg-canvas border border-neutral-200 dark:border-neutral-500/20 text-ink dark:text-ink placeholder:text-ink dark:placeholder:text-ink text-xs sm:text-sm focus:outline-none focus:border-neutral-500 dark:focus:border-neutral-400 transition-colors"
                  />
                </div>

                {/* Star Rating Picker */}
                <div>
                  <label className="block text-xs font-bold text-ink dark:text-ink mb-1.5">
                    Your Rating <span className="text-ink">*</span>
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
                                  ? "fill-[#FFC107] text-[#FFC107] "
                                  : "text-neutral-300 dark:text-neutral-700"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-xs font-bold text-ink dark:text-ink ml-2">
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
                    <label className="text-xs font-bold text-ink dark:text-ink">
                      Your Review <span className="text-ink">*</span>
                    </label>
                    <span className="text-[10px] text-ink dark:text-ink">
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
                    className="w-full px-4 py-2.5 rounded-xl bg-canvas dark:bg-canvas border border-neutral-200 dark:border-neutral-500/20 text-ink dark:text-ink placeholder:text-ink dark:placeholder:text-ink text-xs sm:text-sm focus:outline-none focus:border-neutral-500 dark:focus:border-neutral-400 transition-colors resize-none"
                  />
                </div>

                {/* Moderation Notice & Submit */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-ink dark:text-ink">
                    <ShieldCheck className="w-3.5 h-3.5 text-ink dark:text-ink shrink-0" />
                    <span>All reviews undergo verification before public publishing.</span>
                  </div>

                  <button data-ui="primary"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-canvas     text-ink font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-neutral-500/20 active:scale-95 transition-all disabled:opacity-60"
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

      <div className="max-w-5xl mx-auto space-y-5 sm:space-y-7" aria-busy={isLoading}>
        {allReviews.map((review) => (
          <ScrollReveal key={review.id} direction="up">
            <article className="review-feed-card overflow-hidden rounded-3xl border border-neutral-200 bg-canvas shadow-sm">
              <div className={review.imageUrls?.length ? "grid md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]" : ""}>
                {!!review.imageUrls?.length && <ReviewPhotoGallery photos={review.imageUrls} customerName={review.name} />}
                <div className="flex min-w-0 flex-col p-6 sm:p-8">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div className="flex gap-1" role="img" aria-label={review.rating + " out of 5 stars"}>
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star key={index} aria-hidden="true" className={"h-4 w-4 sm:h-5 sm:w-5 " + (index < review.rating ? "fill-[#FFC107] text-[#FFC107]" : "text-neutral-300")} />
                      ))}
                    </div>
                    <Quote aria-hidden="true" className="h-7 w-7 text-neutral-300" />
                  </div>
                  <blockquote className="flex-1 whitespace-pre-line break-words text-base leading-relaxed sm:text-lg">
                    {review.reviewText}
                  </blockquote>
                  <footer className="mt-6 flex items-center gap-3 border-t border-neutral-200 pt-5">
                    <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-bold">
                      {review.name.trim().charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <h3 className="break-words text-sm font-bold sm:text-base">{review.name}</h3>
                      {review.date && <p className="mt-1 text-xs text-neutral-500">{review.date}</p>}
                    </div>
                  </footer>
                </div>
              </div>
            </article>
          </ScrollReveal>
        ))}
        {allReviews.length === 0 && (
          <div role="status" className="rounded-3xl border border-neutral-200 p-8 text-center text-neutral-600">
            {isLoading ? "Loading reviews…" : loadError ? "Reviews are temporarily unavailable." : "No published reviews yet. Be the first to share your experience."}
          </div>
        )}
        <div className="review-pages flex flex-col items-center gap-3 py-4" aria-live="polite">
          {loadError && !isLoading && <><p className="text-sm text-neutral-600">Unable to load reviews. Please try again.</p><button type="button" onClick={loadApprovedReviews}>Try again</button></>}
          {allReviews.length > 0 && <p className="text-sm text-neutral-500">Showing {allReviews.length} of {totalApproved} reviews</p>}
          {allReviews.length < totalApproved && !loadError && <button type="button" disabled={isLoading} onClick={() => setPage(value => value + 1)}>{isLoading ? "Loading reviews…" : "Load more reviews"}</button>}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
