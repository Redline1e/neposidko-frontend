"use client";
import React from "react";
import { AdminItem } from "../../_components/AdminItem";
import { Brand } from "@/utils/types";
import { deleteBrand, updateBrand } from "@/lib/api/brands-service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

// Схема валідації для бренду
const brandSchema = z.object({
  name: z.string().min(1, "Назва бренду є обов'язковою"),
});

type FormData = z.infer<typeof brandSchema>;

const renderBrandCard = (brand: Brand) => (
  <div className="bg-white shadow-lg rounded-xl overflow-hidden transform transition duration-300 hover:scale-105">
    <div className="p-4">
      <h2 className="text-lg font-semibold text-gray-800 text-center">
        {brand.name}
      </h2>
    </div>
  </div>
);

const renderBrandEditForm = (
  brand: Brand,
  onChange: (changed: Partial<Brand>) => void
) => {
  const {
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: { name: brand.name },
  });

  return (
    <div className="space-y-4">
      <input
        {...register("name")}
        type="text"
        className="input w-full p-2 border border-gray-300 rounded"
        placeholder="Назва бренду"
        onChange={(e) => onChange({ name: e.target.value })}
      />
      {errors.name && (
        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
      )}
    </div>
  );
};

export const BrandItem: React.FC<{ brand: Brand }> = ({ brand }) => (
  <AdminItem<Brand>
    item={brand}
    itemLabel="бренд"
    renderCard={renderBrandCard}
    renderEditForm={renderBrandEditForm}
    onSave={updateBrand} // Передаємо функцію напряму
    onDelete={(item) => deleteBrand(item.brandId)}
  />
);
