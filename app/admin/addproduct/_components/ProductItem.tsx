"use client";
import { Product } from "@/utils/api";
import Link from "next/link";
import React from "react";

interface ProductItemProps {
  product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  // Деструктуризуємо дані продукту; замість productId використовується articleNumber
  const {
    articleNumber,
    name, // нове поле
    price,
    discount,
    description,
    imageUrls, // тепер це масив URL зображень
    sizes = [],
  } = product;

  // Беремо перший елемент масиву для відображення зображення
  const imageSrc =
    imageUrls && imageUrls.length > 0 ? imageUrls[0] : "/fallback.jpg"; // можна додати fallback

  const discountedPrice = discount
    ? Math.round(price * (1 - discount / 100))
    : price;

  return (
    <Link href={`/product/${articleNumber}`}  className="block">
      <div
        key={articleNumber}
        className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border"
      >
        <div className="relative">
          <img
            src={imageSrc}
            alt={name}
            className="w-full h-60 object-cover rounded-t-lg transform hover:scale-105 transition-transform duration-300"
          />
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{discount}%
            </div>
          )}
        </div>
        <div className="p-4">
          {/* Відображення назви товару */}
          <h2 className="text-lg font-semibold text-gray-800 truncate">
            {name}
          </h2>
          {/* Відображення опису товару */}
          <p className="text-sm text-gray-600 truncate mb-2">{description}</p>
          <div className="mt-2 flex items-center space-x-2">
            {discount > 0 && (
              <span className="text-gray-400 line-through text-sm">
                {price} грн
              </span>
            )}
            <span className="text-red-500 font-semibold text-lg">
              {discountedPrice} грн
            </span>
          </div>

          {/* Відображення доступних розмірів */}
          {sizes.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-2 mt-2">
                {sizes.map((sizeObj, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 border rounded-lg text-sm bg-gray-100"
                  >
                    {sizeObj.size} ({sizeObj.stock} шт.)
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
