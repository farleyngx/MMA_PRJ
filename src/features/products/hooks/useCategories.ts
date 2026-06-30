import { useEffect, useState, useCallback } from "react";
import { apiClient } from "../../../shared/api/apiClient";

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(() => {
    setIsLoading(true);
    setError(null);
    apiClient
      .get<string[]>("/products/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => {
        console.error("Fetch categories error:", err);
        setError("Không thể tải danh mục sản phẩm");
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, isLoading, error, refetch: fetchCategories };
};
