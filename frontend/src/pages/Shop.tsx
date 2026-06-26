import { useState, useMemo } from "react";
import { Star, SlidersHorizontal, ArrowUpDown, Search, Grid, List, RefreshCw } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { categories, allProducts } from "@/data/home-data";
import { toast } from "sonner";

const Shop = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setMaxPrice(1000);
    setMinRating(0);
    setSortBy("featured");
    toast.success("Filters reset successfully");
  };

  const handleAddToCart = (productName: string) => {
    toast.success(`${productName} added to cart!`);
  };

  // Filter and Sort logic
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((product) => {
        const matchesSearch = product.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === "all" ||
          product.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesPrice = product.price <= maxPrice;
        const matchesRating = product.rating >= minRating;

        return matchesSearch && matchesCategory && matchesPrice && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "reviews") return b.reviews - a.reviews;
        return 0; // "featured" or default
      });
  }, [searchQuery, selectedCategory, maxPrice, minRating, sortBy]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Shop Our Collection
          </h1>
          <p className="mt-2 text-muted-foreground">
            Explore high-quality items curated specially for your lifestyle.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
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

            {/* Category Filter */}
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
                  All Categories ({allProducts.length})
                </button>
                {categories.map((cat) => {
                  const count = allProducts.filter(
                    (p) => p.category.toLowerCase() === cat.slug.toLowerCase()
                  ).length;
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

            {/* Price Filter */}
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

            {/* Rating Filter */}
            <div>
              <h3 className="font-medium text-slate-900 mb-3 text-sm">Minimum Rating</h3>
              <div className="space-y-1.5">
                {[0, 4.5, 4.7, 4.9].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setMinRating(rating)}
                    className={`w-full text-left px-2 py-1.5 text-sm rounded-md transition flex items-center gap-2 ${
                      minRating === rating
                        ? "bg-emerald-50 text-emerald-800 font-medium"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-0.5">
                      <Star className={`size-3.5 ${rating > 0 ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                    </div>
                    <span>{rating === 0 ? "Any Rating" : `${rating} & up`}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid / Section */}
          <section className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 mb-6">
              {/* Search Bar inside Toolbar */}
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
                {/* Sort selector */}
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

                {/* View switcher */}
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

            {/* Products Listing */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed">
                <p className="text-lg font-medium text-slate-700">No products found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your keywords, price range, or category filter.
                </p>
                <Button
                  onClick={handleResetFilters}
                  className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                >
                  Clear all filters
                </Button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="overflow-hidden border bg-white shadow-sm transition hover:shadow-md flex flex-col h-full"
                  >
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="size-full object-cover transition duration-300 hover:scale-105"
                        loading="lazy"
                      />
                      {product.badge && (
                        <Badge className={`absolute top-3 left-3 ${
                          product.badge.toLowerCase() === "new" ? "bg-blue-600" : "bg-emerald-600"
                        }`}>
                          {product.badge}
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4 flex flex-col flex-1">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {product.category}
                      </p>
                      <h3 className="mt-1 line-clamp-2 font-semibold leading-snug text-slate-800 flex-1">
                        {product.name}
                      </h3>
                      <div className="mt-2 flex items-center gap-1 text-sm">
                        <Star className="size-4 fill-amber-400 text-amber-400" />
                        <span className="font-medium text-slate-700">{product.rating}</span>
                        <span className="text-slate-400">
                          ({product.reviews.toLocaleString()})
                        </span>
                      </div>
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-lg font-bold text-slate-950">${product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-slate-400 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <Button
                        onClick={() => handleAddToCart(product.name)}
                        className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700"
                        size="sm"
                      >
                        Add to cart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="overflow-hidden border bg-white shadow-sm transition hover:shadow-md flex flex-col sm:flex-row gap-4 p-4"
                  >
                    <div className="relative size-32 sm:size-40 shrink-0 overflow-hidden rounded-md bg-muted">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="size-full object-cover transition duration-300 hover:scale-105"
                        loading="lazy"
                      />
                      {product.badge && (
                        <Badge className="absolute top-2 left-2 bg-emerald-600 text-[10px] px-1.5 py-0.5">
                          {product.badge}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {product.category}
                        </p>
                        <h3 className="mt-1 text-base font-semibold leading-snug text-slate-800">
                          {product.name}
                        </h3>
                        <div className="mt-1.5 flex items-center gap-1 text-sm">
                          <Star className="size-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-medium text-slate-700">{product.rating}</span>
                          <span className="text-slate-400">
                            ({product.reviews.toLocaleString()})
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0 flex items-center justify-between gap-4 border-t sm:border-0 pt-3 sm:pt-0">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-slate-950">${product.price.toFixed(2)}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-slate-400 line-through">
                              ${product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <Button
                          onClick={() => handleAddToCart(product.name)}
                          className="bg-emerald-600 hover:bg-emerald-700 px-4"
                          size="sm"
                        >
                          Add to cart
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;