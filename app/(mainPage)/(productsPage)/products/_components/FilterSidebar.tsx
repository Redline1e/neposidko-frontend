"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchSizes } from "@/lib/api/sizes-service";
import { Sizes } from "@/utils/types";
import { fetchCategories } from "@/lib/api/category-service";

interface Category {
  categoryId: number;
  name: string;
  imageUrl: string;
}

interface FilterSidebarProps {
  filters: {
    categories: string[];
    sizes: string[];
    priceRange: string;
    discountOnly: boolean;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      categories: string[];
      sizes: string[];
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
  const [sizes, setSizes] = useState<Sizes[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Завантаження категорій
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Помилка завантаження категорій:", error);
      }
    };
    loadCategories();
  }, []);

  // Завантаження розмірів
  useEffect(() => {
    const loadSizes = async () => {
      try {
        const sizesData = await fetchSizes();
        setSizes(sizesData);
      } catch (error) {
        console.error("Помилка завантаження розмірів:", error);
      }
    };
    loadSizes();
  }, []);

  // Заборона прокручування при відкритому сайдбарі
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleCategoryChange = (categoryId: number) => {
    setFilters((prev) => {
      const categoryIdStr = categoryId.toString();
      const newCategories = prev.categories.includes(categoryIdStr)
        ? prev.categories.filter((c) => c !== categoryIdStr)
        : [...prev.categories, categoryIdStr];
      return { ...prev, categories: newCategories };
    });
  };

  const handleSizeChange = (sizeValue: string) => {
    setFilters((prev) => {
      const newSizes = prev.sizes.includes(sizeValue)
        ? prev.sizes.filter((s) => s !== sizeValue)
        : [...prev.sizes, sizeValue];
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
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="md:hidden absolute top-28 left-4 w-12 h-12"
      >
        <Filter size={24} />
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white border border-gray-300 rounded transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:static md:translate-x-0 md:block`}
      >
        <div className="mt-3 flex flex-col h-full">
          <div className="md:hidden flex justify-end p-2">
            <button onClick={() => setIsOpen(false)} className="p-2">
              <X size={24} />
            </button>
          </div>
          <h2 className="text-xl font-semibold text-center mb-4">Фільтри</h2>
          <div className="flex-1 overflow-y-auto p-4">
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
                      onCheckedChange={() =>
                        handleCategoryChange(cat.categoryId)
                      }
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Розмір */}
            <div className="mb-4">
              <p className="font-medium text-neutral-900">Розмір</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {[...sizes]
                  .sort((a, b) => {
                    const aNum = parseFloat(a.size);
                    const bNum = parseFloat(b.size);
                    const aIsNum = !isNaN(aNum);
                    const bIsNum = !isNaN(bNum);
                    if (aIsNum && bIsNum) return aNum - bNum;
                    else if (aIsNum) return -1;
                    else if (bIsNum) return 1;
                    else return a.size.localeCompare(b.size);
                  })
                  .map((s, index) => (
                    <label
                      key={`${s.size}-${index}`}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        checked={filters.sizes.includes(s.size)}
                        onCheckedChange={() => handleSizeChange(s.size)}
                      />
                      <span>{s.size}</span>
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
      </div>
    </>
  );
};
