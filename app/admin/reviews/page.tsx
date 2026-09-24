"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  CheckCircle2,
  XCircle,
  Trash2,
  RefreshCw,
  ArrowLeft,
  LogOut,
  Database,
  UserCheck,
  AlertCircle,
  MessageSquare,
  Clock,
  Filter,
  Check,
  X,
  ExternalLink,
  ShoppingBag,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import {
  checkIsAdminUser,
  fetchAdminCustomerReviews,
  updateCustomerReviewStatus,
  deleteCustomerReviewFromSupabase,
  CustomerReview,
} from "@/lib/supabaseService";

export default function AdminReviewsPage() {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(true);

  // Reviews Data
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [tableNotCreated, setTableNotCreated] = useState(false);

  // Action states
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Auth gate check
  useEffect(() => {
    async function checkAuth() {
      if (!isSupabaseConfigured()) {
        router.replace("/admin/login");
        return;
      }

      try {
        const isAdmin = await checkIsAdminUser();
        if (!isAdmin) {
          router.replace("/admin/login");
          return;
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user?.email) {
          setAdminEmail(user.email);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        router.replace("/admin/login");
        return;
      } finally {
        setIsVerifyingAuth(false);
      }
    }

    checkAuth();
  }, [router]);

  // Load reviews from Supabase
  const loadReviews = async () => {
    setIsLoading(true);
    setTableNotCreated(false);
    try {
      const res = await fetchAdminCustomerReviews();
      if (res.tableNotCreated) {
        setTableNotCreated(true);
      } else if (res.error) {
        showToast(res.error, "error");
      } else {
        setReviews(res.reviews);
      }
    } catch (err: any) {
      showToast(err?.message || "Failed to load reviews", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isVerifyingAuth) {
      loadReviews();

      // Supabase Realtime channel: updates instantly when reviews are submitted or modified
      if (isSupabaseConfigured()) {
        const channel = supabase
          .channel("admin-customer-reviews-channel")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "customer_reviews" },
            () => {
              loadReviews();
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }
    }
  }, [isVerifyingAuth]);

  // Action: Approve review
  const handleApprove = async (id: string) => {
    setActionLoadingId(id);
    try {
      // Optimistic update
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "approved" as const } : r))
      );
      const res = await updateCustomerReviewStatus(id, "approved");
      if (res.success) {
        showToast("Review approved! It is now live on the public website.", "success");
      } else {
        showToast(res.error || "Failed to approve review", "error");
        loadReviews();
      }
    } catch (err: any) {
      showToast(err?.message || "Action failed", "error");
      loadReviews();
    } finally {
      setActionLoadingId(null);
    }
  };

  // Action: Reject review
  const handleReject = async (id: string) => {
    setActionLoadingId(id);
    try {
      // Optimistic update
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "rejected" as const } : r))
      );
      const res = await updateCustomerReviewStatus(id, "rejected");
      if (res.success) {
        showToast("Review rejected and hidden from storefront.", "info");
      } else {
        showToast(res.error || "Failed to reject review", "error");
        loadReviews();
      }
    } catch (err: any) {
      showToast(err?.message || "Action failed", "error");
      loadReviews();
    } finally {
      setActionLoadingId(null);
    }
  };

  // Action: Delete review
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this customer review?")) {
      return;
    }

    setActionLoadingId(id);
    try {
      setReviews((prev) => prev.filter((r) => r.id !== id));
      const res = await deleteCustomerReviewFromSupabase(id);
      if (res.success) {
        showToast("Review deleted permanently.", "success");
      } else {
        showToast(res.error || "Failed to delete review", "error");
        loadReviews();
      }
    } catch (err: any) {
      showToast(err?.message || "Delete failed", "error");
      loadReviews();
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    router.replace("/admin/login");
  };

  // Counts
  const counts = useMemo(() => {
    return {
      all: reviews.length,
      pending: reviews.filter((r) => r.status === "pending").length,
      approved: reviews.filter((r) => r.status === "approved").length,
      rejected: reviews.filter((r) => r.status === "rejected").length,
    };
  }, [reviews]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    if (selectedStatus === "all") return reviews;
    return reviews.filter((r) => r.status === selectedStatus);
  }, [reviews, selectedStatus]);

  if (isVerifyingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 dark:border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
            Verifying Admin Authorization with Supabase...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border backdrop-blur-xl animate-in slide-in-from-top-4 duration-300 ${
            toast.type === "success"
              ? "bg-emerald-500/95 text-white border-emerald-400"
              : toast.type === "error"
              ? "bg-rose-600/95 text-white border-rose-500"
              : "bg-blue-600/95 text-white border-blue-400"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/products"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
              title="Return to Product Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-black tracking-tight">
                  Customer Reviews & Feedback Moderation
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  <span>Supabase Live</span>
                </span>
                {adminEmail && (
                  <span className="text-xs text-slate-500 dark:text-zinc-400 hidden sm:inline flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-blue-500" />
                    <span>{adminEmail}</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Review submitted feedback from customers. Approved reviews instantly appear on the public storefront.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Link to Products Admin */}
            <Link
              href="/admin/products"
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-zinc-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-white/10"
            >
              <ShoppingBag className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span>Products Dashboard</span>
            </Link>

            {/* Refresh Button */}
            <button
              onClick={loadReviews}
              disabled={isLoading}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-white/10 transition-colors disabled:opacity-50"
              title="Refresh Reviews"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>

            {/* Public Storefront Link */}
            <Link
              href="/"
              target="_blank"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-white/10 transition-colors"
              title="Open Public Website"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-white/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        
        {/* SQL Migration Notice if table is not created yet */}
        {tableNotCreated && (
          <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              <span>Database Table 'customer_reviews' Setup Needed</span>
            </div>
            <p className="text-xs leading-relaxed max-w-3xl">
              The <code>customer_reviews</code> table has not been created in your Supabase project yet. We have generated the complete unified SQL migration script for you at <code className="px-1.5 py-0.5 rounded bg-amber-500/20 font-mono font-bold">supabase_theekzu_schema.sql</code>.
            </p>
            <div className="pt-1">
              <p className="text-xs font-semibold">To activate live review storage &amp; real-time sync in Supabase:</p>
              <ol className="list-decimal list-inside text-xs space-y-1 mt-1 text-slate-600 dark:text-zinc-300">
                <li>Open your Supabase dashboard at <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-cyan-400 underline font-semibold">supabase.com/dashboard</a>.</li>
                <li>Go to the <strong>SQL Editor</strong> tab on the left navigation (or <a href="https://supabase.com/dashboard/project/_/sql/new" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-cyan-400 underline font-semibold">New query</a>).</li>
                <li>Open the file <strong>supabase_theekzu_schema.sql</strong> (or <strong>supabase_customer_reviews.sql</strong>) in this project, copy all its SQL contents, paste it into the editor, and click <strong>Run</strong>.</li>
                <li>Click the "Refresh Reviews" button above or reload once executed. The warning will disappear immediately!</li>
              </ol>
            </div>
          </div>
        )}

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/20 shadow-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setSelectedStatus("pending")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                selectedStatus === "pending"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pending Moderation</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                selectedStatus === "pending" ? "bg-white/30 text-white" : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
              }`}>
                {counts.pending}
              </span>
            </button>

            <button
              onClick={() => setSelectedStatus("approved")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                selectedStatus === "approved"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approved Live</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                selectedStatus === "approved" ? "bg-white/30 text-white" : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              }`}>
                {counts.approved}
              </span>
            </button>

            <button
              onClick={() => setSelectedStatus("rejected")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                selectedStatus === "rejected"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Rejected</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                selectedStatus === "rejected" ? "bg-white/30 text-white" : "bg-rose-500/20 text-rose-600 dark:text-rose-400"
              }`}>
                {counts.rejected}
              </span>
            </button>

            <button
              onClick={() => setSelectedStatus("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                selectedStatus === "all"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>All Submissions</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                selectedStatus === "all" ? "bg-white/30 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-zinc-300"
              }`}>
                {counts.all}
              </span>
            </button>
          </div>

          <div className="text-xs text-slate-500 dark:text-zinc-400 pr-2">
            Showing {filteredReviews.length} {filteredReviews.length === 1 ? "review" : "reviews"}
          </div>
        </div>

        {/* Reviews List */}
        {isLoading ? (
          <div className="p-16 text-center">
            <div className="w-8 h-8 border-3 border-blue-600 dark:border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">
              Loading reviews from Supabase...
            </p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-12 text-center rounded-3xl glass-card border border-slate-200 dark:border-cyan-500/20 space-y-3">
            <MessageSquare className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              No {selectedStatus !== "all" ? selectedStatus : ""} reviews found
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md mx-auto">
              {selectedStatus === "pending"
                ? "No pending submissions currently need moderation. Newly submitted reviews will appear here."
                : "No customer reviews match the selected filter."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReviews.map((rev) => {
              const isActionRunning = actionLoadingId === rev.id;

              return (
                <div
                  key={rev.id}
                  className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-cyan-500/20 flex flex-col justify-between space-y-4 hover:border-blue-400/40 dark:hover:border-cyan-400/40 transition-all shadow-sm"
                >
                  <div className="space-y-3">
                    {/* Header: Customer Name & Status Badge */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {rev.customer_name}
                        </h4>
                        <p className="text-[11px] text-slate-400 dark:text-zinc-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(rev.created_at).toLocaleString()}</span>
                        </p>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                          rev.status === "approved"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                            : rev.status === "rejected"
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {rev.status === "approved" ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approved Live</span>
                          </>
                        ) : rev.status === "rejected" ? (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>Rejected</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            <span>Pending</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Star Rating */}
                    <div className="flex text-amber-400 gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < rev.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300 dark:text-slate-700"
                          }`}
                        />
                      ))}
                      <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 ml-1.5">
                        {rev.rating} / 5
                      </span>
                    </div>

                    {/* Review Text */}
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200/70 dark:border-white/5">
                      "{rev.review_text || rev.review}"
                    </p>
                  </div>

                  {/* Moderation Action Buttons */}
                  <div className="pt-3 border-t border-slate-200 dark:border-cyan-500/15 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      {rev.status !== "approved" && (
                        <button
                          onClick={() => handleApprove(rev.id)}
                          disabled={isActionRunning}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 disabled:opacity-50"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve &amp; Publish</span>
                        </button>
                      )}

                      {rev.status !== "rejected" && (
                        <button
                          onClick={() => handleReject(rev.id)}
                          disabled={isActionRunning}
                          className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => handleDelete(rev.id)}
                      disabled={isActionRunning}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors active:scale-95 disabled:opacity-50"
                      title="Permanently Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
