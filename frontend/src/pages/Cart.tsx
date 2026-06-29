import { Link } from "react-router-dom";
import { ShoppingBag, Trash2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const Cart = () => {
  const { isAuthenticated } = useAuth();
  const { items, totalAmount, loading, refreshCart } = useCart();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Your cart</h1>
          <p className="mt-2 text-muted-foreground">
            Review items before checkout.
          </p>
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
          <div className="space-y-6">
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                    <div className="size-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <img
                        src={item.images?.[0] ?? ""}
                        alt={item.name}
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-slate-900">{item.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                      <p className="mt-2 text-lg font-bold text-slate-950">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${totalAmount.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-emerald-700">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button asChild variant="outline" className="flex-1">
                    <Link to="/shop">Continue shopping</Link>
                  </Button>
                  <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" disabled>
                    Checkout (coming soon)
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refreshCart}
                  className="w-full text-muted-foreground"
                >
                  <Trash2 className="mr-2 size-4" />
                  Refresh cart
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
