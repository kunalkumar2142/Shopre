import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowUpDown, Grid, List, Search } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  ProductListing,
  ProductsEmptyState,
  ProductsErrorState,
  ProductsLoadingState,
} from "@/components/products/ProductListing";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/hooks/useProducts";
import type { DisplayProduct } from "@/types/product";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return products
      .filter((product) => {
        if (!query) return true;
        return (
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.slug.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "reviews") return b.reviews - a.reviews;
        return 0;
      });
  }, [products, searchQuery, sortBy]);

  const handleAddToCart = (product: DisplayProduct) => {
    addToCart(product.id, product.name);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Search products</h1>
          <p className="mt-2 text-muted-foreground">
            Find items by name, brand, or category.
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-xl flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-slate-200 bg-white pl-9 focus-visible:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <ArrowUpDown className="size-4 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="cursor-pointer border-0 bg-transparent text-sm font-medium text-slate-700 outline-none"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="reviews">Most Reviewed</option>
              </select>
            </div>

            <div className="flex overflow-hidden rounded-md border bg-white">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 transition ${viewMode === "grid" ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-slate-600"}`}
                aria-label="Grid view"
              >
                <Grid className="size-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 transition ${viewMode === "list" ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-slate-600"}`}
                aria-label="List view"
              >
                <List className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <ProductsLoadingState />
        ) : error ? (
          <ProductsErrorState message={error} />
        ) : filteredProducts.length === 0 ? (
          <ProductsEmptyState
            title="No products found"
            description="Try a different search term or browse the full shop."
            actionLabel="Browse shop"
            onAction={() => setSearchQuery("")}
          />
        ) : (
          <ProductListing
            products={filteredProducts}
            viewMode={viewMode}
            onAddToCart={handleAddToCart}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SearchPage;
