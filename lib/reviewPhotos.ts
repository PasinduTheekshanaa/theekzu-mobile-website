export const MAX_REVIEW_PHOTOS = 5;
export const MAX_REVIEW_UPLOAD_BYTES = 4 * 1024 * 1024;

interface DecodedPhoto {
  source: CanvasImageSource;
  width: number;
  height: number;
  release: () => void;
}

async function decodeBrowserPhoto(blob: Blob): Promise<DecodedPhoto> {
  const url = URL.createObjectURL(blob);
  const image = new Image();
  try {
    image.src = url;
    await image.decode();
    if (!image.naturalWidth || !image.naturalHeight) throw new Error("Empty image");
    return { source: image, width: image.naturalWidth, height: image.naturalHeight, release: () => { URL.revokeObjectURL(url); image.src = ""; } };
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }
}

async function decodeReviewPhoto(file: File): Promise<DecodedPhoto> {
  try { return await decodeBrowserPhoto(file); } catch { /* Decode camera formats locally when the browser cannot. */ }
  const header = new Uint8Array(await file.slice(0, 48).arrayBuffer());
  const brands = String.fromCharCode(...header);
  if (/\.(heic|heif|hif)$/i.test(file.name) || /image\/hei[cf]/i.test(file.type) || (/ftyp/.test(brands) && /heic|heix|hevc|hevx|mif1|msf1/.test(brands))) {
    const { heicTo } = await import("heic-to/csp");
    const converted = await heicTo({ blob: file, type: "image/jpeg", quality: 0.9 });
    return decodeBrowserPhoto(converted);
  }
  if (/\.tiff?$/i.test(file.name) || file.type === "image/tiff" || (header[0] === 0x49 && header[1] === 0x49 && header[2] === 0x2a) || (header[0] === 0x4d && header[1] === 0x4d && header[3] === 0x2a)) {
    const tiff = await import("utif");
    const bytes = await file.arrayBuffer();
    const first = tiff.decode(bytes).find(frame => Array.isArray(frame.t256) && frame.t256[0] && Array.isArray(frame.t257) && frame.t257[0]);
    if (!first) throw new Error("No image found in TIFF");
    tiff.decodeImage(bytes, first);
    const pixels = tiff.toRGBA8(first);
    const canvas = document.createElement("canvas");
    canvas.width = first.width;
    canvas.height = first.height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Photo processing is unavailable");
    context.putImageData(new ImageData(new Uint8ClampedArray(pixels), first.width, first.height), 0, 0);
    return { source: canvas, width: first.width, height: first.height, release: () => { canvas.width = canvas.height = 0; } };
  }
  throw new Error("This image format could not be opened. Try exporting it as a JPG, PNG or HEIC photo.");
}

// Original file size is unrestricted. Only the resized upload travels to the server.
export async function compressReviewPhoto(file: File): Promise<File> {
  if (!file.size) throw new Error("This photo is empty. Please choose another image.");
  let photo: DecodedPhoto;
  try { photo = await decodeReviewPhoto(file); }
  catch { throw new Error('Could not read "' + file.name + '". Choose a valid image or export it as JPG or PNG.'); }
  const canvas = document.createElement("canvas");
  try {
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Photo processing is unavailable. Please try another browser.");
    for (const dimension of [1200, 960, 720, 480, 320]) {
      const scale = Math.min(1, dimension / Math.max(photo.width, photo.height));
      canvas.width = Math.max(1, Math.round(photo.width * scale));
      canvas.height = Math.max(1, Math.round(photo.height * scale));
      context.drawImage(photo.source, 0, 0, canvas.width, canvas.height);
      for (const quality of [0.86, 0.7, 0.5]) {
        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/webp", quality));
        if (blob && blob.size <= 700 * 1024) {
          const extension = blob.type === "image/webp" ? "webp" : "png";
          const name = (file.name.replace(/\.[^.]+$/, "") || "review-photo") + "." + extension;
          return new File([blob], name, { type: blob.type });
        }
      }
    }
    throw new Error("This image could not be prepared for upload. Please try another photo.");
  } finally {
    photo.release();
    canvas.width = canvas.height = 0;
  }
}
