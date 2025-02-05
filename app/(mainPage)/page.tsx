"use client";
import { useEffect, useState } from "react";
import ProductItem from "./_components/ProductItem";
import { fetchProducts, Product } from "@/utils/api"; // Adjust import as needed

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // For loading state
  const [error, setError] = useState<string | null>(null); // For error state

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        setError("Не вдалося завантажити товари");
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  if (loading) return <p className="text-center text-xl font-semibold">Завантаження...</p>;
  if (error) return <p className="text-center text-xl font-semibold text-red-500">{error}</p>;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductItem key={product.productId} product={product} />
        ))}
      </div>
    </div>
  );
}
