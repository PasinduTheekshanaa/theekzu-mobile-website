export const MAX_REVIEW_PHOTOS = 5;
export const MAX_REVIEW_PHOTO_BYTES = 3 * 1024 * 1024;
export const MAX_REVIEW_UPLOAD_BYTES = 4 * 1024 * 1024;

// Keep five photos comfortably inside the hosting platform's request limit.
export async function compressReviewPhoto(file: File): Promise<File> {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    if (!image.naturalWidth || !image.naturalHeight || image.naturalWidth * image.naturalHeight > 25000000) {
      throw new Error("Choose a photo smaller than 25 megapixels.");
    }
    const scale = Math.min(1, 1200 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Photo processing is unavailable. Please try another browser.");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    for (const quality of [0.82, 0.65, 0.45]) {
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/webp", quality));
      if (blob && blob.size <= 700 * 1024) {
        return new File([blob], "review-photo.webp", { type: blob.type });
      }
    }
    throw new Error("This photo is too detailed to upload. Please choose a smaller photo.");
  } finally {
    URL.revokeObjectURL(url);
  }
}
