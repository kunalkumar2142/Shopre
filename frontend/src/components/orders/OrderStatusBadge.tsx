import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/types/order";

const statusStyles: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-sky-100 text-sky-800",
  SHIPPED: "bg-violet-100 text-violet-800",
  DELIVERED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-rose-100 text-rose-800",
};

const formatStatus = (status: OrderStatus): string =>
  status.charAt(0) + status.slice(1).toLowerCase();

const OrderStatusBadge = ({ status }: { status: OrderStatus }) => (
  <Badge
    variant="outline"
    className={`border-transparent ${statusStyles[status] ?? "bg-slate-100 text-slate-700"}`}
  >
    {formatStatus(status)}
  </Badge>
);

export default OrderStatusBadge;
