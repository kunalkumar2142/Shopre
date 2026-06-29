import { Link } from "react-router-dom";
import { Package, ShoppingCart, User } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formatUserDisplayName } from "@/lib/auth-utils";

const Dashboard = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { itemCount } = useCart();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight">My profile</h1>
        <p className="mt-1 text-muted-foreground">
          {isAuthenticated && currentUser
            ? `Signed in as ${formatUserDisplayName(currentUser.name, currentUser.email)}`
            : "Sign in to manage your Shopre account."}
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="size-5 text-emerald-600" />
                Orders
              </CardTitle>
              <CardDescription>View and track your recent purchases</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild>
                <Link to="/orders">Go to orders</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingCart className="size-5 text-emerald-600" />
                Cart
              </CardTitle>
              <CardDescription>
                {itemCount === 0
                  ? "Your cart is empty"
                  : `${itemCount} item${itemCount === 1 ? "" : "s"} waiting in your cart`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild>
                <Link to="/cart">View cart</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="size-5 text-emerald-600" />
                Account
              </CardTitle>
              <CardDescription>Update password, addresses, and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" disabled>
                Edit profile (coming soon)
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
