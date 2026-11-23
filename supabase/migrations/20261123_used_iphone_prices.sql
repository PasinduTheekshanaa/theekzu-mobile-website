-- Approved Used iPhone prices, 2026-11-23. All existing colors; stock and Brand New prices unchanged.
-- Missing catalog entries: iphone-16-plus 256GB, iphone-16-plus 128GB, iphone-15-pro 128GB, iphone-15-plus 512GB, iphone-15-plus 256GB, iphone-xs-max 512GB, iphone-xs 64GB, iphone-x 64GB
BEGIN;
CREATE TEMP TABLE requested_used_prices(slug text, storage text, price numeric, PRIMARY KEY(slug,storage)) ON COMMIT DROP;
INSERT INTO requested_used_prices VALUES
('iphone-11', '256GB', 79000),
('iphone-11', '128GB', 75000),
('iphone-11', '64GB', 60000),
('iphone-12', '256GB', 93000),
('iphone-12', '128GB', 85000),
('iphone-12', '64GB', 70000),
('iphone-13', '256GB', 114000),
('iphone-13', '128GB', 106000),
('iphone-14', '256GB', 135000),
('iphone-14', '128GB', 119000),
('iphone-15', '256GB', 179000),
('iphone-15', '128GB', 159000),
('iphone-16-pro-max', '512GB', 315000),
('iphone-16-pro-max', '256GB', 285000),
('iphone-16-pro', '512GB', 285000),
('iphone-16-pro', '256GB', 275000),
('iphone-16-pro', '128GB', 245000),
('iphone-15-pro-max', '1TB', 275000),
('iphone-15-pro-max', '512GB', 265000),
('iphone-15-pro-max', '256GB', 249000),
('iphone-15-pro', '1TB', 247000),
('iphone-15-pro', '256GB', 225000),
('iphone-15-plus', '128GB', 175000),
('iphone-14-pro-max', '1TB', 230000),
('iphone-14-pro-max', '512GB', 225000),
('iphone-14-pro-max', '256GB', 215000),
('iphone-14-pro-max', '128GB', 200000),
('iphone-14-plus', '256GB', 155000),
('iphone-14-plus', '128GB', 135000),
('iphone-14-pro', '1TB', 205000),
('iphone-14-pro', '512GB', 196000),
('iphone-14-pro', '256GB', 188000),
('iphone-14-pro', '128GB', 175000),
('iphone-12-pro-max', '512GB', 145000),
('iphone-12-pro-max', '256GB', 135000),
('iphone-12-pro-max', '128GB', 125000),
('iphone-12-pro', '512GB', 115000),
('iphone-12-pro', '256GB', 108000),
('iphone-12-pro', '128GB', 100000),
('iphone-11-pro-max', '512GB', 103000),
('iphone-11-pro-max', '256GB', 98000),
('iphone-11-pro-max', '64GB', 80000),
('iphone-11-pro', '512GB', 92000),
('iphone-11-pro', '256GB', 86000),
('iphone-11-pro', '64GB', 73000),
('iphone-xs-max', '256GB', 78000),
('iphone-xs-max', '64GB', 70000),
('iphone-xs', '256GB', 60000),
('iphone-x', '256GB', 50000),
('iphone-se2', '64GB', 38000),
('iphone-se2', '128GB', 47000);
UPDATE public.product_variants v SET price = r.price
FROM public.products p, requested_used_prices r
WHERE v.product_id = p.id AND p.slug = r.slug AND v.storage = r.storage
 AND COALESCE(v.condition, p.condition) = 'Used';
-- Verify all matching color variants before committing.
DO $$ BEGIN
 IF EXISTS (SELECT 1 FROM public.product_variants v JOIN public.products p ON p.id=v.product_id JOIN requested_used_prices r ON r.slug=p.slug AND r.storage=v.storage WHERE COALESCE(v.condition,p.condition)='Used' AND v.price IS DISTINCT FROM r.price) THEN RAISE EXCEPTION 'Price verification failed'; END IF;
END $$;
COMMIT;
