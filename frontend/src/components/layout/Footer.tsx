import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const Footer = () => (
  <footer className="mt-auto border-t bg-slate-50">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="text-xl font-bold tracking-tight text-emerald-700">
            shopre
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Your everyday marketplace for fashion, tech, beauty, and home essentials.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/categories/fashion" className="hover:text-foreground">Fashion</Link></li>
            <li><Link to="/categories/electronics" className="hover:text-foreground">Electronics</Link></li>
            <li><Link to="/deals" className="hover:text-foreground">Deals</Link></li>
            <li><Link to="/new" className="hover:text-foreground">New arrivals</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Help</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shipping" className="hover:text-foreground">Shipping</Link></li>
            <li><Link to="/returns" className="hover:text-foreground">Returns</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link to="/faq" className="hover:text-foreground">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Account</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/signin" className="hover:text-foreground">Sign in</Link></li>
            <li><Link to="/signup" className="hover:text-foreground">Create account</Link></li>
            <li><Link to="/orders" className="hover:text-foreground">Track order</Link></li>
          </ul>
        </div>
      </div>
      <Separator className="my-8" />
      <p className="text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Shopre. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
