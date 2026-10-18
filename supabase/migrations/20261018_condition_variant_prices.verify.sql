-- Integration checks: all inserted test variants are rolled back.
BEGIN;
DO $$ DECLARE sample public.product_variants%ROWTYPE; alternate text; test_id uuid; actual text; BEGIN
  SELECT v.* INTO sample FROM public.product_variants v JOIN public.products p ON p.id = v.product_id
    WHERE p.category = 'iphones' AND NOT EXISTS (SELECT 1 FROM public.product_variants other
      WHERE other.product_id = v.product_id AND other.storage = v.storage AND other.color = v.color AND other.condition <> v.condition)
    LIMIT 1;
  IF sample.id IS NULL THEN RAISE EXCEPTION 'No phone sample available'; END IF;
  alternate := CASE WHEN sample.condition = 'Used' THEN 'Brand New' ELSE 'Used' END;
  INSERT INTO public.product_variants(product_id, condition, storage, color, price, stock, sku, active)
    VALUES(sample.product_id, alternate, sample.storage, sample.color, sample.price + 1, 0, 'QA-' || gen_random_uuid(), false)
    RETURNING id INTO test_id;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE id = test_id AND condition = alternate AND price = sample.price + 1) THEN
    RAISE EXCEPTION 'Independent condition price was not stored';
  END IF;
  BEGIN
    INSERT INTO public.product_variants(product_id, condition, storage, color, price, stock, sku, active)
      VALUES(sample.product_id, alternate, sample.storage, sample.color, sample.price + 2, 0, 'QA-' || gen_random_uuid(), false);
    RAISE EXCEPTION 'Duplicate option in the same condition was allowed';
  EXCEPTION WHEN unique_violation THEN NULL;
  END;
  SELECT v.* INTO sample FROM public.product_variants v JOIN public.products p ON p.id = v.product_id WHERE p.category = 'accessories' LIMIT 1;
  IF sample.id IS NOT NULL THEN
    INSERT INTO public.product_variants(product_id, condition, storage, color, price, stock, sku, active)
      VALUES(sample.product_id, 'Used', sample.storage, 'QA-TEST', sample.price, 0, 'QA-' || gen_random_uuid(), false)
      RETURNING condition INTO actual;
    IF actual <> 'Brand New' THEN RAISE EXCEPTION 'Accessory condition was not normalized'; END IF;
  END IF;
END $$;
ROLLBACK;
SELECT count(*) AS variants, sum(price) AS total_prices, sum(stock) AS total_stock,
  count(*) FILTER (WHERE condition IS NULL) AS missing_condition,
  count(*) FILTER (WHERE sku LIKE 'QA-%') AS persisted_test_variants
FROM public.product_variants;
