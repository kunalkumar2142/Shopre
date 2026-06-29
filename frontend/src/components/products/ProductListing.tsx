import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { DisplayProduct } from "@/types/product";

type ProductCardVariant = "default" | "deals" | "new";

type ProductCardProps = {
  product: DisplayProduct;
  variant?: ProductCardVariant;
  onAddToCart: (product: DisplayProduct) => void;
};

const variantStyles: Record<
  ProductCardVariant,
  { border: string; price: string; button: string; badge?: string }
> = {
  default: {
    border: "",
    price: "text-slate-950",
    button: "bg-emerald-600 hover:bg-emerald-700",
  },
  deals: {
    border: "border-rose-100",
    price: "text-rose-600",
    button: "bg-rose-600 hover:bg-rose-700",
    badge: "bg-rose-600",
  },
  new: {
    border: "border-blue-100",
    price: "text-slate-950",
    button: "bg-emerald-600 hover:bg-emerald-700",
    badge: "bg-blue-600",
  },
};

export function ProductGridCard({
  product,
  variant = "default",
  onAddToCart,
}: ProductCardProps) {
  const styles = variantStyles[variant];

  return (
    <Card
      className={`overflow-hidden border bg-white shadow-sm transition hover:shadow-md flex flex-col h-full ${styles.border}`}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="size-full object-cover transition duration-300 hover:scale-105"
          loading="lazy"
        />
        {variant === "new" ? (
          <Badge className="absolute top-3 left-3 bg-blue-600">NEW ARRIVAL</Badge>
        ) : (
          product.badge && (
            <Badge
              className={`absolute top-3 left-3 ${
                styles.badge ??
                (product.badge.toLowerCase() === "new" ? "bg-blue-600" : "bg-emerald-600")
              }`}
            >
              {product.badge}
            </Badge>
          )
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
          <span className="text-slate-400">({product.reviews.toLocaleString()})</span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className={`text-lg font-bold ${styles.price}`}>
            ${product.price.toFixed(2)}
          </span>
        </div>
        <Button
          onClick={() => onAddToCart(product)}
          className={`mt-4 w-full ${styles.button}`}
          size="sm"
        >
          Add to cart
        </Button>
      </CardContent>
    </Card>
  );
}

export function ProductListCard({
  product,
  variant = "default",
  onAddToCart,
}: ProductCardProps) {
  const styles = variantStyles[variant];

  return (
    <Card
      className={`overflow-hidden border bg-white shadow-sm transition hover:shadow-md flex flex-col sm:flex-row gap-4 p-4 ${styles.border}`}
    >
      <div className="relative size-32 sm:size-40 shrink-0 overflow-hidden rounded-md bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="size-full object-cover transition duration-300 hover:scale-105"
          loading="lazy"
        />
        {product.badge && variant !== "new" && (
          <Badge className="absolute top-2 left-2 bg-emerald-600 text-[10px] px-1.5 py-0.5">
            {product.badge}
          </Badge>
        )}
        {variant === "new" && (
          <Badge className="absolute top-2 left-2 bg-blue-600 text-[10px] px-1.5 py-0.5">
            NEW
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
            <span className="text-slate-400">({product.reviews.toLocaleString()})</span>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center justify-between gap-4 border-t sm:border-0 pt-3 sm:pt-0">
          <span className={`text-xl font-bold ${styles.price}`}>
            ${product.price.toFixed(2)}
          </span>
          <Button
            onClick={() => onAddToCart(product)}
            className={`${styles.button} px-4`}
            size="sm"
          >
            Add to cart
          </Button>
        </div>
      </div>
    </Card>
  );
}

type ProductListingProps = {
  products: DisplayProduct[];
  viewMode: "grid" | "list";
  variant?: ProductCardVariant;
  onAddToCart: (product: DisplayProduct) => void;
};

export function ProductListing({
  products,
  viewMode,
  variant = "default",
  onAddToCart,
}: ProductListingProps) {
  if (viewMode === "grid") {
    return (
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductGridCard
            key={product.id}
            product={product}
            variant={variant}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <ProductListCard
          key={product.id}
          product={product}
          variant={variant}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

export function ProductsLoadingState() {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-80 animate-pulse rounded-xl border bg-slate-100"
        />
      ))}
    </div>
  );
}

export function ProductsErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed bg-slate-50 px-6 py-16 text-center">
      <p className="text-lg font-medium text-slate-700">Unable to load products</p>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function ProductsEmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed">
      <p className="text-lg font-medium text-slate-700">{title}</p>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
      <Button onClick={onAction} className="mt-4 bg-emerald-600 hover:bg-emerald-700">
        {actionLabel}
      </Button>
    </div>
  );
}
