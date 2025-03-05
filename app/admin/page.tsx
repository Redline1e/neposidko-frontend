// app/admin/products/page.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { useCheckRole } from "@/lib/api/user-service";
import { Product } from "@/utils/api";
import {
  searchProducts,
  fetchInactiveProducts,
  fetchActiveProducts,
  updateProductActiveStatus,
  deleteProduct,
} from "@/lib/api/product-service";
import { Input } from "@/components/ui/input";
import { ProductItem } from "./addproduct/_components/ProductItem";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
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
import { Frown } from "lucide-react";

interface Category {
  categoryId: number;
  name: string;
}

interface Brand {
  brandId: number;
  name: string;
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { hasAccess, loading } = useCheckRole();

  if (loading) {
    return <div>Перевірка доступу...</div>;
  }
  if (!hasAccess) {
    return <div>Доступ заборонено. Будь-ласка, увійдіть як адміністратор.</div>;
  }

  return <div ref={containerRef}>{children}</div>;
};

const AdminProductsPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [filters, setFilters] = useState({
    categories: [] as string[],
    brands: [] as string[],
    active: "all" as "active" | "inactive" | "all",
  });
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allBrands, setAllBrands] = useState<Brand[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  const loadProducts = async () => {
    try {
      let products: Product[];
      if (filters.active === "active") {
        products = await fetchActiveProducts();
      } else if (filters.active === "inactive") {
        products = await fetchInactiveProducts();
      } else {
        products = await searchProducts(query);
      }

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
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim().length >= 3 || filters.active !== "all") {
        loadProducts();
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query, filters]);

  const handleCategoryChange = (categoryId: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((c) => c !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  const handleBrandChange = (brandId: string) => {
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brandId)
        ? prev.brands.filter((b) => b !== brandId)
        : [...prev.brands, brandId],
    }));
  };

  const handleClear = () => {
    setQuery("");
    setFilters({
      categories: [],
      brands: [],
      active: "all",
    });
  };

  const handleStatusChange = async (product: Product) => {
    try {
      await updateProductActiveStatus(product.articleNumber, !product.isActive);
      await loadProducts();
    } catch (error) {
      console.error("Error updating product status:", error);
    }
  };

  const handleDelete = async (product: Product) => {
    try {
      await deleteProduct(product);
      await loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <ProtectedRoute>
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
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:w-48"
          >
            <Filter className="mr-2 h-4 w-4" /> Фільтри
          </Button>
        </div>

        {isFilterOpen && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                {[
                  "Зображення",
                  "Артикул",
                  "Назва",
                  "Ціна",
                  "Знижка",
                  "Статус",
                  "Дії",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-sm font-semibold"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((product) => (
                <tr key={product.articleNumber} className="border-t">
                  <td className="px-4 py-3">
                    <img
                      src={product.imageUrls?.[0] || "/placeholder.jpg"}
                      alt={product.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-3">{product.articleNumber}</td>
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3">{product.price} грн</td>
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
                    <ProductItem
                      product={product}
                      onDelete={() => handleDelete(product)}
                      onStatusChange={() => handleStatusChange(product)}
                    />
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
    </ProtectedRoute>
  );
};

export default AdminProductsPage;
