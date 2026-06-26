import { useState, useMemo } from "react";
import { Star, Sparkles, ArrowUpDown, Search, Grid, List } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { allProducts } from "@/data/home-data";
import { toast } from "sonner";

const NewArrivals = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleAddToCart = (productName: string) => {
    toast.success(`${productName} added to cart!`);
  };

  // Only products with "new" badge or specific ids that are new
  const newProducts = useMemo(() => {
    return allProducts.filter(
      (p) =>
        p.badge?.toLowerCase() === "new" ||
        ["p6", "p8", "p12", "p15"].includes(p.id)
    );
  }, []);

  // Filter and Sort logic
  const filteredProducts = useMemo(() => {
    return newProducts
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
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0; // "featured"
      });
  }, [newProducts, searchQuery, selectedCategory, sortBy]);

  const categoriesWithNew = useMemo(() => {
    const list = newProducts.map((p) => p.category);
    return Array.from(new Set(list));
  }, [newProducts]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 px-6 py-12 text-white shadow-lg sm:px-12 sm:py-16">
          <div className="relative z-10 max-w-xl">
            <Badge className="mb-4 bg-fuchsia-400 text-fuchsia-950 font-semibold hover:bg-fuchsia-300">
              <Sparkles className="mr-1 size-3" /> Just Landed
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Fresh New Arrivals
            </h1>
            <p className="mt-4 text-base text-fuchsia-50">
              Check out the latest styles and innovative tech that just dropped. Be the first to own the trend!
            </p>
          </div>
          <div className="pointer-events-none absolute -right-20 -bottom-20 size-80 rounded-full bg-white/10 blur-3xl" />
        </div>

        {/* Categories pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
            className={selectedCategory === "all" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
          >
            All New ({newProducts.length})
          </Button>
          {categoriesWithNew.map((cat) => {
            const count = newProducts.filter((p) => p.category === cat).length;
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
              placeholder="Search new arrivals..."
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
                <option value="featured">Newest Featured</option>
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
            <p className="text-lg font-medium text-slate-700">No new arrivals match your criteria</p>
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
              Show all new arrivals
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden border border-blue-100 bg-white shadow-sm transition hover:shadow-md flex flex-col h-full relative"
              >
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="size-full object-cover transition duration-300 hover:scale-105"
                    loading="lazy"
                  />
                  <Badge className="absolute top-3 left-3 bg-blue-600">
                    NEW ARRIVAL
                  </Badge>
                  {product.originalPrice && (
                    <Badge className="absolute top-3 right-3 bg-rose-600">
                      ON SALE
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
                    <span className="text-xl font-bold text-slate-950">${product.price.toFixed(2)}</span>
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
                className="overflow-hidden border border-blue-100 bg-white shadow-sm transition hover:shadow-md flex flex-col sm:flex-row gap-4 p-4"
              >
                <div className="relative size-32 sm:size-40 shrink-0 overflow-hidden rounded-md bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="size-full object-cover transition duration-300 hover:scale-105"
                    loading="lazy"
                  />
                  <Badge className="absolute top-2 left-2 bg-blue-600 text-[10px] px-1.5 py-0.5">
                    NEW
                  </Badge>
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
      </main>

      <Footer />
    </div>
  );
};

export default NewArrivals;