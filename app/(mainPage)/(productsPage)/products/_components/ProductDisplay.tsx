"use client";
import { useEffect, useState } from "react";
import ProductItem from "./ProductItem";
import { Product } from "@/utils/api";
import { Frown } from "lucide-react";
import { fetchActiveProducts } from "@/lib/api/product-service";

interface ProductDisplayProps {
  filters: {
    categories: string[];
    sizes: string[];
    priceRange: string;
    discountOnly: boolean;
  };
  sortOrder: string;
}

export const ProductDisplay: React.FC<ProductDisplayProps> = ({
  filters,
  sortOrder,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchActiveProducts();
      console.log("Отримані товари:", data);
      setProducts(data);
      setError(null);
    } catch (error) {
      console.error("Помилка при завантаженні товарів:", error);
      setError("Не вдалося завантажити товари");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // Фільтрація товарів (за категоріями, розмірами, ціною та знижкою)
  const filteredProducts = products.filter((product) => {
    const categoryIdStr =
      product.categoryId != null ? product.categoryId.toString() : "";
    const matchesCategory =
      filters.categories.length === 0 ||
      filters.categories.includes(categoryIdStr);

    const matchesSize =
      filters.sizes.length === 0 ||
      product.sizes.some((s) => filters.sizes.includes(s.size));

    let productPrice = product.discount
      ? Math.round(product.price * (1 - product.discount / 100))
      : product.price;
    let matchesPrice = true;
    if (filters.priceRange === "До 1000 грн") {
      matchesPrice = productPrice <= 1000;
    } else if (filters.priceRange === "1000 - 3000 грн") {
      matchesPrice = productPrice >= 1000 && productPrice <= 3000;
    } else if (filters.priceRange === "3000 - 5000 грн") {
      matchesPrice = productPrice >= 3000 && productPrice <= 5000;
    } else if (filters.priceRange === "5000+ грн") {
      matchesPrice = productPrice >= 5000;
    }

    const matchesDiscount =
      !filters.discountOnly || (filters.discountOnly && product.discount > 0);

    return matchesCategory && matchesSize && matchesPrice && matchesDiscount;
  });

  // Сортування товарів
  const sortedProducts = filteredProducts.sort((a, b) => {
    if (sortOrder === "priceAsc") {
      const priceA = a.discount
        ? Math.round(a.price * (1 - a.discount / 100))
        : a.price;
      const priceB = b.discount
        ? Math.round(b.price * (1 - b.discount / 100))
        : b.price;
      return priceA - priceB;
    } else if (sortOrder === "priceDesc") {
      const priceA = a.discount
        ? Math.round(a.price * (1 - a.discount / 100))
        : a.price;
      const priceB = b.discount
        ? Math.round(b.price * (1 - b.discount / 100))
        : b.price;
      return priceB - priceA;
    } else if (sortOrder === "alphabetAsc") {
      return a.name.localeCompare(b.name);
    } else if (sortOrder === "alphabetDesc") {
      return b.name.localeCompare(a.name);
    }
    return 0;
  });

  console.log("Filtered products:", filteredProducts);
  console.log("Sorted products:", sortedProducts);

  if (loading)
    return (
      <p className="mt-20 text-center text-xl font-semibold">Завантаження...</p>
    );
  if (error)
    return (
      <p className="text-center text-xl font-semibold text-red-500">{error}</p>
    );
  return (
    <div className="md:mt-20 mt-28 mb-10 h-[calc(100vh-80px)] overflow-y-auto">
      {sortedProducts.length === 0 ? (
        <p className="flex justify-center items-center text-xl font-semibold gap-x-2">
          Товари не знайдено <Frown />
        </p>
      ) : (
        <div className="container mx-auto px-4 mb-5">
          {/* Центруємо товари */}
          <div className="flex flex-wrap gap-8 justify-center">
            {sortedProducts.map((product) => (
              <ProductItem key={product.articleNumber} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDisplay;
