BEGIN;
ALTER TABLE public.customer_reviews ADD COLUMN IF NOT EXISTS image_path text;
INSERT INTO storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
VALUES ('review-images', 'review-images', false, 3145728, ARRAY['image/webp'])
ON CONFLICT (id) DO NOTHING;
DROP POLICY IF EXISTS "Review photos follow moderation" ON storage.objects;
CREATE POLICY "Review photos follow moderation" ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'review-images' AND EXISTS (SELECT 1 FROM public.customer_reviews r WHERE r.image_path = name AND (r.status = 'approved' OR public.is_admin())));
DROP POLICY IF EXISTS "Review photos visibility boundary" ON storage.objects;
CREATE POLICY "Review photos visibility boundary" ON storage.objects AS RESTRICTIVE FOR SELECT TO anon, authenticated
USING (bucket_id <> 'review-images' OR EXISTS (SELECT 1 FROM public.customer_reviews r WHERE r.image_path = name AND (r.status = 'approved' OR public.is_admin())));
DROP POLICY IF EXISTS "Review photos server writes only" ON storage.objects;
CREATE POLICY "Review photos server writes only" ON storage.objects AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK (bucket_id <> 'review-images');
DROP POLICY IF EXISTS "Review photos server updates only" ON storage.objects;
CREATE POLICY "Review photos server updates only" ON storage.objects AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING (bucket_id <> 'review-images') WITH CHECK (bucket_id <> 'review-images');
DROP POLICY IF EXISTS "Review photos server deletes only" ON storage.objects;
CREATE POLICY "Review photos server deletes only" ON storage.objects AS RESTRICTIVE FOR DELETE TO anon, authenticated USING (bucket_id <> 'review-images');
CREATE OR REPLACE FUNCTION public.submit_store_review_with_image(client_hash text, customer_name text, rating integer, review_text text, image_path text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE last_submission timestamptz;
BEGIN
  IF length(client_hash) <> 64 OR length(trim(customer_name)) NOT BETWEEN 2 AND 100
     OR rating NOT BETWEEN 1 AND 5 OR length(trim(review_text)) NOT BETWEEN 10 AND 1000 THEN
    RAISE EXCEPTION 'Invalid review';
  END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(client_hash, 0));
  SELECT l.submitted_at INTO last_submission FROM public.review_submission_limits l WHERE l.client_hash = submit_store_review_with_image.client_hash;
  IF last_submission > now() - interval '5 minutes' THEN
    RAISE EXCEPTION 'Please wait five minutes before submitting another review';
  END IF;
  INSERT INTO public.review_submission_limits VALUES (client_hash, now())
    ON CONFLICT ON CONSTRAINT review_submission_limits_pkey DO UPDATE SET submitted_at = excluded.submitted_at;
  INSERT INTO public.customer_reviews(customer_name, rating, review_text, status, image_path)
    VALUES (trim(customer_name), rating, trim(review_text), 'pending', image_path);
  DELETE FROM public.review_submission_limits WHERE submitted_at < now() - interval '1 day';
END $$;
REVOKE ALL ON FUNCTION public.submit_store_review_with_image(text,text,integer,text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_store_review_with_image(text,text,integer,text,text) TO service_role;


COMMIT;
