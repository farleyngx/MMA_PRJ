import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../../../shared/api/apiClient";
import { Product } from "../../../types";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(() => {
    setIsLoading(true);
    setError(null);
    apiClient
      .get<Product[]>("/products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Fetch products error:", err);
        setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, isLoading, error, refetch: fetchProducts };
};
