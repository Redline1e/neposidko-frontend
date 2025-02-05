import { Product } from "@/utils/api";
import React from "react";

interface ProductItemProps {
  product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const { productId, brandId, price, discount, description, imageUrl } =
    product;

  return (
    <div
      key={productId}
      className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
    >
      <img
        src={imageUrl}
        alt={description}
        className="w-full h-60 object-cover rounded-t-lg transform hover:scale-105 transition-transform duration-300"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 truncate">
          {description}
        </h2>
        <p className="text-gray-600 mt-2">Ціна: {price} грн</p>

        {discount && discount > 0 && (
          <p className="text-red-500 font-semibold mt-1">Знижка: {discount}%</p>
        )}

        <div className="mt-4">
          <button className="w-full bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200">
            Додати до корзини
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
