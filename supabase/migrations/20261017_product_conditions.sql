-- Keep the existing default condition; allow both options on the same product.
BEGIN;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS available_conditions text[];
UPDATE public.products
SET available_conditions = ARRAY[COALESCE(condition, 'Brand New')]
WHERE available_conditions IS NULL;
ALTER TABLE public.products ALTER COLUMN available_conditions SET NOT NULL;
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_available_conditions_check;
ALTER TABLE public.products ADD CONSTRAINT products_available_conditions_check CHECK (
  cardinality(available_conditions) BETWEEN 1 AND 2
  AND available_conditions <@ ARRAY['Brand New', 'Used']::text[]
  AND array_position(available_conditions, NULL) IS NULL
  AND condition = ANY(available_conditions)
);
COMMIT;
