BEGIN;

ALTER TABLE public.customer_reviews DROP CONSTRAINT IF EXISTS customer_review_photo_limit;
ALTER TABLE public.customer_reviews
  ADD COLUMN IF NOT EXISTS image_paths text[] NOT NULL DEFAULT '{}';

ALTER TABLE public.customer_reviews
  ADD CONSTRAINT customer_review_photo_limit CHECK (
    cardinality(image_paths) <= 5
    AND (cardinality(image_paths) = 0 OR image_path IS NOT DISTINCT FROM image_paths[1])
  );

-- Preserve existing single-photo reviews and the private moderation boundary.
DROP POLICY IF EXISTS "Review photos follow moderation" ON storage.objects;
CREATE POLICY "Review photos follow moderation"
ON storage.objects FOR SELECT TO anon, authenticated
USING (
  bucket_id = 'review-images' AND EXISTS (
    SELECT 1 FROM public.customer_reviews r
    WHERE (r.image_path = name OR name = ANY(r.image_paths))
      AND (r.status = 'approved' OR public.is_admin())
  )
);

DROP POLICY IF EXISTS "Review photos visibility boundary" ON storage.objects;
CREATE POLICY "Review photos visibility boundary"
ON storage.objects AS RESTRICTIVE FOR SELECT TO anon, authenticated
USING (
  bucket_id <> 'review-images' OR EXISTS (
    SELECT 1 FROM public.customer_reviews r
    WHERE (r.image_path = name OR name = ANY(r.image_paths))
      AND (r.status = 'approved' OR public.is_admin())
  )
);

-- Existing server-only write policies are retained.
COMMIT;
