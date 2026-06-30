import { useEffect, useState, useCallback } from "react";
import { apiClient } from "../../../shared/api/apiClient";
import { Product } from "../../../types";

export const useProduct = (id: string | number | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(() => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    apiClient
      .get<Product>(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.error(`Fetch product ${id} error:`, err);
        setError("Không thể tải thông tin chi tiết sản phẩm.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, isLoading, error, refetch: fetchProduct };
};
