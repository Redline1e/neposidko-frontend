"use client";
import { useEffect, useState } from "react";
import ProductItem from "./ProductItem";
import { Product } from "@/utils/api";
import { fetchProducts } from "@/lib/product-service";

export const ProductDisplay = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
      setError(null);
    } catch (error) {
      setError("Не вдалося завантажити товари");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  if (loading)
    return <p className="text-center text-xl font-semibold">Завантаження...</p>;
  if (error)
    return (
      <p className="text-center text-xl font-semibold text-red-500">{error}</p>
    );

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductItem key={product.articleNumber} product={product} />
        ))}
      </div>
    </div>
  );
};
