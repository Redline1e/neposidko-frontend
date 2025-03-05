"use client";
import { useEffect, useState } from "react";
import { Product } from "@/utils/types";
import { CategoriesDisplay } from "./_components/CategoriesDisplay";
import { fetchProducts } from "@/lib/api/product-service";
import AddCategory from "./_components/AddCategory";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  return (
    <div className="mt-5 flex flex-col gap-4">
      <div className="flex justify-center">
        <AddCategory />
      </div>
      <div className="w-full">
        <CategoriesDisplay />
      </div>
    </div>
  );
}
