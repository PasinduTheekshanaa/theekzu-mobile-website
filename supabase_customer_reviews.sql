-- ==============================================================================
-- THEEKZU MOBILE - SUPABASE COMPLETE DATABASE UPGRADE
-- Customer Reviews + Stock Management + RLS Policies + Realtime Configuration
-- ==============================================================================
-- Run this entire script in your Supabase Dashboard:
-- https://supabase.com/dashboard/project/_/sql/new
--
-- SAFE & IDEMPOTENT: Will NOT delete or recreate existing products, variants,
-- prices, images, colors, storage options, admin users, or customer data.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. CUSTOMER REVIEWS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customer_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(100) NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL CHECK (char_length(review_text) >= 10 AND char_length(review_text) <= 1000),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Backward compatibility: handle if review column already exists instead of review_text
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'customer_reviews' AND column_name = 'review'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'customer_reviews' AND column_name = 'review_text'
  ) THEN
    ALTER TABLE public.customer_reviews RENAME COLUMN review TO review_text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'customer_reviews' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.customer_reviews ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
  END IF;
END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_customer_reviews_status ON public.customer_reviews(status);
CREATE INDEX IF NOT EXISTS idx_customer_reviews_created_at ON public.customer_reviews(created_at DESC);

-- Helper security definer function to verify admin access
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT (
    -- Listed in public.admin_users by user_id or email
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid() OR email = (auth.jwt() ->> 'email')
    )
    OR
    -- If admin_users table has no rows yet, permit authenticated users so the initial admin is never locked out
    NOT EXISTS (
      SELECT 1 FROM public.admin_users
    )
  );
$$;

-- Enable Row Level Security (RLS)
ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;

-- Policy 1: Public visitors can view ONLY approved reviews
DROP POLICY IF EXISTS "Public can view approved reviews" ON public.customer_reviews;
CREATE POLICY "Public can view approved reviews"
  ON public.customer_reviews
  FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

-- Policy 2: Public visitors can submit pending reviews
DROP POLICY IF EXISTS "Public can submit pending reviews" ON public.customer_reviews;
CREATE POLICY "Public can submit pending reviews"
  ON public.customer_reviews
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'pending' AND
    rating >= 1 AND
    rating <= 5 AND
    char_length(customer_name) >= 2 AND
    char_length(customer_name) <= 100 AND
    char_length(review_text) >= 10 AND
    char_length(review_text) <= 1000
  );

-- Policy 3: Authenticated Admin users can view, approve, reject, or delete all reviews
DROP POLICY IF EXISTS "Admins can manage all reviews" ON public.customer_reviews;
CREATE POLICY "Admins can manage all reviews"
  ON public.customer_reviews
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 2. PRODUCT & VARIANT STOCK FIELDS
-- ------------------------------------------------------------------------------
-- Add stock columns to public.products safely without affecting existing data
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS stock TEXT DEFAULT 'In Stock',
  ADD COLUMN IF NOT EXISTS stock_status TEXT DEFAULT 'In Stock',
  ADD COLUMN IF NOT EXISTS in_stock BOOLEAN DEFAULT true;

-- Ensure public.product_variants has stock column and indexes
ALTER TABLE public.product_variants
  ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 5;

CREATE INDEX IF NOT EXISTS idx_product_variants_stock ON public.product_variants(stock);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);

-- ------------------------------------------------------------------------------
-- 3. ENABLE SUPABASE REALTIME
-- ------------------------------------------------------------------------------
-- Set replica identity to FULL so update broadcasts contain entire record payloads
ALTER TABLE public.customer_reviews REPLICA IDENTITY FULL;
ALTER TABLE public.products REPLICA IDENTITY FULL;
ALTER TABLE public.product_variants REPLICA IDENTITY FULL;

-- Add tables to the supabase_realtime publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'customer_reviews'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.customer_reviews;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'products'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'product_variants'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.product_variants;
  END IF;
END $$;
