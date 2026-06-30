import React from "react";
import { FlatList } from "react-native";
import { useResponsive } from "../../../shared/hooks/useResponsive";
import { Product } from "../../../types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  refreshing?: boolean;
  onRefresh?: () => void;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
}

export const ProductGrid = ({
  products,
  ListHeaderComponent,
  refreshing = false,
  onRefresh,
  ListEmptyComponent,
}: ProductGridProps) => {
  const { numColumns } = useResponsive();

  return (
    <FlatList
      key={numColumns} // Forces re-render when changing orientation or tablet state
      data={products}
      numColumns={numColumns}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <ProductCard product={item} />}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      refreshing={refreshing}
      onRefresh={onRefresh}
      contentContainerStyle={{ padding: 8, paddingBottom: 24 }}
      // columnWrapperStyle={numColumns > 1 ? { justifyContent: "flex-start" } : undefined}
    />
  );
};
