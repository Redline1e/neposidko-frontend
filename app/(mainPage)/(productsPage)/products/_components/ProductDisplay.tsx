"use client";
import { useEffect, useState } from "react";
import ProductItem from "./ProductItem";
import { Product } from "@/utils/api";
import { fetchProducts } from "@/lib/api/product-service";

interface ProductDisplayProps {
  filters: {
    categories: string[];
    sizes: number[];
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
      const data = await fetchProducts();
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

  // Фільтрація товарів лише за категоріями (використовується поле category)
  const filteredProducts = products.filter((product) => {
    // Отримуємо категорію товару у нижньому регістрі та обрізаємо пробіли
    const productCategory =
      product.category?.toString().toLowerCase().trim() || "";
    // Перетворюємо вибрані категорії у нижній регістр і обрізаємо пробіли
    const selectedCategories = filters.categories.map((c) =>
      c.toLowerCase().trim()
    );
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(productCategory);

    console.log(
      `Product ${
        product.articleNumber
      } - category: "${productCategory}", selectedCategories: ${JSON.stringify(
        selectedCategories
      )}, matchesCategory: ${matchesCategory}`
    );

    const matchesSize =
      filters.sizes.length === 0 ||
      product.sizes.some((s) => filters.sizes.includes(Number(s.size)));
    console.log(
      `Product ${product.articleNumber} - sizes: ${product.sizes
        .map((s) => s.size)
        .join(", ")}, matchesSize: ${matchesSize}`
    );

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
    console.log(
      `Product ${product.articleNumber} - price: ${productPrice}, matchesPrice: ${matchesPrice}`
    );

    const matchesDiscount =
      !filters.discountOnly || (filters.discountOnly && product.discount > 0);
    console.log(
      `Product ${product.articleNumber} - discount: ${product.discount}, matchesDiscount: ${matchesDiscount}`
    );

    const overallMatch =
      matchesCategory && matchesSize && matchesPrice && matchesDiscount;
    console.log(
      `Product ${product.articleNumber} - overallMatch: ${overallMatch}`
    );

    return overallMatch;
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
    return <p className="text-center text-xl font-semibold">Завантаження...</p>;
  if (error)
    return (
      <p className="text-center text-xl font-semibold text-red-500">{error}</p>
    );

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {sortedProducts.length === 0 ? (
        <p className="text-center text-xl font-semibold">Товари не знайдено</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {sortedProducts.map((product) => (
            <ProductItem key={product.articleNumber} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductDisplay;
