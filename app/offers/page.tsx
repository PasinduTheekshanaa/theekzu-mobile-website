import { permanentRedirect } from "next/navigation";

// Keep existing bookmarks useful after retiring the offers section.
export default function RetiredOffersPage() {
  permanentRedirect("/shop");
}
