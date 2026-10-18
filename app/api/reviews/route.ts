import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import { prepareReviewImage, MAX_REVIEW_IMAGE_BYTES } from "@/lib/reviewImage";
export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!key || !url) return NextResponse.json({ error: "Reviews are temporarily unavailable. Please try again later." }, { status: 503 });
  try {
    const multipart = request.headers.get("content-type")?.startsWith("multipart/form-data");
    const maxBytes = multipart ? MAX_REVIEW_IMAGE_BYTES + 16384 : 8192;
    const reader = request.body?.getReader();
    const chunks: Uint8Array[] = []; let size = 0;
    if (reader) {
      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        size += value.byteLength;
        if (size > maxBytes) { await reader.cancel(); return NextResponse.json({ error: "Choose an image up to 3 MB." }, { status: 413 }); }
        chunks.push(value);
      }
    }
    const bytes = Buffer.concat(chunks);
    let file: File | null = null;
    let body;
    if (multipart) {
      const form = await new Response(bytes, { headers: { "content-type": request.headers.get("content-type")! } }).formData();
      const image = form.get("image");
      if (image !== null && typeof image === "string") return NextResponse.json({ error: "Invalid image upload." }, { status: 400 });
      file = image as File | null;
      body = { customerName: form.get("customerName"), review: form.get("review"), rating: Number(form.get("rating")) };
    } else body = JSON.parse(bytes.toString("utf8"));
    const name = typeof body.customerName === "string" ? body.customerName.trim() : "";
    const review = typeof body.review === "string" ? body.review.trim() : "";
    if (name.length < 2 || name.length > 100 || review.length < 10 || review.length > 1000 || !Number.isInteger(body.rating) || body.rating < 1 || body.rating > 5) return NextResponse.json({ error: "Enter a name, a rating from 1 to 5, and a review of 10–1000 characters." }, { status: 400 });
    const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    let imagePath: string | null = null;
    if (file) {
      let image: Buffer;
      try { image = await prepareReviewImage(file); }
      catch (error) { return NextResponse.json({ error: (error as Error).message }, { status: 400 }); }
      imagePath = randomUUID() + ".webp";
      const upload = await db.storage.from("review-images").upload(imagePath, image, { contentType: "image/webp", upsert: false });
      if (upload.error) return NextResponse.json({ error: "Photo upload failed. Please try again." }, { status: 503 });
    }
    // Multiple submissions are allowed, including from a shared mobile network.
    // The client cannot choose status: every review awaits admin approval.
    // Use the server-only role so the public table/storage policies stay intact.
    const { error } = await db.from("customer_reviews").insert({ customer_name: name, rating: body.rating, review_text: review, image_path: imagePath, status: "pending" });
    if (error) {
      if (imagePath) await db.storage.from("review-images").remove([imagePath]);
      console.error("[Reviews] Could not save pending review", { code: error.code });
      return NextResponse.json({ error: "We could not save your review. Please try again later." }, { status: 503 });
    }
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Invalid review request." }, { status: 400 }); }
}
