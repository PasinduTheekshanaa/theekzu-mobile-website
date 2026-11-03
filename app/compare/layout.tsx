import type { Metadata } from 'next';
export const metadata: Metadata = {
 title: 'Compare iPhones in Sri Lanka',
 description: 'Compare iPhone prices, storage and specifications at Theekzu Mobile to find a model that suits your budget.',
 alternates: { canonical: 'https://theekzu.vercel.app/compare' },
 openGraph: { title: 'Compare iPhones | Theekzu Mobile', description: 'Compare iPhone prices and specifications at Theekzu Mobile Sri Lanka.', url: 'https://theekzu.vercel.app/compare', siteName: 'Theekzu Mobile' },
};
export default function CompareLayout({children}: {children: React.ReactNode}) { return children; }
