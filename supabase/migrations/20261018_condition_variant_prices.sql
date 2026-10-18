-- Run once before using condition-specific variants. No prices, stock quantities,
-- variant IDs or existing SKUs are changed or duplicated.
BEGIN;
CREATE TEMP TABLE condition_variant_snapshot ON COMMIT DROP AS
  SELECT id, price, old_price, stock, sku FROM public.product_variants;
ALTER TABLE public.product_variants ADD COLUMN IF NOT EXISTS condition text;
UPDATE public.product_variants v
SET condition = CASE WHEN p.category = 'accessories' THEN 'Brand New'
                     WHEN p.condition = 'Used' THEN 'Used' ELSE 'Brand New' END
FROM public.products p WHERE p.id = v.product_id AND v.condition IS NULL;
ALTER TABLE public.product_variants ALTER COLUMN condition SET NOT NULL;
-- Older clients omit condition. The trigger below derives the parent condition
-- rather than silently putting a Used phone's new row under Brand New.
ALTER TABLE public.product_variants ALTER COLUMN condition DROP DEFAULT;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'product_variant_condition_valid' AND conrelid = 'public.product_variants'::regclass) THEN
    ALTER TABLE public.product_variants ADD CONSTRAINT product_variant_condition_valid CHECK (condition IN ('Brand New', 'Used'));
  END IF;
END $$;

-- Retire only the old uniqueness rule for storage+colour. Keep SKU and all
-- unrelated constraints. The new key permits both conditions for one option.
DO $$ DECLARE item record; BEGIN
  FOR item IN SELECT c.conname FROM pg_constraint c
    WHERE c.conrelid = 'public.product_variants'::regclass AND c.contype = 'u'
      AND ARRAY(SELECT a.attname::text FROM unnest(c.conkey) k JOIN pg_attribute a
        ON a.attrelid = c.conrelid AND a.attnum = k ORDER BY a.attname)
        = ARRAY['color','product_id','storage']
  LOOP EXECUTE format('ALTER TABLE public.product_variants DROP CONSTRAINT %I', item.conname); END LOOP;
  FOR item IN SELECT i.indexrelid::regclass AS index_name FROM pg_index i
    WHERE i.indrelid = 'public.product_variants'::regclass AND i.indisunique AND NOT i.indisprimary
      AND NOT EXISTS (SELECT 1 FROM pg_constraint c WHERE c.conindid = i.indexrelid)
      AND i.indexprs IS NULL
      AND ARRAY(SELECT a.attname::text FROM unnest(i.indkey) k JOIN pg_attribute a
        ON a.attrelid = i.indrelid AND a.attnum = k ORDER BY a.attname)
        = ARRAY['color','product_id','storage']
  LOOP EXECUTE format('DROP INDEX %s', item.index_name); END LOOP;
END $$;
CREATE UNIQUE INDEX IF NOT EXISTS product_variants_condition_options_key
  ON public.product_variants(product_id, condition, storage, color);

CREATE OR REPLACE FUNCTION public.normalize_accessory_variant_condition()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.condition IS NULL THEN
    SELECT CASE WHEN category = 'accessories' THEN 'Brand New' ELSE condition END
      INTO NEW.condition FROM public.products WHERE id = NEW.product_id;
  END IF;
  IF EXISTS (SELECT 1 FROM public.products WHERE id = NEW.product_id AND category = 'accessories') THEN
    NEW.condition := 'Brand New';
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS accessory_variant_condition ON public.product_variants;
CREATE TRIGGER accessory_variant_condition BEFORE INSERT OR UPDATE ON public.product_variants
FOR EACH ROW EXECUTE FUNCTION public.normalize_accessory_variant_condition();

CREATE OR REPLACE FUNCTION public.normalize_accessory_product_condition()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.category = 'accessories' THEN
    NEW.condition := 'Brand New';
    NEW.available_conditions := ARRAY['Brand New']::text[];
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS accessory_product_condition ON public.products;
CREATE TRIGGER accessory_product_condition BEFORE INSERT OR UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.normalize_accessory_product_condition();
UPDATE public.products SET condition = 'Brand New', available_conditions = ARRAY['Brand New']::text[] WHERE category = 'accessories';
UPDATE public.product_variants v SET condition = 'Brand New'
FROM public.products p WHERE p.id = v.product_id AND p.category = 'accessories' AND v.condition <> 'Brand New';
NOTIFY pgrst, 'reload schema';
DO $$ BEGIN
  IF (SELECT count(*) FROM public.product_variants) <> (SELECT count(*) FROM condition_variant_snapshot)
    OR EXISTS (SELECT 1 FROM condition_variant_snapshot s LEFT JOIN public.product_variants v ON v.id = s.id
      WHERE v.id IS NULL OR v.price IS DISTINCT FROM s.price OR v.old_price IS DISTINCT FROM s.old_price
        OR v.stock IS DISTINCT FROM s.stock OR v.sku IS DISTINCT FROM s.sku) THEN
    RAISE EXCEPTION 'Migration aborted: existing inventory or prices changed';
  END IF;
END $$;
COMMIT;
