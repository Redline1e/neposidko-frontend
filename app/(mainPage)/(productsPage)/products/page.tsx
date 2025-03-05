"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FilterSidebar } from "./_components/FilterSidebar";
import ProductDisplay from "./_components/ProductDisplay";
import SortSelect from "./_components/SortSelect";

export interface FiltersState {
  categories: string[];
  sizes: string[];
  priceRange: string;
  discountOnly: boolean;
}

export default function Home() {
  const searchParams = useSearchParams();
  const categoryQuery = searchParams.get("categories") || "";
  const initialFilters: FiltersState = {
    categories: categoryQuery ? [categoryQuery] : [],
    sizes: [],
    priceRange: "",
    discountOnly: false,
  };

  const [filters, setFilters] = useState<FiltersState>(initialFilters);
  const [sortOrder, setSortOrder] = useState("default");

  // Оновлення фільтра категорій при зміні query-параметра
  useEffect(() => {
    if (categoryQuery) {
      setFilters((prev) => ({ ...prev, categories: [categoryQuery] }));
    }
  }, [categoryQuery]);

  return (
    <div className="flex w-full h-screen">
      <FilterSidebar filters={filters} setFilters={setFilters} />
      <main className="flex-1">
        <ProductDisplay filters={filters} sortOrder={sortOrder} />
      </main>
      <SortSelect sortOrder={sortOrder} setSortOrder={setSortOrder} />
    </div>
  );
}
