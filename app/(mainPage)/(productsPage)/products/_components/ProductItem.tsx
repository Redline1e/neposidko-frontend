"use client";

import React, { useState, useEffect } from "react";
import { Heart, ShoppingCart, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  addToFavorites,
  removeFromFavorites,
  fetchFavorites,
} from "@/lib/api/favorites-service";
import { addOrderItem } from "@/lib/api/order-items-service";
import { Product, OrderItem } from "@/utils/types";
import { toast } from "sonner";

interface SizeInfo {
  size: string;
  stock: number;
}

export interface ProductItemProps {
  product: Product & { sizes?: SizeInfo[]; categoryId?: number };
  isFavoriteView?: boolean;
}

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  isFavoriteView = false,
}) => {
  const {
    articleNumber,
    price,
    discount,
    name,
    imageUrls,
    sizes = [],
  } = product;
  const discountedPrice = discount
    ? Math.round(price * (1 - discount / 100))
    : price;
  const imageSrc = imageUrls?.length > 0 ? imageUrls[0] : "/fallback.jpg";
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  // Сортуємо розміри за зростанням
  const sortedSizes = [...sizes].sort((a, b) => a.size.localeCompare(b.size));

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const favorites = await fetchFavorites();
        setIsFavorite(
          favorites.some((fav) => fav.articleNumber === articleNumber)
        );
      } catch (error) {
        console.error("Помилка при перевірці улюблених:", error);
      }
    };
    checkFavoriteStatus();
  }, [articleNumber]);

  const handleToggleFavorite = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (!isFavorite) {
        await addToFavorites(articleNumber);
        setIsFavorite(true);
      } else {
        await removeFromFavorites(articleNumber);
        setIsFavorite(false);
      }
    } catch (error) {
      console.error("Не вдалося змінити статус улюбленого товару:", error);
    }
  };

  // Визначення першого доступного розміру (stock > 0)
  const availableSizeObj = sortedSizes.find((s) => s.stock > 0);
  const selectedSize = availableSizeObj
    ? availableSizeObj.size
    : sortedSizes[0]?.size || "OneSize";

  // Перевірка, чи є хоча б один доступний розмір
  const hasAvailableSizes = sortedSizes.some((s) => s.stock > 0);

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!hasAvailableSizes) {
      toast.error("Немає доступних розмірів для цього товару.");
      return;
    }

    try {
      const cartItem: OrderItem = {
        articleNumber,
        size: selectedSize,
        quantity: 1,
        orderId: 0,
        productOrderId: 0,
      };
      await addOrderItem(cartItem);
      toast.success("Товар додано до кошика!");
    } catch (error) {
      toast.error("Не вдалося додати товар до кошика");
    }
  };

  return (
    <Link href={`/product/${articleNumber}`} passHref className="block">
      <div
        className={`bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border w-full ${
          !hasAvailableSizes ? "opacity-70" : ""
        }`}
      >
        <div className="relative w-full aspect-square">
          <img
            src={imageSrc}
            alt={name}
            className="w-full h-full object-cover rounded-t-lg"
          />
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{discount}%
            </div>
          )}
          <Button
            onClick={handleToggleFavorite}
            className="absolute top-1 right-2 rounded-full shadow-md"
            variant="ghost"
            size="sm"
          >
            <Heart className={isFavorite ? "text-red-500" : "text-gray-500"} />
          </Button>
        </div>
        <div className="p-2 sm:p-4">
          <h2 className="truncate font-semibold text-gray-800 text-sm sm:text-base md:text-lg">
            {name}
          </h2>
          <div className="mt-1 sm:mt-2 flex items-center space-x-1 sm:space-x-2">
            {discount > 0 && (
              <span className="line-through text-xs sm:text-sm text-gray-400">
                {price} ₴
              </span>
            )}
            <span className="whitespace-nowrap text-red-500 font-semibold text-sm sm:text-base md:text-lg">
              {discountedPrice} ₴
            </span>
          </div>
          {sortedSizes.length > 0 ? (
            <div className="mt-1 sm:mt-3">
              <div className="flex flex-wrap gap-2">
                {sortedSizes.map((s) => (
                  <span
                    key={s.size}
                    className={`font-semibold text-xs sm:text-sm ${
                      s.stock === 0
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    }`}
                  >
                    {s.size}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-1 sm:mt-3 flex items-center text-gray-500 text-xs sm:text-sm">
              <AlertCircle className="mr-1" size={16} />
              Немає доступних розмірів
            </div>
          )}
          <div className="mt-2 sm:mt-4">
            <Button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center bg-blue-700 text-white py-1 sm:py-2 rounded-lg hover:bg-blue-600 transition duration-200 gap-1 sm:gap-2 text-xs sm:text-sm"
              disabled={!hasAvailableSizes}
            >
              <ShoppingCart size={18} /> Додати до кошика
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
