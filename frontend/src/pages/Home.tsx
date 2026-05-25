import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Star } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  categories,
  heroSlides,
  promoBanners,
  topProducts,
} from "@/data/home-data";

const Home = () => {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((i) => (i + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[slideIndex];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            className={`mx-auto max-w-7xl px-4 py-10 transition-all duration-500 sm:px-6 sm:py-14 lg:px-8 lg:py-20`}
          >
            <div
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${slide.gradient} px-6 py-16 text-white shadow-xl sm:px-12 sm:py-20`}
            >
              <div className="relative z-10 max-w-xl">
                <Badge className="mb-4 border-white/30 bg-white/20 text-white hover:bg-white/30">
                  Shopre exclusive
                </Badge>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  {slide.title}
                </h1>
                <p className="mt-4 text-lg text-white/90">{slide.subtitle}</p>
                <Button
                  asChild
                  size="lg"
                  className="mt-8 bg-white text-slate-900 hover:bg-white/90"
                >
                  <Link to="/shop">
                    {slide.cta}
                    <ArrowRight className="ml-1 size-4" />
                  </Link>
                </Button>
              </div>
              <div className="pointer-events-none absolute -right-20 -bottom-20 size-80 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute right-4 bottom-4 flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="size-8 rounded-full bg-white/20 text-white hover:bg-white/30"
                  onClick={() =>
                    setSlideIndex((i) => (i - 1 + heroSlides.length) % heroSlides.length)
                  }
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="size-8 rounded-full bg-white/20 text-white hover:bg-white/30"
                  onClick={() => setSlideIndex((i) => (i + 1) % heroSlides.length)}
                  aria-label="Next slide"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
              <div className="absolute bottom-4 left-6 flex gap-1.5 sm:left-12">
                {heroSlides.map((_, i) => (
                  <button
                    key={heroSlides[i].id}
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setSlideIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === slideIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Promo strip */}
        <section className="border-y bg-slate-50">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:px-8">
            {promoBanners.map((banner) => (
              <div
                key={banner.title}
                className={`flex items-center justify-between rounded-xl ${banner.accent} px-6 py-4 text-white`}
              >
                <div>
                  <p className="font-semibold">{banner.title}</p>
                  <p className="text-sm text-white/85">{banner.description}</p>
                </div>
                <ArrowRight className="size-5 shrink-0 opacity-80" />
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Shop by category</h2>
              <p className="mt-1 text-muted-foreground">
                Browse curated collections across Shopre
              </p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link to="/shop">View all</Link>
            </Button>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.id}
                  to={`/categories/${cat.slug}`}
                  className="group flex flex-col items-center rounded-xl border bg-card p-5 text-center transition hover:border-emerald-300 hover:shadow-md"
                >
                  <div
                    className={`flex size-14 items-center justify-center rounded-full ${cat.color} transition group-hover:scale-105`}
                  >
                    <Icon className="size-7" />
                  </div>
                  <span className="mt-3 font-medium">{cat.name}</span>
                  <span className="text-xs text-muted-foreground">{cat.itemCount} items</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Top products */}
        <section className="bg-slate-50 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Top products</h2>
                <p className="mt-1 text-muted-foreground">
                  Best-rated picks loved by Shopre customers
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/shop">See all products</Link>
              </Button>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {topProducts.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden border-0 bg-white shadow-sm transition hover:shadow-lg"
                >
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="size-full object-cover transition duration-300 hover:scale-105"
                      loading="lazy"
                    />
                    {product.badge && (
                      <Badge className="absolute top-3 left-3 bg-emerald-600">
                        {product.badge}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {product.category}
                    </p>
                    <h3 className="mt-1 line-clamp-2 font-semibold leading-snug">
                      {product.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-1 text-sm">
                      <Star className="size-4 fill-amber-400 text-amber-400" />
                      <span className="font-medium">{product.rating}</span>
                      <span className="text-muted-foreground">
                        ({product.reviews.toLocaleString()})
                      </span>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <Button className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700" size="sm">
                      Add to cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-12 text-center sm:px-12">
            <h2 className="text-2xl font-bold">Stay in the loop</h2>
            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
              Get early access to sales, new drops, and member-only offers from Shopre.
            </p>
            <form
              className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="you@example.com"
                className="flex-1 rounded-md border bg-white px-4 py-2 text-sm outline-none ring-emerald-400 focus:ring-2"
              />
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                Subscribe
              </Button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
