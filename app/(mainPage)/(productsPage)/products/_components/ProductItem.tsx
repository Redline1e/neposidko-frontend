"use client";

import { useEffect, useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  addToFavorites,
  removeFromFavorites,
  fetchFavorites,
} from "@/lib/api/favorites-service";
import { Product } from "@/utils/types";

interface SizeInfo {
  size: string;
  stock: number;
}

interface ProductItemProps {
  product: Product & { sizes?: SizeInfo[]; categoryId?: number };
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const { articleNumber, price, discount, name, imageUrls, sizes = [] } = product;
  const discountedPrice = discount
    ? Math.round(price * (1 - discount / 100))
    : price;
  const imageSrc = imageUrls && imageUrls.length > 0 ? imageUrls[0] : "/fallback.jpg";
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const favorites = await fetchFavorites();
        setIsFavorite(favorites.some((fav) => fav.articleNumber === articleNumber));
      } catch (error) {
        console.error("Помилка при перевірці улюблених:", error);
      }
    };

    checkFavoriteStatus();
  }, [articleNumber]);

  const handleToggleFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isFavorite) {
      try {
        await addToFavorites(articleNumber);
        setIsFavorite(true);
      } catch (error) {
        console.error("Не вдалося додати в улюблені:", error);
      }
    } else {
      try {
        await removeFromFavorites(articleNumber);
        setIsFavorite(false);
      } catch (error) {
        console.error("Не вдалося видалити з улюблених:", error);
      }
    }
  };

  return (
    <Link href={`/product/${articleNumber}`} passHref className="block">
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border w-64">
        <div className="relative w-64 h-64">
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
            className={`absolute top-1 right-2 rounded-full shadow-md ${
              isFavorite ? "bg-red-500 hover:bg-red-500/80" : ""
            }`}
            variant="ghost"
            size="sm"
          >
            <Heart className={isFavorite ? "text-white" : "text-red-500"} />
          </Button>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 truncate">{name}</h2>
          <div className="mt-2 flex items-center space-x-2">
            {discount > 0 && (
              <span className="text-gray-400 line-through text-sm">{price} ₴</span>
            )}
            <span className="text-red-500 font-semibold text-lg whitespace-nowrap">
              {discountedPrice} ₴
            </span>
          </div>
          {sizes.length > 0 && (
            <div className="mt-3">
              <span className="text-gray-800 font-semibold whitespace-nowrap">
                {sizes.slice(0, 2).map((sizeObj) => sizeObj.size).join(", ")}
                {sizes.length > 2 && "..."}
              </span>
            </div>
          )}
          <div className="mt-4">
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="w-full flex items-center justify-center bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 gap-2"
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
