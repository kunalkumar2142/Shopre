import { Link } from "react-router-dom";
import { ArrowLeft, Compass, ShoppingBag } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => (
  <div className="flex min-h-screen flex-col bg-slate-50">
    <Navbar />

    <main className="mx-auto flex w-full max-w-3xl flex-1 items-center px-4 py-16 sm:px-6 lg:px-8">
      <Card className="w-full border-dashed">
        <CardContent className="flex flex-col items-center gap-5 py-16 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <Compass className="size-8" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-700">404</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Page not found
            </h1>
            <p className="mt-2 text-muted-foreground">
              The page you are looking for does not exist or may have been moved.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link to="/shop">
                <ShoppingBag className="size-4" />
                Browse the shop
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/">
                <ArrowLeft className="size-4" />
                Back home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>

    <Footer />
  </div>
);

export default NotFound;
