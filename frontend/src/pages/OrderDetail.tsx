import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CreditCard, MapPin, Package, Phone, ShoppingBag } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getApiErrorMessage, getOrderById } from "@/apis/apis";
import {
  countOrderItems,
  formatCurrency,
  formatOrderDateTime,
  formatPaymentMethod,
} from "@/lib/order-utils";
import type { Order } from "@/types/order";

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrder = useCallback(async () => {
    if (!id) {
      setError("Order not found.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await getOrderById(id);
      setOrder(response.data);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError, "Could not load this order."));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadOrder();
  }, [loadOrder]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/orders"
          className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-slate-900"
        >
          <ArrowLeft className="size-4" />
          Back to orders
        </Link>

        {loading ? (
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="h-96 animate-pulse rounded-xl border bg-slate-100" />
            <div className="h-96 animate-pulse rounded-xl border bg-slate-100" />
          </div>
        ) : error || !order ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
              <Package className="size-12 text-slate-300" />
              <div>
                <p className="text-lg font-medium text-slate-800">Could not load order</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {error ?? "Order not found."}
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => void loadOrder()} className="bg-emerald-600 hover:bg-emerald-700">
                  Try again
                </Button>
                <Button asChild variant="outline">
                  <Link to="/orders">Back to orders</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  {order.orderNumber}
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Placed {formatOrderDateTime(order.createdAt)} · {countOrderItems(order)} item
                  {countOrderItems(order) === 1 ? "" : "s"}
                </p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ShoppingBag className="size-5 text-emerald-600" />
                    Items
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-4 rounded-lg border border-slate-200/80 p-3"
                    >
                      <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="size-full object-cover" />
                        ) : (
                          <ShoppingBag className="size-6 text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/product/${item.slug || item.productId}`}
                          className="block truncate font-medium text-slate-900 hover:text-emerald-700"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-slate-900">
                        {formatCurrency(item.subtotal)}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin className="size-5 text-emerald-600" />
                      Delivery
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Shipping address
                      </p>
                      <p className="mt-1 text-slate-800">{order.shippingAddress}</p>
                    </div>
                    <div className="flex items-center gap-2 text-slate-800">
                      <Phone className="size-4 text-emerald-600" />
                      {order.phone}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <CreditCard className="size-5 text-emerald-600" />
                      Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Method</span>
                      <span className="font-medium text-slate-800">
                        {formatPaymentMethod(order.paymentMethod)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-2xl font-bold text-emerald-700">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Shipping is not included in the order total.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default OrderDetail;
