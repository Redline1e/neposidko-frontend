"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { FilterSidebar } from "./_components/FilterSidebar";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState({
    categories: [],
    sizes: [],
    priceRange: "",
    discountOnly: false,
  });

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <FilterSidebar filters={filters} setFilters={setFilters} />
        <main className="flex-1">
          <div>{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
