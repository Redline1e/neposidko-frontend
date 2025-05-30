"use client";

import { useEffect, useState } from "react";
import { fetchCategories } from "@/lib/api/category-service";
import { Category } from "@/utils/types";
import { CategoriesItem } from "./CategoryItem";
import { Loader2 } from "lucide-react";
import Head from "next/head";

export const CategoriesDisplay = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error("Помилка завантаження категорій:", err);
        setError("Не вдалося завантажити категорії");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 animate-spin">
        <Loader2 className="w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <>
      <Head>
        <title>Категорії дитячого взуття - Непосидько</title>
        <meta
          name="description"
          content="Перегляньте популярні категорії дитячого взуття в інтернет-магазині Непосидько. Якісне взуття для дітей з доставкою по Україні."
        />
        <meta
          name="keywords"
          content="категорії взуття, дитяче взуття, Непосидько, купити взуття для дітей"
        />
        <link rel="canonical" href="https://www.neposidko.com/categories" />
      </Head>
      <div className="container mx-auto p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Популярні категорії
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, id) => (
            <CategoriesItem key={id} category={category} />
          ))}
        </div>
      </div>
    </>
  );
};
