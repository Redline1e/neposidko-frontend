// components/CategoriesItem.tsx
"use client";

import React from "react";
import { AdminItem } from "../../_components/AdminItem";
import { Category } from "@/utils/types";
import Image from "next/image";
import { deleteCategory, updateCategory } from "@/lib/api/category-service";

const renderCategoryCard = (category: Category) => {
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden transform transition duration-300 hover:scale-105">
      <Image
        src={category.imageUrl}
        alt={category.name}
        width={300}
        height={300}
        className="w-full h-56 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800">{category.name}</h2>
      </div>
    </div>
  );
};

const renderCategoryEditForm = (
  category: Category,
  onChange: (changed: Partial<Category>) => void
) => {
  return (
    <div className="space-y-4">
      <input
        type="text"
        value={category.name}
        onChange={(e) => onChange({ name: e.target.value })}
        className="input w-full p-2 border border-gray-300 rounded"
        placeholder="Назва категорії"
      />
      <input
        type="text"
        value={category.imageUrl}
        onChange={(e) => onChange({ imageUrl: e.target.value })}
        className="input w-full p-2 border border-gray-300 rounded"
        placeholder="URL зображення"
      />
    </div>
  );
};

export const CategoriesItem: React.FC<{ category: Category }> = ({
  category,
}) => {
  return (
    <AdminItem<Category>
      item={category}
      itemLabel="категорія"
      renderCard={renderCategoryCard}
      renderEditForm={renderCategoryEditForm}
      onSave={updateCategory}
      onDelete={deleteCategory}
    />
  );
};
