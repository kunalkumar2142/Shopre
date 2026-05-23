import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/">Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/dashboard">Dashboard</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-2 p-4 md:w-[250px]">
              <NavigationMenuLink asChild>
                <Link to="/categories/beauty">Beauty</Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Link to="/categories/electricity">Electricity</Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Link to="/categories/playing">Playing</Link>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/signin">SignIn</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navbar;


 