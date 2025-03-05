// components/BrandItem.tsx
"use client";

import React from "react";
import { AdminItem } from "../../_components/AdminItem";
import { Brand } from "@/utils/types";
import { deleteBrand, updateBrand } from "@/lib/api/brands-service";

const renderBrandCard = (brand: Brand) => {
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden transform transition duration-300 hover:scale-105">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 text-center">
          {brand.name}
        </h2>
      </div>
    </div>
  );
};

const renderBrandEditForm = (
  brand: Brand,
  onChange: (changed: Partial<Brand>) => void
) => {
  return (
    <div className="space-y-4">
      <input
        type="text"
        value={brand.name}
        onChange={(e) => onChange({ name: e.target.value })}
        className="input w-full p-2 border border-gray-300 rounded"
        placeholder="Назва бренду"
      />
    </div>
  );
};

export const BrandItem: React.FC<{ brand: Brand }> = ({ brand }) => {
  return (
    <AdminItem<Brand>
      item={brand}
      itemLabel="бренд"
      renderCard={renderBrandCard}
      renderEditForm={renderBrandEditForm}
      onSave={updateBrand}
      onDelete={deleteBrand}
    />
  );
};
