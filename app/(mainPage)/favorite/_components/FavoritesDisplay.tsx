"use client";
import { useEffect, useState } from "react";
import ProductItem from "./FavoriteItem";
import { Product } from "@/utils/api";
import { fetchFavorites } from "@/lib/favorites-service";

export const FavoriteDisplay = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getFavorites = async () => {
    setLoading(true);
    try {
      const data = await fetchFavorites(); // Fetch only the favorite products
      setProducts(data);
      setError(null);
    } catch (error) {
      setError("Не вдалося завантажити улюблені товари");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFavorites(); // Get the favorites when the component loads
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
        {products.length === 0 ? (
          <p className="col-span-full text-center">
            У вас немає улюблених товарів
          </p>
        ) : (
          products.map((product) => (
            <ProductItem key={product.articleNumber} product={product} />
          ))
        )}
      </div>
    </div>
  );
};
