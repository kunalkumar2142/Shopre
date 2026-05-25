import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import {
  formatUserDisplayName,
  getEmailFromToken,
  getInitialsFromEmail,
  getInitialsFromName,
} from "@/lib/auth-utils";
import { LogOut, Package, ShoppingCart, User } from "lucide-react";
import { toast } from "sonner";

const UserMenu = () => {
  const { UserSession, currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const email =
    currentUser?.email ??
    (UserSession ? getEmailFromToken(UserSession.token) : null);
  const displayName = formatUserDisplayName(currentUser?.name, email);
  const initials = currentUser?.name
    ? getInitialsFromName(currentUser.name)
    : email
      ? getInitialsFromEmail(email)
      : "SR";

  const handleEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 200);
  };

  const handleLogout = () => {
    logout();
    toast.success("Signed out", { description: "See you again soon on Shopre." });
    navigate("/");
  };

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="rounded-full ring-2 ring-transparent transition hover:ring-emerald-200 focus-visible:outline-none focus-visible:ring-emerald-400"
            aria-label="Account menu"
          >
            <Avatar className="size-9 cursor-pointer">
              <AvatarFallback className="bg-emerald-600 text-sm font-semibold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-52"
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          <DropdownMenuLabel className="font-normal">
            <p className="text-sm font-medium">{displayName}</p>
            {email && (
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/orders" className="cursor-pointer">
              <Package className="mr-2 size-4" />
              Orders
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/cart" className="cursor-pointer">
              <ShoppingCart className="mr-2 size-4" />
              Cart
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/dashboard" className="cursor-pointer">
              <User className="mr-2 size-4" />
              My Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 size-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
