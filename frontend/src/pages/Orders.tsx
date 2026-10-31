import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Package, RefreshCw } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getApiErrorMessage, getOrders } from "@/apis/apis";
import { countOrderItems, formatCurrency, formatOrderDate } from "@/lib/order-utils";
import type { Order } from "@/types/order";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getOrders();
      const sorted = [...(response.data ?? [])].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sorted);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError, "Could not load your orders."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              to="/dashboard"
              className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-slate-900"
            >
              <ArrowLeft className="size-4" />
              Back to profile
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">My orders</h1>
            <p className="mt-2 text-muted-foreground">
              Track your purchases and review what you have ordered.
            </p>
          </div>
          <Button variant="outline" onClick={() => void loadOrders()} disabled={loading}>
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-32 animate-pulse rounded-xl border bg-slate-100" />
            ))}
          </div>
        ) : error ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
              <Package className="size-12 text-slate-300" />
              <div>
                <p className="text-lg font-medium text-slate-800">Could not load orders</p>
                <p className="mt-1 text-sm text-muted-foreground">{error}</p>
              </div>
              <Button onClick={() => void loadOrders()} className="bg-emerald-600 hover:bg-emerald-700">
                Try again
              </Button>
            </CardContent>
          </Card>
        ) : orders.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
              <Package className="size-12 text-slate-300" />
              <div>
                <p className="text-lg font-medium text-slate-800">No orders yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Once you check out, your orders will show up here.
                </p>
              </div>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link to="/shop">Start shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="border-slate-200/80 shadow-sm">
                <CardContent className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-900">{order.orderNumber}</p>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Placed {formatOrderDate(order.createdAt)} · {countOrderItems(order)} item
                      {countOrderItems(order) === 1 ? "" : "s"}
                    </p>
                    <p className="truncate text-sm text-slate-600">
                      {order.items.map((item) => item.name).join(", ")}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-4 lg:flex-col lg:items-end">
                    <p className="text-xl font-bold text-emerald-700">
                      {formatCurrency(order.totalAmount)}
                    </p>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/orders/${order.id}`}>View details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Orders;
