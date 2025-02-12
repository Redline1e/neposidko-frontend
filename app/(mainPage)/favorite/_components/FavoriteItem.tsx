import { Product } from "@/utils/api";
import React from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SizeInfo {
  size: string;
  stock: number;
}

interface ProductItemProps {
  product: Product & { sizes?: SizeInfo[] };
}

const FavoriteItem: React.FC<ProductItemProps> = ({ product }) => {
  const {
    articleNumber,
    price,
    discount,
    description,
    imageUrls, // now an array of image URLs
    sizes = [],
  } = product;

  const discountedPrice = discount
    ? Math.round(price * (1 - discount / 100))
    : price;

  // Choose the first image URL or fallback image
  const imageSrc =
    imageUrls && imageUrls.length > 0 ? imageUrls[0] : "/fallback.jpg";

  return (
    <Link href={`/product/${articleNumber}`} passHref className="block">
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border">
        <div className="relative">
          <img
            src={imageSrc}
            alt={description}
            className="w-full h-60 object-cover rounded-t-lg"
          />
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{discount}%
            </div>
          )}
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute top-1 right-2 bg-white rounded-full shadow-md"
            variant="ghost"
            size="sm"
          >
            <Heart className="text-red-500" />
          </Button>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 truncate">
            {description}
          </h2>
          <div className="mt-2 flex items-center space-x-2">
            {discount > 0 && (
              <span className="text-gray-400 line-through text-sm">
                {price} ₴
              </span>
            )}
            <span className="text-red-500 font-semibold text-lg">
              {discountedPrice} ₴
            </span>
          </div>

          {sizes.length > 0 && (
            <div className="mt-3">
              <span className="text-gray-800 font-semibold">
                {sizes
                  .slice(0, 2)
                  .map((sizeObj) => sizeObj.size)
                  .join(", ")}
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

export default FavoriteItem;
