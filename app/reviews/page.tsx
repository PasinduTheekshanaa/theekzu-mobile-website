import type { Metadata } from "next";
import { CustomerReviews } from "@/components/CustomerReviews";
export const metadata: Metadata = {
 title: "Customer Reviews",
 description: "Read approved customer experiences and share your Theekzu Mobile experience. Browse reviews and customer photos from our community in Sri Lanka.",
 alternates: {canonical:"https://theekzu.vercel.app/reviews"},
 openGraph: {title:"Customer Reviews | Theekzu Mobile",description:"Real customer experiences with Theekzu Mobile.",url:"https://theekzu.vercel.app/reviews",siteName:"Theekzu Mobile"},
};
export default function ReviewsPage() { return <div className="reviews-page py-8 sm:py-12"><header className="container-custom mb-8 text-center"><p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-3">The Theekzu community</p><h1 className="text-3xl sm:text-5xl font-black tracking-tight">Customer Reviews</h1><p className="mt-4 text-sm text-neutral-600">Explore our customers’ stories. Share your own experience.</p></header><CustomerReviews /></div>; }
