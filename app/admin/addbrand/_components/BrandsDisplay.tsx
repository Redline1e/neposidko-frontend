"use client";
import { useEffect, useState } from "react";
import { BrandItem } from "./BrandItem";
import { Brand } from "@/utils/types";
import { fetchBrands } from "@/lib/api/brands-service";

export const BrandsDisplay = () => {
  const [Brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const data = await fetchBrands();
        setBrands(data);
        console.log(data);
      } catch (err) {
        console.error("Помилка завантаження категорій:", err);
        setError("Не вдалося завантажити категорії");
      } finally {
        setLoading(false);
      }
    };

    loadBrands();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-500">Завантаження категорій...</div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Бренди</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Brands.map((brand, id) => (
          <BrandItem key={id} brand={brand} />
        ))}
      </div>
    </div>
  );
};
