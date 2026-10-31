# Product inspection viewer

## Setup
Apply `supabase/migrations/20261031_product_viewer_media.sql` in Supabase SQL Editor after the existing storefront hardening migration (provides `public.is_admin()`). This migration is supplied, not automatically applied. No new environment variables are required. Existing Supabase configuration, product image bucket and admin membership are reused.

## Upload workflow
Visit `/admin/viewer` as an authorized admin, choose an iPhone and its color. Use the existing product image manager to choose the main gallery image. Upload JPEG/PNG/WebP photos through the viewer manager; images use the existing upload/storage pipeline. For rotation, photograph the SAME unit/color at evenly spaced angles with fixed camera, lighting and background. Name frames `001.jpg`, `002.jpg`, etc. Capture a full turn (24–72 frames recommended). Select Rotation before uploading. Never combine different colors or units into a sequence.

Set numeric frame sequence/display order, viewing angle and inspection category; Save each changed media record. Open the inspection button to preview saved media. Changes publish immediately; there is no draft workflow. Remove from viewer removes metadata only, retaining existing gallery photos. Existing image management still handles primary selection and permanent image removal.

Markers accept an array of verified observations: `[{"x":50,"y":30,"label":"Verified scratch"}]`, coordinates in percentages. Current viewer shows verified marker descriptions and coordinates; spatial pin overlays are not implemented. Do not enter inferred defects. Assign a color to device-specific inspection photos. Product-wide media must not be represented as a guarantee about an individual stock unit.

## Behavior
Viewer media is fetched only when opened. Missing table or failed reads fall back to the regular gallery. Rotation is enabled only for real sequences; adjacent rotation frames preload on demand. Original URLs bypass paid image transformations. Zoom is bounded to 1–5x with drag, wheel, double-click/tap and pinch gestures. Automatic rotation respects reduced-motion preference. Existing gallery and shopping controls are retained. Accessories do not receive the iPhone inspection button.

## Manual QA
Use an authorized account to verify upload/save/delete RLS after applying migration. Test a genuine sequence on iOS Safari and Android, including pinch, drag, category switching, Escape, Tab cycling, reduced motion and both themes. No genuine sequence or live schema write was available during local implementation, so these checks require manual setup. Browser-based visual/gesture QA has not been completed.
