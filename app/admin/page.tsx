"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Product } from "@/utils/types";
import {
  searchProducts,
  fetchInactiveProducts,
  fetchActiveProducts,
  updateProductActiveStatus,
  deleteProduct,
  fetchProducts,
} from "@/lib/api/product-service";
import { Input } from "@/components/ui/input";
import { ProductItem } from "./addproduct/_components/ProductItem";
import { Button } from "@/components/ui/button";
import { Filter, X, Frown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchBrands } from "@/lib/api/brands-service";
import { fetchCategories } from "@/lib/api/category-service";

interface Category {
  categoryId: number;
  name: string;
}

interface Brand {
  brandId: number;
  name: string;
}

interface ProductFilters {
  categories: string[];
  brands: string[];
  active: "active" | "inactive" | "all";
}

const AdminProductsPage: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Product[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({
    categories: [],
    brands: [],
    active: "all",
  });
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allBrands, setAllBrands] = useState<Brand[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  // Завантаження даних для фільтрів
  useEffect(() => {
    const loadFiltersData = async () => {
      try {
        const categories = await fetchCategories();
        const brands = await fetchBrands();

        setAllCategories(
          categories.map((c) => ({
            categoryId: Number(c.categoryId),
            name: c.name,
          }))
        );
        setAllBrands(
          brands.map((b) => ({
            brandId: Number(b.brandId),
            name: b.name,
          }))
        );
      } catch (error) {
        console.error("Error loading filter data:", error);
      }
    };
    loadFiltersData();
  }, []);

  // Зміни у функції loadProducts:
  const loadProducts = useCallback(async () => {
    try {
      let products: Product[];

      if (filters.active === "active") {
        products = await fetchActiveProducts();
      } else if (filters.active === "inactive") {
        products = await fetchInactiveProducts();
      } else {
        // Якщо є пошуковий запит, виконуємо пошук, інакше завантажуємо всі товари
        if (query.trim().length > 0) {
          products = await searchProducts(query);
        } else {
          products = await fetchProducts();
        }
      }

      // Застосування фільтрів за категоріями та брендами
      const filtered = products.filter((product) => {
        const categoryId = product.categoryId?.toString() ?? "";
        const brandId = product.brandId?.toString() ?? "";
        return (
          (filters.categories.length === 0 ||
            filters.categories.includes(categoryId)) &&
          (filters.brands.length === 0 || filters.brands.includes(brandId))
        );
      });

      setResults(filtered);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  }, [filters, query]);

  // Виклик loadProducts при кожній зміні пошукового запиту чи фільтрів:
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadProducts();
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, filters, loadProducts]);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((c) => c !== categoryId)
        : [...prev.categories, categoryId],
    }));
  }, []);

  const handleBrandChange = useCallback((brandId: string) => {
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brandId)
        ? prev.brands.filter((b) => b !== brandId)
        : [...prev.brands, brandId],
    }));
  }, []);

  const handleClear = useCallback(() => {
    setQuery("");
    setFilters({ categories: [], brands: [], active: "all" });
  }, []);

  const handleStatusChange = useCallback(
    async (product: Product) => {
      try {
        await updateProductActiveStatus(
          product.articleNumber,
          !product.isActive
        );
        await loadProducts();
      } catch (error) {
        console.error("Error updating product status:", error);
      }
    },
    [loadProducts]
  );

  const handleDelete = useCallback(
    async (product: Product) => {
      try {
        // Припустимо, deleteProduct очікує articleNumber (string)
        await deleteProduct(product.articleNumber);
        await loadProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    },
    [loadProducts]
  );

  return (
    <div className="mx-auto mt-20 max-w-7xl px-4">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Пошук за артикулом або назвою..."
            className="pr-10"
          />
          {query && (
            <Button
              variant="ghost"
              onClick={handleClear}
              className="absolute right-2 top-2 h-6 w-6 p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => setIsFilterOpen((prev) => !prev)}
          className="md:w-48"
        >
          <Filter className="mr-2 h-4 w-4" /> Фільтри
        </Button>
      </div>

      {isFilterOpen && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Фільтр за категоріями */}
            <div>
              <h3 className="font-medium mb-2">Категорії</h3>
              <div className="space-y-2">
                {allCategories.map((category) => (
                  <label
                    key={category.categoryId}
                    className="flex items-center gap-2"
                  >
                    <Checkbox
                      checked={filters.categories.includes(
                        category.categoryId.toString()
                      )}
                      onCheckedChange={() =>
                        handleCategoryChange(category.categoryId.toString())
                      }
                    />
                    <span>{category.name}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Фільтр за брендами */}
            <div>
              <h3 className="font-medium mb-2">Бренди</h3>
              <div className="space-y-2">
                {allBrands.map((brand) => (
                  <label
                    key={brand.brandId}
                    className="flex items-center gap-2"
                  >
                    <Checkbox
                      checked={filters.brands.includes(
                        brand.brandId.toString()
                      )}
                      onCheckedChange={() =>
                        handleBrandChange(brand.brandId.toString())
                      }
                    />
                    <span>{brand.name}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Фільтр за статусом */}
            <div>
              <h3 className="font-medium mb-2">Статус</h3>
              <Select
                value={filters.active}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    active: value as "active" | "inactive" | "all",
                  }))
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всі</SelectItem>
                  <SelectItem value="active">Активні</SelectItem>
                  <SelectItem value="inactive">Неактивні</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              {["Артикул", "Назва", "Ціна", "Знижка", "Статус", "Дії"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-sm font-semibold"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {results.map((product) => (
              <tr key={product.articleNumber} className="border-t">
                <td className="px-4 py-3">{product.articleNumber}</td>
                <td className="px-4 py-3 font-medium">{product.name}</td>
                <td className="px-4 py-2">{product.price} грн</td>
                <td className="px-4 py-3">
                  {product.discount > 0 && `${product.discount}%`}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      product.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.isActive ? "Активний" : "Неактивний"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="w-[250px]">
                    <ProductItem
                      product={product}
                      onDelete={() => handleDelete(product)}
                      onStatusChange={() => handleStatusChange(product)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {results.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Frown className="mx-auto h-8 w-8 mb-2" />
            Товарів не знайдено
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductsPage;
