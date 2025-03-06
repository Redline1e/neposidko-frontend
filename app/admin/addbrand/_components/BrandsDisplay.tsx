"use client";
import React, { useEffect, useState } from "react";
import { Brand } from "@/utils/types";
import { fetchBrands } from "@/lib/api/brands-service";
import { BrandItem } from "./BrandItem";

export const BrandsDisplay: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const data = await fetchBrands();
        setBrands(data);
      } catch (err) {
        console.error("Помилка завантаження брендів:", err);
        setError("Не вдалося завантажити бренди");
      } finally {
        setLoading(false);
      }
    };

    loadBrands();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500">Завантаження брендів...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Бренди</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {brands.map((brand) => (
          <BrandItem key={brand.brandId} brand={brand} />
        ))}
      </div>
    </div>
  );
};
