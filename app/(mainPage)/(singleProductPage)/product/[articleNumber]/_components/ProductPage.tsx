// ./app/(mainPage)/(singleProductPage)/product/[articleNumber]/_components/ProductPage.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductImageGallery } from "./ProductImageGallery";
import { ProductDetails } from "./ProductDetails";
import { fetchProductByArticle } from "@/lib/api/product-service";
import { Product, OrderItem } from "@/utils/types";
import { Loader2 } from "lucide-react";
import {
  addToFavorites,
  removeFromFavorites,
  fetchFavorites,
} from "@/lib/api/favorites-service";
import { addOrderItem } from "@/lib/api/order-items-service";
import { toast } from "sonner";

export const ProductPage: React.FC = () => {
  const { articleNumber } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    if (!articleNumber) return;

    const loadProduct = async () => {
      setLoading(true);
      try {
        const data = await fetchProductByArticle(articleNumber as string);
        setProduct(data);
      } catch {
        setError("Не вдалося завантажити товар");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [articleNumber]);

  useEffect(() => {
    if (product) {
      const checkFavorite = async () => {
        try {
          const favorites = await fetchFavorites();
          const isFav = favorites.some(
            (fav) => fav.articleNumber === product.articleNumber
          );
          setIsFavorite(isFav);
        } catch {
          console.error("Помилка при перевірці обраного");
        }
      };
      checkFavorite();
    }
  }, [product]);

  const handleAddToCart = async (cartItem: OrderItem) => {
    try {
      await addOrderItem(cartItem);
      toast.success("Товар додано до кошика!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === "Вибраного розміру немає в наявності") {
          toast.error("Вибраного розміру немає в наявності.");
        } else if (error.message === "Недостатньо товару на складі") {
          toast.error("Недостатньо товару на складі для вибраного розміру.");
        } else {
          toast.error("Не вдалося додати товар до кошика.");
        }
      } else {
        toast.error("Не вдалося додати товар до кошика.");
      }
    }
  };

  const handleToggleWishlist = async () => {
    if (!product) return;
    try {
      if (!isFavorite) {
        await addToFavorites(product.articleNumber);
        setIsFavorite(true);
      } else {
        await removeFromFavorites(product.articleNumber);
        setIsFavorite(false);
      }
    } catch {
      toast.error("Не вдалося оновити обране");
    }
  };

  if (loading)
    return (
      <p className="flex justify-center items-center py-10">
        <Loader2 className="animate-spin h-10 w-10" />
      </p>
    );
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;
  if (!product) return <p className="text-center py-10">Товар не знайдено</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <ProductImageGallery images={product.imageUrls} />
        <ProductDetails
          articleNumber={product.articleNumber}
          title={product.name}
          description={product.description}
          price={product.price}
          discount={product.discount}
          sizes={product.sizes}
          onAddToCart={handleAddToCart}
          onSizeSelect={() => {}}
          onToggleWishlist={handleToggleWishlist}
          isFavorite={isFavorite}
        />
      </div>
    </div>
  );
};
