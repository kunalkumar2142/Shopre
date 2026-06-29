import { useState, useMemo } from "react";
import { Percent, ArrowUpDown, Search, Grid, List, Flame } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  ProductListing,
  ProductsEmptyState,
  ProductsErrorState,
  ProductsLoadingState,
} from "@/components/products/ProductListing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/hooks/useProducts";
import { isDealProduct, matchesCategory } from "@/lib/product-utils";
import type { DisplayProduct } from "@/types/product";

const Deals = () => {
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const dealsProducts = useMemo(() => products.filter(isDealProduct), [products]);

  const filteredProducts = useMemo(() => {
    return dealsProducts
      .filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch && matchesCategory(product, selectedCategory);
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0;
      });
  }, [dealsProducts, searchQuery, selectedCategory, sortBy]);

  const categoriesWithDeals = useMemo(() => {
    return Array.from(new Set(dealsProducts.map((p) => p.category)));
  }, [dealsProducts]);

  const handleAddToCart = (product: DisplayProduct) => {
    addToCart(product.id, product.name);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 px-6 py-12 text-white shadow-lg sm:px-12 sm:py-16">
          <div className="relative z-10 max-w-xl">
            <Badge className="mb-4 bg-amber-400 text-amber-950 font-semibold hover:bg-amber-300">
              <Percent className="mr-1 size-3" /> Limited Time Deals
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Unbeatable Offers & Savings
            </h1>
            <p className="mt-4 text-base text-amber-50">
              Featured products with special pricing. Members get extra benefits and free shipping on orders over $49!
            </p>
          </div>
          <div className="pointer-events-none absolute -right-20 -bottom-20 size-80 rounded-full bg-white/10 blur-3xl" />
          <Flame className="absolute right-8 bottom-8 size-24 text-white/10 animate-pulse hidden md:block" />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
            className={selectedCategory === "all" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
          >
            All Deals ({dealsProducts.length})
          </Button>
          {categoriesWithDeals.map((cat) => {
            const count = dealsProducts.filter((p) => p.category === cat).length;
            return (
              <Button
                key={cat}
                variant={selectedCategory.toLowerCase() === cat.toLowerCase() ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.toLowerCase())}
                className={
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : ""
                }
              >
                {cat} ({count})
              </Button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="Search deals..."
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
                <option value="featured">Featured Deals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
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
            title="No active deals match your criteria"
            description="Try changing categories or resetting filters."
            actionLabel="Show all deals"
            onAction={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
          />
        ) : (
          <ProductListing
            products={filteredProducts}
            viewMode={viewMode}
            variant="deals"
            onAddToCart={handleAddToCart}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Deals;
