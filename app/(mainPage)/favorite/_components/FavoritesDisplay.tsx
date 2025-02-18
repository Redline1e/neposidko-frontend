"use client";
import { useEffect, useState } from "react";
import ProductItem from "@/app/(mainPage)/(productsPage)/products/_components/ProductItem";
import { Product } from "@/utils/api";
import { fetchFavorites } from "@/lib/favorites-service";
import { Loader2, AlertCircle } from "lucide-react";

export const FavoriteDisplay = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getFavorites = async () => {
    setLoading(true);
    try {
      const data = await fetchFavorites();
      setProducts(data);
      setError(null);
    } catch (error) {
      setError("У вас ще немає улюблених товарів");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFavorites();
  }, []);

  const removeFavorite = (articleNumber: string) => {
    setProducts((prev) =>
      prev.filter((p) => p.articleNumber !== articleNumber)
    );
  };

  if (loading)
    return (
      <p className="flex justify-center items-center animate-spin py-20">
        <Loader2 size={32} />
      </p>
    );

  if (error)
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <AlertCircle size={44} className="text-gray-900 mb-4" />
        <p className="text-center text-2xl font-semibold text-gray-900">
          {error}
        </p>
      </div>
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
            <ProductItem
              key={product.articleNumber}
              product={product}
            />
          ))
        )}
      </div>
    </div>
  );
};
