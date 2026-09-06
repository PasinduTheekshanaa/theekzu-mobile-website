"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, KeyRound, CheckCircle2, AlertCircle, ArrowLeft, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isValidLink, setIsValidLink] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Check for error in hash (e.g. #error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired)
    if (typeof window !== "undefined") {
      const hash = window.location.hash || "";
      const search = window.location.search || "";

      if (
        hash.includes("error=") ||
        hash.includes("otp_expired") ||
        search.includes("error=") ||
        search.includes("otp_expired")
      ) {
        setIsValidLink(false);
        setErrorMessage("This password recovery link is invalid or has expired. Please request a new password reset link.");
        setIsChecking(false);
        return;
      }
    }

    // Listen for auth state change
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setIsValidLink(true);
        setIsChecking(false);
      }
    });

    // Check existing session
    async function verifySession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (session) {
          setIsValidLink(true);
        } else {
          // If no session after short delay and no recovery token in URL
          setTimeout(() => {
            setIsValidLink((prev) => (prev === null ? false : prev));
            setIsChecking(false);
          }, 1500);
        }
      } catch (err) {
        setIsValidLink(false);
      } finally {
        setIsChecking(false);
      }
    }

    verifySession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!newPassword) {
      setErrorMessage("Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-check.");
      return;
    }

    setLoading(true);

    try {
      // User requirement: supabase.auth.updateUser({ password: newPassword })
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setErrorMessage(error.message || "Failed to update password.");
        setLoading(false);
        return;
      }

      // User requirement: On success show "Password updated successfully." Then redirect to /admin/login
      setSuccessMessage("Password updated successfully.");
      
      // Sign out recovery session to allow clean login with new credentials
      await supabase.auth.signOut();

      setTimeout(() => {
        router.replace("/admin/login");
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred while updating your password.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 transition-colors duration-300">
      <div className="w-full max-w-md glass-card-glow rounded-[2.5rem] p-8 sm:p-10 border border-slate-200 dark:border-cyan-500/30 text-center relative overflow-hidden shadow-2xl">
        
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Logo */}
        <div className="relative w-16 h-16 mx-auto rounded-2xl p-[1.5px] bg-gradient-to-tr from-cyan-400 via-blue-600 to-indigo-600 shadow-md dark:shadow-[0_0_20px_rgba(0,180,255,0.4)] mb-4">
          <div className="w-full h-full bg-[#040711] rounded-[14px] p-1 flex items-center justify-center overflow-hidden">
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
          <span className="text-base font-black tracking-wider text-slate-900 dark:text-white">THEEKZU</span>
          <span className="text-base font-black tracking-wider text-gradient-neon">ADMIN</span>
        </div>

        <h1 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          Reset Admin Password
        </h1>

        {isChecking ? (
          <div className="py-8 space-y-3">
            <div className="w-8 h-8 border-3 border-blue-600 dark:border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Validating recovery security link...
            </p>
          </div>
        ) : isValidLink === false ? (
          /* Invalid / Expired Link State */
          <div className="py-4 space-y-4 text-left">
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              <div className="space-y-1">
                <strong className="block font-bold">Invalid or Expired Link</strong>
                <span className="leading-relaxed">
                  {errorMessage || "This password recovery link is invalid or has expired. Please request a new password reset link."}
                </span>
              </div>
            </div>

            <Link
              href="/admin/login"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Request New Reset Link</span>
            </Link>
          </div>
        ) : (
          /* Valid Form State */
          <div className="space-y-4 text-left">
            <p className="text-xs text-slate-500 dark:text-zinc-400 text-center mb-4">
              Enter and confirm your new administrator password below.
            </p>

            {/* Success message */}
            {successMessage && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                <span className="font-semibold">{successMessage}</span>
              </div>
            )}

            {/* Error message */}
            {errorMessage && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-400 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-cyan-500/20 text-slate-900 dark:text-white rounded-2xl pl-10 pr-10 py-3 text-xs sm:text-sm focus:outline-none focus:border-blue-600 dark:focus:border-cyan-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-400 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-cyan-500/20 text-slate-900 dark:text-white rounded-2xl pl-10 pr-10 py-3 text-xs sm:text-sm focus:outline-none focus:border-blue-600 dark:focus:border-cyan-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Update Password button */}
              <button
                type="submit"
                disabled={loading || Boolean(successMessage)}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 dark:from-cyan-500 dark:to-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span>Updating Password...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-3 text-center">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-cyan-400 hover:underline font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Admin Login</span>
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
