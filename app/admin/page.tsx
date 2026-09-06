"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      if (!isSupabaseConfigured()) {
        router.replace("/admin/login");
        return;
      }

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          if (userError) console.error("Supabase getUser error:", userError);
          router.replace("/admin/login");
          return;
        }

        const { data: admin, error: adminError } = await supabase
          .from("admin_users")
          .select("user_id,email")
          .eq("user_id", user.id)
          .maybeSingle();

        if (adminError) {
          console.error("Supabase admin_users query error:", adminError);
          router.replace("/admin/login");
          return;
        }

        if (admin) {
          router.replace("/admin/products");
        } else {
          router.replace("/admin/login");
        }
      } catch (err) {
        console.error("Auth check exception:", err);
        router.replace("/admin/login");
      }
    }

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-4 border-blue-600 dark:border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
          Verifying Admin Access with Supabase...
        </p>
      </div>
    </div>
  );
}
