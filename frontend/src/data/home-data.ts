import {
  Headphones,
  Laptop,
  Shirt,
  Sparkles,
  Watch,
  Home as HomeIcon,
  type LucideIcon,
} from "lucide-react";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: LucideIcon;
  itemCount: number;
  color: string;
};

export const heroSlides = [
  {
    id: "1",
    title: "Spring Collection 2026",
    subtitle: "Up to 40% off on fashion & lifestyle",
    cta: "Shop now",
    gradient: "from-violet-600 via-purple-600 to-fuchsia-600",
  },
  {
    id: "2",
    title: "Tech Week at Shopre",
    subtitle: "Laptops, audio & smart wear — deals end Sunday",
    cta: "Explore tech",
    gradient: "from-slate-800 via-slate-700 to-emerald-700",
  },
  {
    id: "3",
    title: "Free shipping over $49",
    subtitle: "Members get extra 10% on every order",
    cta: "Join free",
    gradient: "from-amber-500 via-orange-500 to-rose-500",
  },
];

export const categories: Category[] = [
  { id: "1", name: "Fashion", slug: "fashion", icon: Shirt, itemCount: 1240, color: "bg-rose-100 text-rose-700" },
  { id: "2", name: "Electronics", slug: "electronics", icon: Laptop, itemCount: 890, color: "bg-blue-100 text-blue-700" },
  { id: "3", name: "Audio", slug: "audio", icon: Headphones, itemCount: 320, color: "bg-violet-100 text-violet-700" },
  { id: "4", name: "Watches", slug: "watches", icon: Watch, itemCount: 210, color: "bg-amber-100 text-amber-700" },
  { id: "5", name: "Beauty", slug: "beauty", icon: Sparkles, itemCount: 560, color: "bg-pink-100 text-pink-700" },
  { id: "6", name: "Home", slug: "home", icon: HomeIcon, itemCount: 430, color: "bg-emerald-100 text-emerald-700" },
];

export const topProducts: Product[] = [
  {
    id: "p1",
    name: "Wireless Noise-Cancel Headphones",
    category: "Audio",
    price: 149.99,
    originalPrice: 199.99,
    rating: 4.8,
    reviews: 2341,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    badge: "Best seller",
  },
  {
    id: "p2",
    name: "Minimalist Leather Watch",
    category: "Watches",
    price: 89.0,
    rating: 4.6,
    reviews: 892,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
  },
  {
    id: "p3",
    name: "Ultra-Slim Laptop 14\"",
    category: "Electronics",
    price: 899.0,
    originalPrice: 1099.0,
    rating: 4.9,
    reviews: 512,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
    badge: "Hot deal",
  },
  {
    id: "p4",
    name: "Organic Cotton Tee Pack",
    category: "Fashion",
    price: 34.99,
    rating: 4.5,
    reviews: 1203,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
  },
  {
    id: "p5",
    name: "Ceramic Desk Lamp",
    category: "Home",
    price: 45.0,
    rating: 4.7,
    reviews: 328,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
  },
  {
    id: "p6",
    name: "Hydrating Skincare Set",
    category: "Beauty",
    price: 58.0,
    originalPrice: 72.0,
    rating: 4.8,
    reviews: 967,
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop",
    badge: "New",
  },
];

export const promoBanners = [
  {
    title: "Member perks",
    description: "Earn points on every purchase",
    accent: "bg-emerald-600",
  },
  {
    title: "Same-day delivery",
    description: "In select cities — order by 2pm",
    accent: "bg-indigo-600",
  },
];
