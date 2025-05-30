"use client";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/utils/types";
import {
  fetchProducts,
  deleteProduct,
  updateProductActiveStatus,
} from "@/lib/api/product-service";
import { ProductItem } from "./ProductItem";
import { Loader2 } from "lucide-react";

export const ProductDisplay = () => {
  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  if (isLoading)
    return <Loader2 className="animate-spin h-10 w-10" />;
  if (error)
    return (
      <p className="text-center text-xl font-semibold text-red-500">
        {error.message}
      </p>
    );

  const handleDelete = async (product: Product) => {
    try {
      await deleteProduct(product.articleNumber);
      refetch(); // Оновлюємо список продуктів після видалення
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleStatusChange = async (product: Product) => {
    try {
      await updateProductActiveStatus(product.articleNumber, !product.isActive);
      refetch(); // Оновлюємо список продуктів після зміни статусу
    } catch (error) {
      console.error("Error updating product status:", error);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products &&
          products.map((product) => (
            <ProductItem
              key={product.articleNumber}
              product={product}
              onDelete={() => handleDelete(product)}
              onStatusChange={() => handleStatusChange(product)}
            />
          ))}
      </div>
    </div>
  );
};
