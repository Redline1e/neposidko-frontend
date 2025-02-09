import { Product } from "@/utils/api";
import React from "react";

interface ProductItemProps {
  product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const { productId, price, discount, description, imageUrl, sizes = [] } = product;

  const discountedPrice = discount
    ? Math.round(price * (1 - discount / 100))
    : price;

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

        {/* Display all sizes as static labels with wrapping */}
        {sizes.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-2 mt-2">
              {sizes.map((size) => (
                <span
                  key={size}
                  className="px-2 py-1 border rounded-lg text-sm bg-gray-100"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductItem;
