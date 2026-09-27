-- Run after supabase_theekzu_schema.sql. No inventory values are overwritten.
BEGIN;
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()); $$;

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Self admin lookup" ON public.admin_users;
CREATE POLICY "Self admin lookup" ON public.admin_users FOR SELECT TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Admin membership writes restricted" ON public.admin_users;
CREATE POLICY "Admin membership writes restricted" ON public.admin_users AS RESTRICTIVE FOR ALL TO anon, authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Restrictive policies also constrain any older permissive write policies.
DO $$ DECLARE t text; op text; BEGIN
  FOREACH t IN ARRAY ARRAY['products','product_variants','product_images','customer_reviews'] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    FOREACH op IN ARRAY ARRAY['INSERT','UPDATE','DELETE'] LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'Store admin ' || op, t);
      IF op = 'INSERT' THEN
        EXECUTE format('CREATE POLICY %I ON public.%I AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK (public.is_admin())', 'Store admin ' || op, t);
      ELSIF op = 'UPDATE' THEN
        EXECUTE format('CREATE POLICY %I ON public.%I AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())', 'Store admin ' || op, t);
      ELSE
        EXECUTE format('CREATE POLICY %I ON public.%I AS RESTRICTIVE FOR DELETE TO anon, authenticated USING (public.is_admin())', 'Store admin ' || op, t);
      END IF;
    END LOOP;
    EXECUTE format('DROP POLICY IF EXISTS "Store admin access" ON public.%I', t);
    EXECUTE format('CREATE POLICY "Store admin access" ON public.%I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())', t);
  END LOOP;
END $$;
DROP POLICY IF EXISTS "Reviews visibility boundary" ON public.customer_reviews;
CREATE POLICY "Reviews visibility boundary" ON public.customer_reviews AS RESTRICTIVE FOR SELECT TO anon, authenticated USING (status = 'approved' OR public.is_admin());

ALTER TABLE public.product_variants ALTER COLUMN stock SET DEFAULT 0;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'variant_stock_nonnegative' AND conrelid = 'public.product_variants'::regclass) THEN
    ALTER TABLE public.product_variants ADD CONSTRAINT variant_stock_nonnegative CHECK (stock IS NOT NULL AND stock >= 0) NOT VALID;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.review_submission_limits (
  client_hash text PRIMARY KEY,
  submitted_at timestamptz NOT NULL
);
ALTER TABLE public.review_submission_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.review_submission_limits FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.submit_store_review(client_hash text, customer_name text, rating integer, review_text text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE last_submission timestamptz;
BEGIN
  IF length(client_hash) <> 64 OR length(trim(customer_name)) NOT BETWEEN 2 AND 100
     OR rating NOT BETWEEN 1 AND 5 OR length(trim(review_text)) NOT BETWEEN 10 AND 1000 THEN
    RAISE EXCEPTION 'Invalid review';
  END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(client_hash, 0));
  SELECT l.submitted_at INTO last_submission FROM public.review_submission_limits l WHERE l.client_hash = submit_store_review.client_hash;
  IF last_submission > now() - interval '5 minutes' THEN
    RAISE EXCEPTION 'Please wait five minutes before submitting another review';
  END IF;
  INSERT INTO public.review_submission_limits VALUES (client_hash, now())
    ON CONFLICT ON CONSTRAINT review_submission_limits_pkey DO UPDATE SET submitted_at = excluded.submitted_at;
  INSERT INTO public.customer_reviews(customer_name, rating, review_text, status)
    VALUES (trim(customer_name), rating, trim(review_text), 'pending');
  DELETE FROM public.review_submission_limits WHERE submitted_at < now() - interval '1 day';
END $$;
REVOKE ALL ON FUNCTION public.submit_store_review(text,text,integer,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_store_review(text,text,integer,text) TO service_role;

CREATE OR REPLACE FUNCTION public.store_review_summary()
RETURNS TABLE(total bigint, average numeric) LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public
AS $$ SELECT count(*), round(avg(rating), 1) FROM public.customer_reviews WHERE status = 'approved'; $$;
GRANT EXECUTE ON FUNCTION public.store_review_summary() TO anon, authenticated;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'product_images') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.product_images;
  END IF;
END $$;
-- Preserve policies for other buckets; constrain this store bucket's writes.
DO $$ DECLARE op text; BEGIN
  FOREACH op IN ARRAY ARRAY['INSERT','UPDATE','DELETE'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', 'Product image admin ' || op);
    IF op = 'INSERT' THEN
      EXECUTE format('CREATE POLICY %I ON storage.objects AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK (bucket_id <> ''product-images'' OR public.is_admin())', 'Product image admin ' || op);
    ELSIF op = 'UPDATE' THEN
      EXECUTE format('CREATE POLICY %I ON storage.objects AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING (bucket_id <> ''product-images'' OR public.is_admin()) WITH CHECK (bucket_id <> ''product-images'' OR public.is_admin())', 'Product image admin ' || op);
    ELSE
      EXECUTE format('CREATE POLICY %I ON storage.objects AS RESTRICTIVE FOR DELETE TO anon, authenticated USING (bucket_id <> ''product-images'' OR public.is_admin())', 'Product image admin ' || op);
    END IF;
  END LOOP;
END $$;
CREATE INDEX IF NOT EXISTS customer_reviews_approved_order ON public.customer_reviews(status, created_at DESC, id);
-- Keep sitemap/product timestamps accurate when a variant changes.
CREATE OR REPLACE FUNCTION public.touch_product_from_variant() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE public.products SET updated_at = now() WHERE id = OLD.product_id;
    RETURN OLD;
  END IF;
  UPDATE public.products SET updated_at = now() WHERE id = NEW.product_id;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS touch_product_from_variant ON public.product_variants;
CREATE TRIGGER touch_product_from_variant AFTER INSERT OR UPDATE OR DELETE ON public.product_variants
FOR EACH ROW EXECUTE FUNCTION public.touch_product_from_variant();
DROP POLICY IF EXISTS "Product visibility boundary" ON public.products;
CREATE POLICY "Product visibility boundary" ON public.products AS RESTRICTIVE FOR SELECT TO anon, authenticated USING (active OR public.is_admin());
DROP POLICY IF EXISTS "Variant visibility boundary" ON public.product_variants;
CREATE POLICY "Variant visibility boundary" ON public.product_variants AS RESTRICTIVE FOR SELECT TO anon, authenticated USING (public.is_admin() OR (active AND EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_id AND p.active)));
DROP POLICY IF EXISTS "Image visibility boundary" ON public.product_images;
CREATE POLICY "Image visibility boundary" ON public.product_images AS RESTRICTIVE FOR SELECT TO anon, authenticated USING (public.is_admin() OR EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_id AND p.active));
COMMIT;
