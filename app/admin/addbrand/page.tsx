"use client";
import { useEffect, useState } from "react";
import { Brand } from "@/utils/types";
import { BrandsDisplay } from "./_components/BrandsDisplay";
import AddBrand from "./_components/AddBrand";
import { fetchBrands } from "@/lib/api/brands-service";

export default function Home() {
  const [brand, setBrand] = useState<Brand[]>([]);

  useEffect(() => {
    fetchBrands().then(setBrand);
  }, []);

  return (
    <div className="mt-5 flex flex-col gap-4">
      <div className="flex justify-center">
        <AddBrand />
      </div>
      <div className="w-full">
        <BrandsDisplay />
      </div>
    </div>
  );
}
