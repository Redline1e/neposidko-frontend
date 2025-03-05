"use client";

import React from "react";
import { AdminItem } from "../../_components/AdminItem";
import { Product } from "@/utils/types";
import {
  deleteProduct,
  updateProduct,
  updateProductActiveStatus,
} from "@/lib/api/product-service";

interface ProductItemProps {
  product: Product;
  onDelete: (product: Product) => Promise<void>;
  onStatusChange: (product: Product) => Promise<void>;
}

const renderProductCard = (product: Product) => {
  const imageSrc =
    product.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls[0]
      : "/fallback.jpg";
  const discountedPrice =
    product.discount > 0
      ? Math.round(product.price * (1 - product.discount / 100))
      : product.price;

  return (
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border">
      <div className="relative">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-60 object-cover rounded-t-lg transform hover:scale-105 transition-transform duration-300"
        />
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{product.discount}%
          </div>
        )}
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 truncate">
          {product.name}
        </h2>
        <p className="text-sm text-gray-600 truncate mb-2">
          {product.description}
        </p>
        <div className="mt-2 flex items-center space-x-2">
          {product.discount > 0 && (
            <span className="text-gray-400 line-through text-sm">
              {product.price} грн
            </span>
          )}
          <span className="text-red-500 font-semibold text-lg">
            {discountedPrice} грн
          </span>
        </div>
        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-2">
            <span className="text-md text-gray-600">
              {product.sizes.map((s) => s.size).join(", ")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const renderProductEditForm = (
  product: Product,
  onChange: (changed: Partial<Product>) => void
) => {
  return (
    <div className="space-y-4">
      {/* Артикул – тільки для перегляду */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Артикул
        </label>
        <input
          type="text"
          value={product.articleNumber}
          readOnly
          className="input w-full bg-gray-100 p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Назва товару
        </label>
        <input
          type="text"
          value={product.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="input w-full p-2 border border-gray-300 rounded"
          placeholder="Назва товару"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Опис товару
        </label>
        <textarea
          value={product.description}
          onChange={(e) => onChange({ description: e.target.value })}
          className="textarea w-full p-2 border border-gray-300 rounded h-24"
          placeholder="Опис товару"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Ціна</label>
        <input
          type="number"
          value={product.price}
          onChange={(e) => onChange({ price: Number(e.target.value) })}
          className="input w-full p-2 border border-gray-300 rounded"
          placeholder="Ціна"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Знижка (%)
        </label>
        <input
          type="number"
          value={product.discount}
          onChange={(e) => onChange({ discount: Number(e.target.value) })}
          className="input w-full p-2 border border-gray-300 rounded"
          placeholder="Знижка (%)"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Image URLs (через кому)
        </label>
        <input
          type="text"
          value={product.imageUrls.join(", ")}
          onChange={(e) =>
            onChange({
              imageUrls: e.target.value.split(",").map((url) => url.trim()),
            })
          }
          className="input w-full p-2 border border-gray-300 rounded"
          placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
        />
      </div>
      {/* Додаткові поля, наприклад, розміри */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Розміри (формат: розмір:кількість, наприклад, S:10, M:5)
        </label>
        <input
          type="text"
          value={product.sizes.map((s) => `${s.size}:${s.stock}`).join(", ")}
          onChange={(e) => {
            const newSizes = e.target.value.split(",").map((item) => {
              const [size, stock] = item.split(":");
              return { size: size.trim(), stock: Number(stock) || 0 };
            });
            onChange({ sizes: newSizes });
          }}
          className="input w-full p-2 border border-gray-300 rounded"
          placeholder="S:10, M:5, L:2"
        />
      </div>
    </div>
  );
};

export const ProductItem: React.FC<ProductItemProps> = ({
  product,
  onDelete,
  onStatusChange,
}) => {
  return (
    <AdminItem<Product>
      item={product}
      itemLabel="товар"
      renderCard={renderProductCard}
      renderEditForm={renderProductEditForm}
      onSave={updateProduct}
      onDelete={() => onDelete(product)}
      onToggleActive={(item, newStatus) => {
        onStatusChange(item);
        return updateProductActiveStatus(item.articleNumber, newStatus);
      }}
    />
  );
};
