"use client";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";

interface Category {
  categoryId: number;
  name: string;
  imageUrl: string;
}

interface FilterSidebarProps {
  filters: {
    categories: string[];
    sizes: number[];
    priceRange: string;
    discountOnly: boolean;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      categories: string[];
      sizes: number[];
      priceRange: string;
      discountOnly: boolean;
    }>
  >;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  setFilters,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Завантаження категорій з API
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Помилка завантаження категорій:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (categoryId: number) => {
    setFilters((prev) => {
      const categoryIdStr = categoryId.toString();
      const newCategories = prev.categories.includes(categoryIdStr)
        ? prev.categories.filter((c) => c !== categoryIdStr)
        : [...prev.categories, categoryIdStr];
      return { ...prev, categories: newCategories };
    });
  };

  const handleSizeChange = (size: number) => {
    setFilters((prev) => {
      const newSizes = prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: newSizes };
    });
  };

  const handlePriceRangeChange = (priceRange: string) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: prev.priceRange === priceRange ? "" : priceRange,
    }));
  };

  const handleDiscountChange = () => {
    setFilters((prev) => ({ ...prev, discountOnly: !prev.discountOnly }));
  };

  return (
    <div className="custom-sidebar sticky w-64 p-4 border border-gray-300 rounded">
      <h2 className="text-xl font-semibold text-center">Фільтри</h2>
      <div className="mt-4">
        {/* Категорії */}
        <div className="mb-4">
          <p className="font-medium text-neutral-900">Категорії</p>
          <div className="mt-2 space-y-2">
            {categories.map((cat) => (
              <label
                key={cat.categoryId}
                className="flex items-center space-x-2"
              >
                <Checkbox
                  checked={filters.categories.includes(
                    cat.categoryId.toString()
                  )}
                  onCheckedChange={() => handleCategoryChange(cat.categoryId)}
                />
                <span>{cat.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Розмір */}
        <div className="mb-4">
          <p className="font-medium text-neutral-900">Розмір</p>
          <div className="mt-2 space-y-2">
            {[36, 37, 38, 39, 40, 41, 42, 43].map((size) => (
              <label key={size} className="flex items-center space-x-2">
                <Checkbox
                  checked={filters.sizes.includes(size)}
                  onCheckedChange={() => handleSizeChange(size)}
                />
                <span>{size}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Ціна */}
        <div className="mb-4">
          <p className="font-medium text-neutral-900">Ціна</p>
          <div className="mt-2 space-y-2">
            {[
              "До 1000 грн",
              "1000 - 3000 грн",
              "3000 - 5000 грн",
              "5000+ грн",
            ].map((price) => (
              <label key={price} className="flex items-center space-x-2">
                <Checkbox
                  checked={filters.priceRange === price}
                  onCheckedChange={() => handlePriceRangeChange(price)}
                />
                <span>{price}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Наявність знижки */}
        <div className="mb-4">
          <p className="font-medium text-neutral-900">Наявність знижки</p>
          <div className="mt-2">
            <label className="flex items-center space-x-2">
              <Checkbox
                checked={filters.discountOnly}
                onCheckedChange={handleDiscountChange}
              />
              <span>Показувати лише зі знижкою</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
