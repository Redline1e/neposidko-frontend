"use client";

import { useEffect, useState } from "react";
import { Frown, Loader2 } from "lucide-react";
import ProductItem from "./ProductItem";
import { fetchActiveProducts } from "@/lib/api/product-service";
import { Product } from "@/utils/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const getProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchActiveProducts();
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

  const filteredProducts = products.filter((product) => {
    const categoryIdStr =
      product.categoryId != null ? product.categoryId.toString() : "";
    const matchesCategory =
      filters.categories.length === 0 ||
      filters.categories.includes(categoryIdStr);
    const matchesSize =
      filters.sizes.length === 0 ||
      product.sizes?.some((s) => filters.sizes.includes(s.size));
    const productPrice = product.discount
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

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: currentProducts.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://www.neposidko.com/product/${product.articleNumber}`,
    })),
  };

  if (loading) return <Loader2 className="animate-spin h-10 w-10" />;
  if (error)
    return (
      <p className="text-center text-xl font-semibold text-red-500">{error}</p>
    );

  return (
    <div className="md:mt-20 mt-28 mb-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {sortedProducts.length === 0 ? (
        <p className="flex justify-center items-center text-xl font-semibold gap-x-2">
          Товари не знайдено <Frown />
        </p>
      ) : (
        <div className="container mx-auto px-4 mb-5">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {currentProducts.map((product) => (
              <ProductItem key={product.articleNumber} product={product} />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className={
                      currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }
                    onClick={(e) => {
                      if (currentPage > 1) {
                        setCurrentPage((prev) => prev - 1);
                      } else {
                        e.preventDefault();
                      }
                    }}
                    aria-disabled={currentPage === 1}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    className={
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }
                    onClick={(e) => {
                      if (currentPage < totalPages) {
                        setCurrentPage((prev) => prev + 1);
                      } else {
                        e.preventDefault();
                      }
                    }}
                    aria-disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDisplay;
