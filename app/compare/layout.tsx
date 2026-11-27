import { siteUrl } from "@/config/site";
import type { Metadata } from 'next';
export const metadata: Metadata = {
 title: 'Compare iPhones in Sri Lanka',
 description: 'Compare iPhone prices, storage and specifications at Theekzu Mobile to find a model that suits your budget.',
 alternates: { canonical: siteUrl("/compare") },
 openGraph: { title: 'Compare iPhones | Theekzu Mobile', description: 'Compare iPhone prices and specifications at Theekzu Mobile Sri Lanka.', url: siteUrl("/compare"), siteName: 'Theekzu Mobile' },
 twitter: {card:'summary_large_image', title:'Compare iPhones | Theekzu Mobile', description:'Compare iPhone prices and specifications in Sri Lanka.', images:[siteUrl('/brand-logo.png')]},
};
export default function CompareLayout({children}: {children: React.ReactNode}) { return children; }
