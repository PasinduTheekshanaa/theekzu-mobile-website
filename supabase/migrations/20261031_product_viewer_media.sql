BEGIN;
CREATE TABLE IF NOT EXISTS public.product_viewer_media (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 product_id text NOT NULL,
 image_url text NOT NULL CHECK (image_url ~ '^https://'),
 media_type text NOT NULL DEFAULT 'photo' CHECK (media_type IN ('photo','rotation')),
 viewing_angle text,
 frame_sequence integer NOT NULL DEFAULT 0 CHECK (frame_sequence >= 0),
 display_order integer NOT NULL DEFAULT 0,
 inspection_category text,
 color text,
 markers jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(markers) = 'array'),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS product_viewer_media_product_idx ON public.product_viewer_media(product_id);
ALTER TABLE public.product_viewer_media ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Viewer public read" ON public.product_viewer_media;
DROP POLICY IF EXISTS "Viewer admin write" ON public.product_viewer_media;
CREATE POLICY "Viewer public read" ON public.product_viewer_media FOR SELECT USING (true);
CREATE POLICY "Viewer admin write" ON public.product_viewer_media FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
COMMIT;
