"use client";
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { FilterSidebar } from "./_components/FilterSidebar";
import ProductDisplay from "./_components/ProductDisplay";
import SortSelect from "./_components/SortSelect";

interface FiltersState {
  categories: string[];
  sizes: number[];
  priceRange: string;
  discountOnly: boolean;
}

export default function Home() {
  const [filters, setFilters] = useState<FiltersState>({
    categories: [],
    sizes: [],
    priceRange: "",
    discountOnly: false,
  });
  const [sortOrder, setSortOrder] = useState("default");

  return (
    <div className="flex">
      <FilterSidebar filters={filters} setFilters={setFilters} />
      <main className="flex-1">
        <SortSelect sortOrder={sortOrder} setSortOrder={setSortOrder} />
        <ProductDisplay filters={filters} sortOrder={sortOrder} />
      </main>
    </div>
  );
}
