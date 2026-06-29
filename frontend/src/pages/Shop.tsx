import { useState, useMemo } from "react";
import { SlidersHorizontal, ArrowUpDown, Search, Grid, List, RefreshCw } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  ProductListing,
  ProductsEmptyState,
  ProductsErrorState,
  ProductsLoadingState,
} from "@/components/products/ProductListing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { categories } from "@/data/home-data";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/hooks/useProducts";
import { matchesCategory } from "@/lib/product-utils";
import type { DisplayProduct } from "@/types/product";
import { toast } from "sonner";

const Shop = () => {
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setMaxPrice(1000);
    setMinRating(0);
    setSortBy("featured");
    toast.success("Filters reset successfully");
  };

  const handleAddToCart = (product: DisplayProduct) => {
    addToCart(product.id, product.name);
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat = matchesCategory(product, selectedCategory);
        const matchesPrice = product.price <= maxPrice;
        const matchesRating = product.rating >= minRating;

        return matchesSearch && matchesCat && matchesPrice && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "reviews") return b.reviews - a.reviews;
        return 0;
      });
  }, [products, searchQuery, selectedCategory, maxPrice, minRating, sortBy]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Shop Our Collection
          </h1>
          <p className="mt-2 text-muted-foreground">
            Explore high-quality items curated specially for your lifestyle.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 shrink-0 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <SlidersHorizontal className="size-4 text-emerald-600" />
                <span>Filters</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="text-xs text-muted-foreground hover:text-emerald-700 h-8 px-2"
              >
                <RefreshCw className="mr-1 size-3" />
                Reset
              </Button>
            </div>

            <div>
              <h3 className="font-medium text-slate-900 mb-3 text-sm">Categories</h3>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left px-2 py-1.5 text-sm rounded-md transition ${
                    selectedCategory === "all"
                      ? "bg-emerald-50 text-emerald-800 font-medium"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  All Categories ({products.length})
                </button>
                {categories.map((cat) => {
                  const count = products.filter((p) => matchesCategory(p, cat.slug)).length;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-2 py-1.5 text-sm rounded-md transition flex items-center justify-between ${
                        selectedCategory === cat.slug
                          ? "bg-emerald-50 text-emerald-800 font-medium"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs text-slate-400">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-slate-900 text-sm">Max Price</h3>
                <span className="text-sm font-semibold text-emerald-700">${maxPrice}</span>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>$10</span>
                <span>$1000</span>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium text-slate-900 mb-3 text-sm">Minimum Rating</h3>
              <div className="space-y-1.5">
                {[0, 4.5, 4.7, 4.9].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setMinRating(rating)}
                    className={`w-full text-left px-2 py-1.5 text-sm rounded-md transition ${
                      minRating === rating
                        ? "bg-emerald-50 text-emerald-800 font-medium"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {rating === 0 ? "Any Rating" : `${rating} & up`}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-white border-slate-200 focus-visible:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-4 self-end sm:self-auto">
                <div className="flex items-center gap-2 text-sm">
                  <ArrowUpDown className="size-4 text-slate-400" />
                  <span className="text-muted-foreground hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent border-0 font-medium text-slate-700 focus:ring-0 cursor-pointer text-sm outline-none"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="reviews">Most Reviewed</option>
                  </select>
                </div>

                <div className="flex border rounded-md overflow-hidden bg-white">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 transition ${viewMode === "grid" ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-slate-600"}`}
                    aria-label="Grid View"
                  >
                    <Grid className="size-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 transition ${viewMode === "list" ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-slate-600"}`}
                    aria-label="List View"
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
                description="Try adjusting your keywords, price range, or category filter."
                actionLabel="Clear all filters"
                onAction={handleResetFilters}
              />
            ) : (
              <ProductListing
                products={filteredProducts}
                viewMode={viewMode}
                onAddToCart={handleAddToCart}
              />
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
