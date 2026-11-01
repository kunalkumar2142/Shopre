import { useMemo, useState } from "react";
import type { DisplayProduct } from "@/types/product";
import { matchesCategory } from "@/lib/product-utils";

export type SortOption = "featured" | "price-asc" | "price-desc" | "rating" | "reviews";

export function useProductViewMode(initial: "grid" | "list" = "grid") {
  const [viewMode, setViewMode] = useState<"grid" | "list">(initial);
  return { viewMode, setViewMode };
}

export function useProductSort(initial: SortOption = "featured") {
  const [sortBy, setSortBy] = useState<SortOption>(initial);
  return { sortBy, setSortBy };
}

export function sortProducts(products: DisplayProduct[], sortBy: string): DisplayProduct[] {
  const copy = [...products];
  if (sortBy === "price-asc") return copy.sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") return copy.sort((a, b) => b.price - a.price);
  if (sortBy === "rating") return copy.sort((a, b) => b.rating - a.rating);
  if (sortBy === "reviews") return copy.sort((a, b) => b.reviews - a.reviews);
  return copy;
}

export function useFilteredProducts(options: {
  products: DisplayProduct[];
  searchQuery: string;
  selectedCategory?: string;
  sortBy: string;
  extraFilter?: (p: DisplayProduct) => boolean;
}) {
  const { products, searchQuery, selectedCategory = "all", sortBy, extraFilter } = options;

  return useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return sortProducts(
      products.filter((product) => {
        if (extraFilter && !extraFilter(product)) return false;
        const matchesSearch =
          !q ||
          product.name.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          product.slug.toLowerCase().includes(q);
        const matchesCat = matchesCategory(product, selectedCategory);
        return matchesSearch && matchesCat;
      }),
      sortBy
    );
  }, [products, searchQuery, selectedCategory, sortBy, extraFilter]);
}
