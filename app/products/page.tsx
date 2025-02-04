"use client";
import { useEffect, useState } from "react";
import { fetchProducts, Product } from "@/utils/api";
import AddProduct from "@/app/products/components/AddProduct";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Список товарів</h1>

      <AddProduct />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {products.map((product) => (
          <div
            key={product.productId}
            className="bg-white shadow-lg rounded-lg p-4"
          >
            <img
              src={product.imageUrl}
              alt={product.description}
              className="w-full h-40 object-cover rounded-md"
            />
            <h2 className="text-lg font-semibold mt-2">
              {product.description}
            </h2>
            <p className="text-gray-600">Ціна: {product.price} грн</p>
            {product.discount! > 0 && (
              <p className="text-red-500 font-bold">
                Знижка: {product.discount}%
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
