import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowUpDown, Grid, List, Search } from "lucide-react";
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
import { categories } from "@/data/home-data";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/hooks/useProducts";
import { getCategoryLabel, matchesCategory } from "@/lib/product-utils";
import type { DisplayProduct } from "@/types/product";

const Category = () => {
  const { slug = "all" } = useParams<{ slug: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();

  const categoryMeta = categories.find((category) => category.slug === slug);
  const categoryLabel = getCategoryLabel(slug);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch && matchesCategory(product, slug);
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0;
      });
  }, [products, searchQuery, slug, sortBy]);

  const handleAddToCart = (product: DisplayProduct) => {
    addToCart(product.id, product.name);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-medium text-emerald-700">Category</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {categoryLabel}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {categoryMeta
              ? `Browse ${categoryMeta.itemCount}+ curated ${categoryMeta.name.toLowerCase()} picks.`
              : "Browse products in this collection."}
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <Button asChild variant={slug === "all" ? "default" : "outline"} size="sm">
            <Link to="/shop">All products</Link>
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              asChild
              variant={slug === category.slug ? "default" : "outline"}
              size="sm"
              className={slug === category.slug ? "bg-emerald-600 hover:bg-emerald-700" : ""}
            >
              <Link to={`/categories/${category.slug}`}>{category.name}</Link>
            </Button>
          ))}
        </div>

        <div className="mb-6 flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder={`Search in ${categoryLabel}...`}
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
            title={`No products in ${categoryLabel}`}
            description="Try another category or browse the full shop."
            actionLabel="Clear search"
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

export default Category;
