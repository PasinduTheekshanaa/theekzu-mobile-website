"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle, CheckCircle2, LogIn, Database, KeyRound } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "forgot">("login");
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    setConfigured(isSupabaseConfigured());

    // Check if already authenticated and an admin
    async function checkExisting() {
      if (!isSupabaseConfigured()) return;
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: admin, error } = await supabase
            .from("admin_users")
            .select("user_id,email")
            .eq("user_id", user.id)
            .maybeSingle();

          if (error) {
            console.error("Supabase admin_users query error:", error);
          } else if (admin) {
            router.replace("/admin/products");
          } else {
            await supabase.auth.signOut();
          }
        }
      } catch (err) {
        console.error("Session check error:", err);
      }
    }
    checkExisting();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    if (!isSupabaseConfigured()) {
      setErrorMsg("Supabase is not configured yet. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local.");
      setLoading(false);
      return;
    }

    try {
      if (authMode === "forgot") {
        const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: origin + "/admin/reset-password",
        });

        if (error) {
          console.error("Supabase resetPasswordForEmail error:", error);
          setErrorMsg(error.message || "Failed to send password reset email.");
          setLoading(false);
          return;
        }

        setSuccessMsg(
          "Password reset link sent to " + email.trim() + "! Please check your email inbox (and spam folder) and click the link to set your new password."
        );
      } else {
        // Sign in flow
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (signInError) {
          console.error("Supabase signInWithPassword error:", signInError);
          setErrorMsg(signInError.message || "Invalid login credentials.");
          setLoading(false);
          return;
        }

        // After signInWithPassword succeeds, get the authenticated user with supabase.auth.getUser()
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          if (userError) {
            console.error("Supabase getUser error:", userError);
          }
          await supabase.auth.signOut();
          setErrorMsg("Access denied.");
          setLoading(false);
          return;
        }

        // Verify admin access by querying public.admin_users where user_id = authenticated user.id
        const { data: admin, error: adminError } = await supabase
          .from("admin_users")
          .select("user_id,email")
          .eq("user_id", user.id)
          .maybeSingle();

        if (adminError) {
          console.error("Supabase admin_users query error:", adminError);
          setErrorMsg("Database error checking admin authorization: " + (adminError.message || "Query failed"));
          setLoading(false);
          return;
        }

        if (!admin) {
          await supabase.auth.signOut();
          setErrorMsg("Access denied.");
          setLoading(false);
          return;
        }

        // If admin exists: allow access and redirect to /admin or /admin/products
        setSuccessMsg("Authenticated successfully! Loading admin portal...");
        setTimeout(() => router.replace("/admin/products"), 800);
      }
    } catch (err: any) {
      console.error("Admin login error:", err);
      setErrorMsg(err.message || "An unexpected error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md glass-panel rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-10 border border-neutral-200 dark:border-neutral-500/30 text-center relative overflow-hidden shadow-2xl">
        
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-canvas dark:bg-canvas rounded-full blur-3xl pointer-events-none" />

        {/* Brand Logo */}
        <div className="relative w-16 h-16 mx-auto rounded-2xl p-[1.5px] bg-canvas    shadow-md dark:shadow-[0_0_20px_rgba(147,147,147,0.4)] mb-4">
          <div className="w-full h-full bg-canvas rounded-[14px] p-1 flex items-center justify-center overflow-hidden">
            <Image
              src="/logo.png"
              alt="Theekzu Mobile"
              width={56}
              height={56}
              className="w-full h-full object-cover rounded-lg"
              priority
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 mb-1">
          <span className="text-base font-black tracking-wider text-ink dark:text-ink">THEEKZU</span>
          <span className="text-base font-black tracking-wider text-brand">ADMIN</span>
        </div>
        
        <p className="text-xs text-ink dark:text-ink mb-6">
          {authMode === "forgot"
            ? "Enter your registered admin email to receive a secure password recovery link."
            : "Sign in with your verified Supabase Admin credentials to manage catalog and inventory."}
        </p>

        {/* Supabase Status Alert */}
        {!configured && (
          <div className="mb-6 p-3.5 rounded-2xl bg-canvas border border-neutral-500/20 text-ink dark:text-ink text-xs text-left space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <Database className="w-3.5 h-3.5" />
              <span>Supabase Not Configured</span>
            </div>
            <p className="text-[11px] text-ink dark:text-ink">
              Provide <code className="bg-canvas dark:bg-canvas px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="bg-canvas dark:bg-canvas px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> in your <code className="bg-canvas dark:bg-canvas px-1 py-0.5 rounded">.env.local</code> file.
            </p>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-canvas border border-neutral-500/30 text-ink dark:text-ink text-xs flex items-center gap-2 text-left">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-canvas border border-neutral-500/30 text-ink dark:text-ink text-xs flex items-start gap-2 text-left">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-ink dark:text-ink mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink">
                <Mail data-brand-color="#2563eb" className="w-4 h-4 text-ink dark:text-ink" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@theekzumobile.com"
                className="w-full bg-canvas dark:bg-canvas border border-neutral-300 dark:border-neutral-500/20 text-ink dark:text-ink rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-neutral-600 dark:focus:border-neutral-400 transition-colors"
              />
            </div>
          </div>

          {authMode !== "forgot" && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-ink dark:text-ink">
                  Password
                </label>
                {authMode === "login" && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("forgot");
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                    className="text-[11px] text-ink dark:text-ink hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink">
                  <Lock className="w-4 h-4 text-ink dark:text-ink" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-canvas dark:bg-canvas border border-neutral-300 dark:border-neutral-500/20 text-ink dark:text-ink rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-neutral-600 dark:focus:border-neutral-400 transition-colors"
                />
              </div>
            </div>
          )}

          <button data-ui="primary"
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-canvas       text-ink text-xs font-bold shadow-md shadow-neutral-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>Processing Request...</span>
            ) : authMode === "forgot" ? (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Send Password Reset Link</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In to Admin Portal</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-white/5 flex items-center justify-between text-xs text-ink">
          {authMode === "forgot" ? (
            <button
              onClick={() => {
                setAuthMode("login");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className="text-ink dark:text-ink font-semibold hover:underline"
            >
              ← Back to Sign In
            </button>
          ) : (
            <span className="text-[11px] text-ink dark:text-ink">
              Authorized Personnel Only
            </span>
          )}

          <Link href="/" className="hover:text-ink dark:hover:text-ink transition-colors">
            Return to Store
          </Link>
        </div>

      </div>
    </div>
  );
}
