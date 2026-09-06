export interface CustomerReview {
  id: string;
  name: string;
  location: string;
  rating: number;
  productBought: string;
  reviewText: string;
  verified: boolean;
  date: string;
}

export const customerReviews: CustomerReview[] = [
  {
    id: "rev-1",
    name: "Kasun P.",
    location: "Colombo",
    rating: 5,
    productBought: "iPhone 16 Pro Max 256GB",
    reviewText: "Great service and very quick response. Highly recommended. Device was sealed with official Apple warranty.",
    verified: true,
    date: "2 days ago",
  },
  {
    id: "rev-2",
    name: "Nethmi S.",
    location: "Kandy",
    rating: 5,
    productBought: "iPhone 15 Pro",
    reviewText: "Bought my iPhone through Theekzu Mobile. Smooth experience and excellent support. WhatsApp ordering was so fast!",
    verified: true,
    date: "1 week ago",
  },
  {
    id: "rev-3",
    name: "Ravindu D.",
    location: "Galle",
    rating: 5,
    productBought: "iPhone 13 (Certified Pre-Owned)",
    reviewText: "Good prices and friendly customer service. Phone came in mint condition with verified battery health report.",
    verified: true,
    date: "2 weeks ago",
  },
  {
    id: "rev-4",
    name: "Mohamed F.",
    location: "Dehiwala",
    rating: 5,
    productBought: "iPhone Trade-In Upgrade",
    reviewText: "Traded my iPhone 12 for an iPhone 15 Pro Max. Valuation was very fair and transparent without hidden charges.",
    verified: true,
    date: "3 weeks ago",
  },
];
