Review photo gallery setup
==========================

Apply `20261127_review_photo_gallery.sql` to the existing Supabase project before
deploying the gallery changes. It adds an optional array for up to five photo
paths and extends the existing private-storage read policies to those photos.
Existing single-photo and photo-free reviews remain compatible.

The existing server-only `SUPABASE_SERVICE_ROLE_KEY` is required by `/api/reviews`.
It must never have a NEXT_PUBLIC prefix. No new environment variables are needed.

Verify with a test review in a staging database: submit zero, one and five photos;
approve/reject in admin; ensure pending photos cannot be read anonymously and
all five approved photos are visible. A sixth photo must be rejected.

The client resizes photos before sending them to fit the hosting request limit.
The API independently validates, re-encodes and strips metadata, always saves
reviews as pending, and removes uploaded files if upload or review saving fails.
