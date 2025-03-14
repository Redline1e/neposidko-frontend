"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductImageGallery } from "./ProductImageGallery";
import { ProductDetails } from "./ProductDetails";
import { CommentsSection } from "./CommentsSection";
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
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
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
      } catch (err) {
        setError("Не вдалося завантажити товар");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [articleNumber]);

  // Перевірка, чи є товар в обраному
  useEffect(() => {
    if (product) {
      const checkFavorite = async () => {
        try {
          const favorites = await fetchFavorites();
          const isFav = favorites.some(
            (fav) => fav.articleNumber === product.articleNumber
          );
          setIsFavorite(isFav);
        } catch (error) {
          console.error("Помилка при перевірці обраного:", error);
        }
      };
      checkFavorite();
    }
  }, [product]);

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const handleAddToCart = async () => {
    if (!selectedSize || !product) {
      toast.error("Будь ласка, виберіть розмір перед додаванням в кошик!");
      return;
    }

    try {
      const cartItem: OrderItem = {
        articleNumber: product.articleNumber,
        size: selectedSize,
        quantity: 1,
        orderId: 0, // Added missing property
        productOrderId: 0, // Added missing property
      };

      await addOrderItem(cartItem);
      toast.success("Товар додано до кошика!");
    } catch (error) {
      toast.error("Не вдалося додати товар до кошика");
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
    } catch (error) {
      toast.error("Не вдалося оновити обране");
    }
  };

  if (loading)
    return (
      <p className="text-center py-10">
        <Loader2 className="animate-spin h-8 w-8 mx-auto" />
      </p>
    );
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;
  if (!product) return <p className="text-center py-10">Товар не знайдено</p>;

  return (
    <div className="container mx-auto p-4 mt-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-[50px]">
        <ProductImageGallery images={product.imageUrls} />
        <ProductDetails
          articleNumber={product.articleNumber}
          title={product.name}
          description={product.description}
          price={product.price}
          discount={product.discount}
          sizes={product.sizes.map((s) => s.size)}
          onAddToCart={handleAddToCart}
          onSizeSelect={handleSizeSelect}
          onToggleWishlist={handleToggleWishlist}
          isFavorite={isFavorite}
        />
      </div>
      <CommentsSection articleNumber={product.articleNumber} />
    </div>
  );
};
