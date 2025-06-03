"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FilterSidebar } from "./_components/FilterSidebar";
import ProductDisplay from "./_components/ProductDisplay";
import SortSelect from "./_components/SortSelect";
import LoadingSkeleton from "./_components/LoadingSkeleton";
import Head from "next/head";

export interface FiltersState {
  categories: string[];
  sizes: string[];
  priceRange: string;
  discountOnly: boolean;
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reset = searchParams.get("reset");
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
    if (reset === "true") {
      setFilters({
        categories: [],
        sizes: [],
        priceRange: "",
        discountOnly: false,
      });
      router.replace("/products", { scroll: false });
    } else if (categoryQuery) {
      setFilters((prev) => ({ ...prev, categories: [categoryQuery] }));
    }
  }, [reset, categoryQuery, router]);

  return (
    <>
      <Head>
        <title>Товари - Непосидько</title>
        <meta
          name="description"
          content="ПерегляньTOD широкий вибір дитячого взуття в інтернет-магазині Непосидько. Якісне взуття для дітей з доставкою по Україні."
        />
        <meta
          name="keywords"
          content="дитяче взуття, інтернет-магазин, Непосидько, купити взуття для дітей"
        />
        <link rel="canonical" href="https://www.neposidko.com/products" />
      </Head>
      <div className="flex w-full min-h-[calc(100vh-250px)]">
        <FilterSidebar filters={filters} setFilters={setFilters} />
        <main className="flex-1 flex flex-col overflow-y-auto">
          <ProductDisplay filters={filters} sortOrder={sortOrder} />
        </main>
        <SortSelect sortOrder={sortOrder} setSortOrder={setSortOrder} />
      </div>
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ProductsContent />
    </Suspense>
  );
}
