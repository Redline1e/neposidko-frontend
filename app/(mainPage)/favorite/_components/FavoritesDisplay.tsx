"use client";

import React, { useEffect, useState, useCallback } from "react";
import ProductItem from "@/app/(mainPage)/(productsPage)/products/_components/ProductItem";
import { Product } from "@/utils/types";
import {
  fetchFavorites,
  fetchProductsByArticleNumbers,
} from "@/lib/api/favorites-service";
import { Loader2, AlertCircle } from "lucide-react";
import { getToken } from "@/lib/hooks/getToken";

export const FavoriteDisplay: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (token) {
        // Для авторизованих користувачів
        const data = await fetchFavorites();
        setProducts(data);
      } else {
        // Для неавторизованих користувачів
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        if (favorites.length > 0) {
          const productsData = await fetchProductsByArticleNumbers(favorites);
          setProducts(productsData);
        } else {
          setProducts([]);
        }
      }
      setError(null);
    } catch (err) {
      console.error("Помилка отримання улюблених товарів:", err);
      setError("У вас ще немає улюблених товарів");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getFavorites();
  }, [getFavorites]);

  if (loading) {
    return (
      <p className="flex justify-center items-center animate-spin py-20">
        <Loader2 size={32} />
      </p>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <AlertCircle size={44} className="text-gray-900 mb-4" />
        <p className="text-center text-2xl font-semibold text-gray-900">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-center mb-4">
        Улюблені товари
      </h1>
      {products.length === 0 ? (
        <p className="text-center text-md text-gray-600">
          У вас немає улюблених товарів
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductItem
              key={product.articleNumber}
              product={product}
              isFavoriteView={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};
