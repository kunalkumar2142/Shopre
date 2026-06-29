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
  addToCart: (productId: string, productName: string, quantity?: number) => Promise<boolean>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartProduct[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      setTotalAmount(0);
      return;
    }

    setLoading(true);
    try {
      const response = await getCart();
      setItems(response.data.products ?? []);
      setTotalAmount(response.data.totalAmount ?? 0);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        setItems([]);
        setTotalAmount(0);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

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
      addToCart,
    }),
    [items, totalAmount, itemCount, loading, refreshCart, addToCart]
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
