import { getProducts, parseProductsResponse } from "@/apis/apis";
import { mapApiToDisplay } from "@/lib/product-utils";
import type { DisplayProduct } from "@/types/product";
import { useCallback, useEffect, useState } from "react";

type UseProductsResult = {
  products: DisplayProduct[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProducts();
      const apiProducts = parseProductsResponse(response.data);
      setProducts(apiProducts.map(mapApiToDisplay));
    } catch {
      setProducts([]);
      setError("Could not load products. Make sure the API gateway is running on port 8081.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { products, loading, error, refresh };
}
