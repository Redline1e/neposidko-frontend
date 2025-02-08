import { Product } from "@/utils/api";
import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";

interface ProductItemProps {
  product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const {
    productId,
    price,
    discount,
    description,
    imageUrl,
    sizes = [],
  } = product;

  const discountedPrice = discount
    ? Math.round(price * (1 - discount / 100))
    : price;
  const [selectedSize, setSelectedSize] = useState<string | null>(
    sizes.length ? sizes[0] : null
  );

  // Логіка для обмеження відображення розмірів
  const displayedSizes = sizes.length > 4 ? sizes.slice(0, 4) : sizes;

  return (
    <div
      key={productId}
      className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border"
    >
      <div className="relative">
        <img
          src={imageUrl}
          alt={description}
          className="w-full h-60 object-cover rounded-t-lg transform hover:scale-105 transition-transform duration-300"
        />
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </div>
        )}
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 truncate">
          {description}
        </h2>
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

        {/* Вибір розміру */}
        {sizes.length > 0 && (
          <div className="mt-3">
            <div className="flex space-x-2 mt-2">
              {displayedSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 border rounded-lg ${
                    selectedSize === size
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100"
                  } transition-all`}
                >
                  {size}
                </button>
              ))}

              {/* Якщо є більше 4 розмірів, додаємо 3 крапки */}
              {sizes.length > 4 && <p className="flex items-end">...</p>}
            </div>
          </div>
        )}

        <div className="mt-4">
          <button
            className="w-full flex items-center justify-center bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 gap-2"
            disabled={!selectedSize}
          >
            <ShoppingCart size={18} /> Додати до кошика
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
