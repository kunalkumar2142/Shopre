import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Sparkles, Trash2, Truck } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

const Cart = () => {
  const { isAuthenticated } = useAuth();
  const { items, totalAmount, loading, refreshCart, removeItem, updateQuantity, clearCart } = useCart();

  const shippingFee = totalAmount > 100 ? 0 : 9.99;
  const freeShippingTarget = Math.max(0, 100 - totalAmount);
  const checkoutDisabled = items.length === 0 || loading;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Your cart</h1>
            <p className="mt-2 text-muted-foreground">
              Review your selections and get ready for checkout.
            </p>
          </div>
          {!loading && items.length > 0 && (
            <p className="text-sm font-medium text-emerald-700">
              {items.length} item{items.length > 1 ? "s" : ""} ready to go
            </p>
          )}
        </div>

        {!isAuthenticated ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
              <ShoppingBag className="size-12 text-slate-300" />
              <div>
                <p className="text-lg font-medium text-slate-800">Sign in to view your cart</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your saved items will appear here after you sign in.
                </p>
              </div>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link to="/signin">Sign in</Link>
              </Button>
            </CardContent>
          </Card>
        ) : loading ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-xl border bg-slate-100" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
              <ShoppingBag className="size-12 text-slate-300" />
              <div>
                <p className="text-lg font-medium text-slate-800">Your cart is empty</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Browse the shop and add products you love.
                </p>
              </div>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link to="/shop">Continue shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden border-slate-200/80 shadow-sm">
                  <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                    <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                      {item.images?.[0] ? (
                        <img src={item.images[0]} alt={item.name} className="size-full object-cover" />
                      ) : (
                        <ShoppingBag className="size-8 text-slate-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-slate-900">{item.name}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {formatCurrency(item.price)} each
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-red-500"
                          onClick={() => void removeItem(item.id, item.name)}
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-full"
                            onClick={() => void updateQuantity(item.id, item.quantity - 1, item.name)}
                            aria-label={`Decrease quantity for ${item.name}`}
                          >
                            <Minus className="size-4" />
                          </Button>
                          <span className="min-w-8 text-center text-sm font-semibold text-slate-900">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-full"
                            onClick={() => void updateQuantity(item.id, item.quantity + 1, item.name)}
                            aria-label={`Increase quantity for ${item.name}`}
                          >
                            <Plus className="size-4" />
                          </Button>
                        </div>
                        <p className="text-lg font-bold text-slate-950">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              <Card className="border-emerald-100 bg-emerald-50/70">
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <Sparkles className="size-4" />
                    <p className="text-sm font-semibold">Free shipping over $100</p>
                  </div>
                  {freeShippingTarget > 0 ? (
                    <p className="text-sm text-emerald-700">
                      Add {formatCurrency(freeShippingTarget)} more to unlock free delivery.
                    </p>
                  ) : (
                    <p className="text-sm text-emerald-700">You’ve unlocked free shipping.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      {shippingFee === 0 ? "Free" : formatCurrency(shippingFee)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-emerald-700">
                      {formatCurrency(totalAmount + shippingFee)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                    <Truck className="size-4 text-emerald-600" />
                    Delivery is estimated to arrive in 2–4 business days.
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button asChild variant="outline" className="flex-1">
                      <Link to="/shop">Continue shopping</Link>
                    </Button>
                    <Button
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      disabled={checkoutDisabled}
                      onClick={() => toast.info("Checkout is coming soon", { description: "We’ll unlock this experience next." })}
                    >
                      Checkout
                    </Button>
                  </div>
                  <div className="space-y-2 pt-2">
                    <Button variant="ghost" size="sm" onClick={() => void clearCart()} className="w-full justify-start text-muted-foreground">
                      <Trash2 className="mr-2 size-4" />
                      Clear cart
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => void refreshCart()}
                      className="w-full justify-start text-muted-foreground"
                    >
                      <Trash2 className="mr-2 size-4" />
                      Refresh cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
