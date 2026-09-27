import sharp from "sharp";
export const MAX_REVIEW_IMAGE_BYTES = 3 * 1024 * 1024;
export async function prepareReviewImage(file: File): Promise<Buffer> {
  if (!file.size || file.size > MAX_REVIEW_IMAGE_BYTES) throw new Error("Choose an image up to 3 MB.");
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("Choose a JPG, PNG or WebP image.");
  try {
    const input = Buffer.from(await file.arrayBuffer());
    const image = sharp(input, { limitInputPixels: 25000000, failOn: "warning" });
    const metadata = await image.metadata();
    if (!["jpeg", "png", "webp"].includes(metadata.format || "") || (metadata.pages || 1) > 1) throw new Error("Unsupported image");
    // Re-encode to remove metadata and embedded content, and limit dimensions.
    return await image.rotate().resize(1200, 1200, { fit: "inside", withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
  } catch { throw new Error("This image could not be read. Choose a valid JPG, PNG or WebP photo."); }
}
