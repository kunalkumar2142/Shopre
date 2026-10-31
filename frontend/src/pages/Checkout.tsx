import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard, Loader2, MapPin, ShoppingBag } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { getApiErrorMessage, placeOrder } from "@/apis/apis";
import { formatCurrency } from "@/lib/order-utils";
import { toast } from "sonner";

const PAYMENT_OPTIONS = [
  { value: "CASH_ON_DELIVERY", label: "Cash on delivery" },
  { value: "CARD", label: "Credit / debit card" },
  { value: "UPI", label: "UPI" },
  { value: "NET_BANKING", label: "Net banking" },
];

const Checkout = () => {
  const { currentUser } = useAuth();
  const { items, totalAmount, loading, resetCart } = useCart();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState(() => currentUser?.address ?? "");
  const [phone, setPhone] = useState(() => currentUser?.phone ?? "");
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_OPTIONS[0].value);
  const [placing, setPlacing] = useState(false);

  const handlePlaceOrder = async (event?: FormEvent) => {
    event?.preventDefault();

    if (items.length === 0) {
      toast.error("Your cart is empty", {
        description: "Add a product to your cart before checking out.",
      });
      return;
    }

    if (!shippingAddress.trim() || !phone.trim()) {
      toast.warning("Missing delivery details", {
        description: "Please add a shipping address and phone number.",
      });
      return;
    }

    setPlacing(true);
    try {
      const response = await placeOrder({
        shippingAddress: shippingAddress.trim(),
        phone: phone.trim(),
        paymentMethod,
      });

      resetCart();
      toast.success("Order placed", {
        description: `Order ${response.data.orderNumber} was created successfully.`,
      });
      navigate(`/orders/${response.data.id}`);
    } catch (error) {
      toast.error("Could not place order", {
        description: getApiErrorMessage(error, "Please try again."),
      });
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Checkout</h1>
          <p className="mt-2 text-muted-foreground">
            Confirm your delivery details and place your order.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="h-80 animate-pulse rounded-xl border bg-slate-100" />
            <div className="h-80 animate-pulse rounded-xl border bg-slate-100" />
          </div>
        ) : items.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
              <ShoppingBag className="size-12 text-slate-300" />
              <div>
                <p className="text-lg font-medium text-slate-800">Nothing to check out</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your cart is empty. Add a product before placing an order.
                </p>
              </div>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link to="/shop">Continue shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="size-5 text-emerald-600" />
                    Delivery details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-5">
                    <div className="grid gap-2">
                      <Label htmlFor="shippingAddress">Shipping address</Label>
                      <textarea
                        id="shippingAddress"
                        value={shippingAddress}
                        onChange={(event) => setShippingAddress(event.target.value)}
                        placeholder="Street, city, state, ZIP / postal code"
                        rows={3}
                        required
                        className="w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        placeholder="+1 555 000 1234"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="paymentMethod">Payment method</Label>
                      <select
                        id="paymentMethod"
                        value={paymentMethod}
                        onChange={(event) => setPaymentMethod(event.target.value)}
                        className="h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm"
                      >
                        {PAYMENT_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ShoppingBag className="size-5 text-emerald-600" />
                    Order items
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 rounded-lg border border-slate-200/80 p-3"
                    >
                      <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                        {item.images?.[0] ? (
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="size-full object-cover"
                          />
                        ) : (
                          <ShoppingBag className="size-6 text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-slate-900">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-slate-900">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="lg:sticky lg:top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="size-5 text-emerald-600" />
                    Order summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Items</span>
                    <span className="font-medium">
                      {items.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatCurrency(totalAmount)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Order total</span>
                    <span className="text-2xl font-bold text-emerald-700">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Shipping is not included in the order total.
                  </p>

                  <Button
                    form="checkout-form"
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={placing}
                  >
                    {placing ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Placing order…
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="size-4" />
                        Place order
                      </>
                    )}
                  </Button>

                  <Button asChild variant="outline" className="w-full">
                    <Link to="/cart">Back to cart</Link>
                  </Button>
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

export default Checkout;
