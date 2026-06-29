import { Link } from "react-router-dom";
import { Search, ShoppingBag, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import UserMenu from "@/components/layout/UserMenu";
import { categories } from "@/data/home-data";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Deals", to: "/deals" },
  { label: "New Arrivals", to: "/new" },
];

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="shrink-0 text-2xl font-bold tracking-tight text-emerald-700"
        >
          shopre
        </Link>

        <NavigationMenu className="hidden max-w-none flex-1 justify-center lg:flex">
          <NavigationMenuList>
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.to}>
                <NavigationMenuLink asChild>
                  <Link
                    to={link.to}
                    className={cn(navigationMenuTriggerStyle(), "bg-transparent")}
                  >
                    {link.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[320px] gap-1 p-3 sm:grid-cols-2">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <NavigationMenuLink asChild>
                        <Link
                          to={`/categories/${cat.slug}`}
                          className="block rounded-md p-2 text-sm hover:bg-accent"
                        >
                          <span className="font-medium">{cat.name}</span>
                          <span className="block text-xs text-muted-foreground">
                            {cat.itemCount} items
                          </span>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon" aria-label="Search" asChild>
            <Link to="/search">
              <Search className="size-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="relative" aria-label="Cart" asChild>
            <Link to="/cart">
              <ShoppingBag className="size-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 size-5 justify-center rounded-full bg-emerald-600 p-0 text-[10px]">
                  {itemCount > 9 ? "9+" : itemCount}
                </Badge>
              )}
            </Link>
          </Button>
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              <Link to="/signin">Sign in</Link>
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto border-t px-4 py-2 lg:hidden">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="shrink-0 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground hover:border-emerald-300 hover:text-emerald-700"
          >
            {link.label}
          </Link>
        ))}
        <Link
          to="/deals"
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800"
        >
          <Tag className="size-3" />
          Deals
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
