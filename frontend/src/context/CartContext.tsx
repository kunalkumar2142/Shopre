import { addToCart as addToCartApi, getApiErrorMessage, getCart } from "@/apis/apis";
import { useAuth } from "@/context/AuthContext";
import type { CartProduct } from "@/types/product";
import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

type CartContextType = {
  items: CartProduct[];
  totalAmount: number;
  itemCount: number;
  loading: boolean;
  refreshCart: () => Promise<void>;
  resetCart: () => void;
  addToCart: (productId: string, productName: string, quantity?: number) => Promise<boolean>;
  removeItem: (productId: string, productName: string) => Promise<boolean>;
  updateQuantity: (productId: string, quantity: number, productName: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
};

const CART_STORAGE_KEY = "shopre-cart-cache";

const CartContext = createContext<CartContextType | undefined>(undefined);

const readStoredCart = (): CartProduct[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as CartProduct[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const persistCart = (items: CartProduct[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartProduct[]>(() => readStoredCart());
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const applyCartState = useCallback((nextItems: CartProduct[], nextTotal?: number) => {
    setItems(nextItems);
    const computedTotal = nextItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalAmount(nextTotal ?? computedTotal);
    persistCart(nextItems);
  }, []);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      setTotalAmount(0);
      localStorage.removeItem(CART_STORAGE_KEY);
      return;
    }

    setLoading(true);
    try {
      const response = await getCart();
      const nextItems = response.data.products ?? [];
      applyCartState(nextItems, response.data.totalAmount ?? 0);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data as { message?: string } | string | undefined;
        const msg =
          typeof data === "string" ? data : data && typeof data === "object" ? data.message ?? "" : "";
        const lower = msg.toLowerCase();
        const isEmptyCartError =
          status === 400 ||
          status === 404 ||
          lower.includes("cart not found") ||
          lower.includes("productids cannot be empty");

        if (isEmptyCartError) {
          // Backend has no cart yet (cart-service throws 400/500 for new user or empty productIds).
          // Keep any locally cached items as fallback so UX is not blank,
          // otherwise treat as genuinely empty.
          const cached = readStoredCart();
          if (cached.length > 0) {
            applyCartState(cached);
          } else {
            setItems([]);
            setTotalAmount(0);
            localStorage.removeItem(CART_STORAGE_KEY);
          }
          return;
        }
      }
      const fallbackItems = readStoredCart();
      if (fallbackItems.length > 0) {
        applyCartState(fallbackItems);
      }
    } finally {
      setLoading(false);
    }
  }, [applyCartState, isAuthenticated]);

  useEffect(() => {
    void refreshCart();
  }, [refreshCart]);

  const resetCart = useCallback(() => {
    setItems([]);
    setTotalAmount(0);
    localStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  const addToCart = useCallback(
    async (productId: string, productName: string, quantity = 1): Promise<boolean> => {
      if (!isAuthenticated) {
        toast.error("Sign in required", {
          description: "Please sign in to add items to your cart.",
        });
        return false;
      }

      try {
        await addToCartApi({ productId, quantity });
        toast.success(`${productName} added to cart!`);
        await refreshCart();
        return true;
      } catch (error) {
        toast.error("Could not add to cart", {
          description: getApiErrorMessage(error, "Please try again."),
        });
        return false;
      }
    },
    [isAuthenticated, refreshCart]
  );

  const removeItem = useCallback(
    async (productId: string, productName: string): Promise<boolean> => {
      if (!isAuthenticated) {
        toast.error("Sign in required", {
          description: "Please sign in to manage your cart.",
        });
        return false;
      }

      const nextItems = items.filter((item) => item.id !== productId);
      applyCartState(nextItems);
      toast.success(`${productName} removed from cart.`, {
        description: "Saved locally — backend cart update not yet available.",
      });
      return true;
    },
    [applyCartState, isAuthenticated, items]
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number, productName: string): Promise<boolean> => {
      if (!isAuthenticated) {
        toast.error("Sign in required", {
          description: "Please sign in to manage your cart.",
        });
        return false;
      }

      const normalizedQuantity = Math.max(0, quantity);
      const nextItems = items
        .map((item) => (item.id === productId ? { ...item, quantity: normalizedQuantity } : item))
        .filter((item) => item.quantity > 0);

      applyCartState(nextItems);

      if (normalizedQuantity === 0) {
        toast.success(`${productName} removed from cart.`, {
          description: "Saved locally — backend cart update not yet available.",
        });
      } else {
        toast.success(`${productName} quantity updated.`, {
          description: "Saved locally — backend sync on next add.",
        });
      }

      return true;
    },
    [applyCartState, isAuthenticated, items]
  );

  const clearCart = useCallback(async (): Promise<boolean> => {
    if (!isAuthenticated) {
      toast.error("Sign in required", {
        description: "Please sign in to manage your cart.",
      });
      return false;
    }

    applyCartState([]);
    toast.success("Cart cleared.", {
      description: "Saved locally — backend clear not yet available.",
    });
    return true;
  }, [applyCartState, isAuthenticated]);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      totalAmount,
      itemCount,
      loading,
      refreshCart,
      resetCart,
      addToCart,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [items, totalAmount, itemCount, loading, refreshCart, resetCart, addToCart, removeItem, updateQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
