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
        className="lg:hidden fixed top-28 left-4 w-12 h-12 z-30"
      >
        <Filter size={24} />
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white border-r transition-transform duration-300 z-50 lg:static lg:z-auto lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="lg:hidden flex justify-end p-4 border-b">
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Фільтри</h2>

            {/* Категорії */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-4">Категорії</h3>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <label
                    key={`cat-${cat.categoryId}`}
                    className="flex items-center gap-3 text-neutral-700 hover:text-neutral-900"
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

            {/* Розміри */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-4">Розмір</h3>
              <div className="grid grid-cols-2 gap-3">
                {[...sizes]
                  .sort((a, b) => {
                    const aNum = parseFloat(a.size);
                    const bNum = parseFloat(b.size);
                    const aIsNum = !isNaN(aNum);
                    const bIsNum = !isNaN(bNum);
                    if (aIsNum && bIsNum) return aNum - bNum;
                    if (aIsNum) return -1;
                    if (bIsNum) return 1;
                    return a.size.localeCompare(b.size);
                  })
                  .map((s) => (
                    <label
                      key={`size-${s.size}-${s.sizeId}`}
                      className="flex items-center gap-3 text-neutral-700 hover:text-neutral-900"
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

            {/* Ціновий діапазон */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-4">Ціна</h3>
              <div className="space-y-3">
                {[
                  "До 1000 грн",
                  "1000 - 3000 грн",
                  "3000 - 5000 грн",
                  "5000+ грн",
                ].map((price) => (
                  <label
                    key={`price-${price}`}
                    className="flex items-center gap-3 text-neutral-700 hover:text-neutral-900"
                  >
                    <Checkbox
                      checked={filters.priceRange === price}
                      onCheckedChange={() => handlePriceRangeChange(price)}
                    />
                    <span>{price}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Знижки */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-4">Акції</h3>
              <label className="flex items-center gap-3 text-neutral-700 hover:text-neutral-900">
                <Checkbox
                  checked={filters.discountOnly}
                  onCheckedChange={handleDiscountChange}
                />
                <span>Тільки товари зі знижкою</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
