import { useState, useMemo } from "react";
import { Star, Percent, ArrowUpDown, Search, Grid, List, Flame } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { allProducts } from "@/data/home-data";
import { toast } from "sonner";

const Deals = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleAddToCart = (productName: string) => {
    toast.success(`${productName} added to cart!`);
  };

  // Only products on sale (have originalPrice or badges)
  const dealsProducts = useMemo(() => {
    return allProducts.filter(
      (p) =>
        p.originalPrice !== undefined ||
        ["sale", "hot deal", "clearance"].includes(p.badge?.toLowerCase() || "")
    );
  }, []);

  // Filter and Sort logic
  const filteredProducts = useMemo(() => {
    return dealsProducts
      .filter((product) => {
        const matchesSearch = product.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === "all" ||
          product.category.toLowerCase() === selectedCategory.toLowerCase();

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        // Calculate percentage discount
        const getDiscount = (p: typeof a) => {
          if (!p.originalPrice) return 0;
          return ((p.originalPrice - p.price) / p.originalPrice) * 100;
        };

        if (sortBy === "discount-desc") return getDiscount(b) - getDiscount(a);
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0; // "featured"
      });
  }, [dealsProducts, searchQuery, selectedCategory, sortBy]);

  const categoriesWithDeals = useMemo(() => {
    const list = dealsProducts.map((p) => p.category);
    return Array.from(new Set(list));
  }, [dealsProducts]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 px-6 py-12 text-white shadow-lg sm:px-12 sm:py-16">
          <div className="relative z-10 max-w-xl">
            <Badge className="mb-4 bg-amber-400 text-amber-950 font-semibold hover:bg-amber-300">
              <Percent className="mr-1 size-3" /> Limited Time Deals
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Unbeatable Offers & Savings
            </h1>
            <p className="mt-4 text-base text-amber-50">
              Up to 40% off on premium products. Members get extra benefits and free shipping on orders over $49!
            </p>
          </div>
          <div className="pointer-events-none absolute -right-20 -bottom-20 size-80 rounded-full bg-white/10 blur-3xl" />
          <Flame className="absolute right-8 bottom-8 size-24 text-white/10 animate-pulse hidden md:block" />
        </div>

        {/* Categories pills */}
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
                className={selectedCategory.toLowerCase() === cat.toLowerCase() ? "bg-emerald-600 hover:bg-emerald-700" : ""}
              >
                {cat} ({count})
              </Button>
            );
          })}
        </div>

        {/* Toolbar */}
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
                <option value="discount-desc">Biggest Discount %</option>
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

        {/* Products list */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed">
            <p className="text-lg font-medium text-slate-700">No active deals match your criteria</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try changing categories or resetting filters.
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 bg-emerald-600 hover:bg-emerald-700"
            >
              Show all deals
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => {
              const discount = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : null;
              return (
                <Card
                  key={product.id}
                  className="overflow-hidden border border-rose-100 bg-white shadow-sm transition hover:shadow-md flex flex-col h-full relative"
                >
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="size-full object-cover transition duration-300 hover:scale-105"
                      loading="lazy"
                    />
                    {discount && (
                      <Badge className="absolute top-3 left-3 bg-rose-600">
                        -{discount}% OFF
                      </Badge>
                    )}
                    {product.badge && product.badge.toLowerCase() !== "sale" && (
                      <Badge className="absolute top-3 right-3 bg-amber-500">
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
                      <span className="text-xl font-bold text-rose-600">${product.price.toFixed(2)}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-slate-400 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <Button
                      onClick={() => handleAddToCart(product.name)}
                      className="mt-4 w-full bg-rose-600 hover:bg-rose-700"
                      size="sm"
                    >
                      Add to cart
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => {
              const discount = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : null;
              return (
                <Card
                  key={product.id}
                  className="overflow-hidden border border-rose-100 bg-white shadow-sm transition hover:shadow-md flex flex-col sm:flex-row gap-4 p-4"
                >
                  <div className="relative size-32 sm:size-40 shrink-0 overflow-hidden rounded-md bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="size-full object-cover transition duration-300 hover:scale-105"
                      loading="lazy"
                    />
                    {discount && (
                      <Badge className="absolute top-2 left-2 bg-rose-600 text-[10px] px-1.5 py-0.5">
                        -{discount}%
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
                        <span className="text-xl font-bold text-rose-600">${product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-slate-400 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <Button
                        onClick={() => handleAddToCart(product.name)}
                        className="bg-rose-600 hover:bg-rose-700 px-4"
                        size="sm"
                      >
                        Add to cart
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Deals;