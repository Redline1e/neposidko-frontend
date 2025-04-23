"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FilterSidebar } from "./_components/FilterSidebar";
import ProductDisplay from "./_components/ProductDisplay";
import SortSelect from "./_components/SortSelect";
import LoadingSkeleton from "./_components/LoadingSkeleton";

export interface FiltersState {
  categories: string[];
  sizes: string[];
  priceRange: string;
  discountOnly: boolean;
}

function ProductsContent() {
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

  useEffect(() => {
    if (categoryQuery) {
      setFilters((prev) => ({ ...prev, categories: [categoryQuery] }));
    }
  }, [categoryQuery]);

  return (
    <div className="flex w-full min-h-[calc(100vh-250px)]">
      <FilterSidebar filters={filters} setFilters={setFilters} />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <ProductDisplay filters={filters} sortOrder={sortOrder} />
      </main>
      <SortSelect sortOrder={sortOrder} setSortOrder={setSortOrder} />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ProductsContent />
    </Suspense>
  );
}
