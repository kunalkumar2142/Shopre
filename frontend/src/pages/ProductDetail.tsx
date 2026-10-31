import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Package,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import axios from "axios";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getApiErrorMessage, getProductBySlug, parseProductsResponse } from "@/apis/apis";
import { useCart } from "@/context/CartContext";
import { isRecentProduct } from "@/lib/product-utils";
import type { ApiProduct } from "@/types/product";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [adding, setAdding] = useState(false);

  const loadProduct = useCallback(async () => {
    if (!slug) {
      setProduct(null);
      setError("Product not found.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await getProductBySlug(slug);
      const [item] = parseProductsResponse(response.data);
      if (!item) {
        setProduct(null);
        setError("This product could not be found.");
        return;
      }
      setProduct(item);
      setQuantity(1);
      setActiveImage(0);
    } catch (loadError) {
      setProduct(null);
      if (axios.isAxiosError(loadError) && loadError.response?.status === 404) {
        setError("This product could not be found.");
      } else {
        setError(getApiErrorMessage(loadError, "Could not load this product."));
      }
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void loadProduct();
  }, [loadProduct]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    await addToCart(product.id, product.name, quantity);
    setAdding(false);
  };

  const stock = product?.stock ?? 0;
  const inStock = product?.stock == null || stock > 0;
  const maxQuantity = stock > 0 ? stock : 1;
  const images = (product?.images ?? []).filter(Boolean);
  const activeImageUrl = images[activeImage] ?? images[0];

  const decreaseQuantity = () => setQuantity((current) => Math.max(1, current - 1));
  const increaseQuantity = () =>
    setQuantity((current) => Math.min(maxQuantity, current + 1));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-slate-900">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-slate-900">
            Shop
          </Link>
          <span>/</span>
          <span className="truncate text-slate-700">{product?.name ?? "Product"}</span>
        </div>

        {loading ? (
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-2xl border bg-slate-100" />
            <div className="space-y-4">
              <div className="h-8 w-2/3 animate-pulse rounded bg-slate-100" />
              <div className="h-5 w-1/3 animate-pulse rounded bg-slate-100" />
              <div className="h-24 animate-pulse rounded bg-slate-100" />
              <div className="h-10 w-40 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        ) : error || !product ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
              <Package className="size-12 text-slate-300" />
              <div>
                <p className="text-lg font-medium text-slate-800">Could not load product</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {error ?? "This product could not be found."}
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => void loadProduct()} className="bg-emerald-600 hover:bg-emerald-700">
                  <RefreshCw className="size-4" />
                  Try again
                </Button>
                <Button asChild variant="outline">
                  <Link to="/shop">Back to shop</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-3">
              <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border bg-slate-50">
                {activeImageUrl ? (
                  <img
                    src={activeImageUrl}
                    alt={product.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <ShoppingBag className="size-16 text-slate-300" />
                )}
                {product.isFeatured && (
                  <Badge className="absolute left-4 top-4 bg-emerald-600">Featured</Badge>
                )}
                {!product.isFeatured && isRecentProduct(product.createdAt) && (
                  <Badge className="absolute left-4 top-4 bg-blue-600">New arrival</Badge>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      className={`size-16 overflow-hidden rounded-lg border-2 transition ${
                        index === activeImage ? "border-emerald-600" : "border-transparent"
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <img src={image} alt="" className="size-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
                {product.brand || "General"}
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {product.name}
              </h1>

              <div className="mt-3 flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-slate-700">
                    {(product.rating ?? 0).toFixed(1)}
                  </span>
                </div>
                <span className="text-muted-foreground">
                  ({(product.ratingCount ?? 0).toLocaleString()} reviews)
                </span>
              </div>

              <div className="mt-5 flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-bold text-slate-950">
                  ${(product.price ?? 0).toFixed(2)}
                </span>
                <Badge
                  variant="outline"
                  className={
                    inStock
                      ? "border-transparent bg-emerald-100 text-emerald-800"
                      : "border-transparent bg-rose-100 text-rose-800"
                  }
                >
                  {inStock ? (stock > 0 ? `${stock} in stock` : "In stock") : "Out of stock"}
                </Badge>
              </div>

              <Separator className="my-6" />

              <p className="leading-relaxed text-slate-600">
                {product.description || "No description is available for this product yet."}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-9 rounded-full"
                    onClick={decreaseQuantity}
                    disabled={!inStock || quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="size-4" />
                  </Button>
                  <span className="min-w-10 text-center text-sm font-semibold text-slate-900">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-9 rounded-full"
                    onClick={increaseQuantity}
                    disabled={!inStock || quantity >= maxQuantity}
                    aria-label="Increase quantity"
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>

                <Button
                  className="h-10 flex-1 bg-emerald-600 hover:bg-emerald-700 sm:flex-none sm:px-8"
                  onClick={() => void handleAddToCart()}
                  disabled={!inStock || adding}
                >
                  <ShoppingBag className="size-4" />
                  {adding ? "Adding…" : inStock ? "Add to cart" : "Out of stock"}
                </Button>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <Truck className="mt-0.5 size-4 text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">Fast delivery</p>
                    <p className="text-xs text-muted-foreground">2–4 business days</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <ShieldCheck className="mt-0.5 size-4 text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">Secure checkout</p>
                    <p className="text-xs text-muted-foreground">Protected payments</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <ArrowLeft className="mt-0.5 size-4 text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">Easy returns</p>
                    <p className="text-xs text-muted-foreground">Within 30 days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
