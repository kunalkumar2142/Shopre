import { categories } from "@/data/home-data";
import type { ApiProduct, DisplayProduct } from "@/types/product";

const NEW_ARRIVAL_DAYS = 30;

export function isRecentProduct(createdAt?: string): boolean {
  if (!createdAt) return false;
  const created = new Date(createdAt);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - NEW_ARRIVAL_DAYS);
  return created >= cutoff;
}

export function mapApiToDisplay(product: ApiProduct): DisplayProduct {
  const image =
    product.images?.[0] ??
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop";

  let badge: string | undefined;
  if (product.isFeatured) badge = "Hot deal";
  else if (isRecentProduct(product.createdAt)) badge = "New";

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.brand || "General",
    price: product.price ?? 0,
    rating: product.rating ?? 0,
    reviews: product.ratingCount ?? 0,
    image,
    badge,
    description: product.description,
    stock: product.stock,
    isFeatured: product.isFeatured,
    createdAt: product.createdAt,
  };
}

export function matchesCategory(product: DisplayProduct, slug: string): boolean {
  if (slug === "all") return true;

  const category = categories.find((c) => c.slug === slug);
  const value = product.category.toLowerCase();

  return (
    value === slug ||
    value.includes(slug) ||
    slug.includes(value) ||
    (category ? value === category.name.toLowerCase() : false)
  );
}

export function isDealProduct(product: DisplayProduct): boolean {
  return product.isFeatured === true;
}

export function isNewArrival(product: DisplayProduct): boolean {
  return product.badge?.toLowerCase() === "new" || isRecentProduct(product.createdAt);
}

export function getCategoryLabel(slug: string): string {
  return categories.find((c) => c.slug === slug)?.name ?? slug;
}
