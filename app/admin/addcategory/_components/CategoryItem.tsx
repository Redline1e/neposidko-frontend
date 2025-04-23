"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { Category } from "@/utils/types";
import { apiClient, getAuthHeaders } from "@/utils/apiClient";
import { deleteCategory } from "@/lib/api/category-service";
import { AdminItem } from "../../_components/AdminItem";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

// Схема валідації для категорії
const categorySchema = z.object({
  name: z.string().min(1, "Назва категорії є обов'язковою"),
  image: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      "Максимальний розмір файлу 5MB"
    ),
});

type FormData = z.infer<typeof categorySchema>;

const renderCategoryCard = (category: Category) => (
  <div className="bg-white shadow-lg rounded-xl overflow-hidden transform transition duration-300 hover:scale-105">
    <Image
      src={category.imageUrl || "/fallback.jpg"}
      alt={category.name}
      width={300}
      height={300}
      className="w-full h-56 object-cover"
      onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
    />
    <div className="p-4">
      <h2 className="text-lg font-semibold text-gray-800">{category.name}</h2>
    </div>
  </div>
);

const CategoryEditForm: React.FC<{
  category: Category;
  onChange: (changed: Partial<Category>) => void;
}> = ({ category, onChange }) => {
  const [previewUrl, setPreviewUrl] = useState<string>(category.imageUrl || "");
  const {
    register,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: category.name },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue("image", file);
        const newUrl = URL.createObjectURL(file);
        setPreviewUrl(newUrl);
        onChange({ imageUrl: newUrl });
      }
    },
    [setValue, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    multiple: false,
  });

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700">
          Назва категорії:
        </label>
        <input
          {...register("name")}
          type="text"
          className="border p-2 rounded-md w-full"
          onChange={(e) => onChange({ name: e.target.value })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">
            {errors.name.message as string}
          </p>
        )}
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Зображення:</label>
        <div
          {...getRootProps()}
          className={`border p-4 rounded-md text-center cursor-pointer ${
            isDragActive ? "bg-blue-50 border-blue-500" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Відпустіть файл тут...</p>
          ) : (
            <p>Перетягніть файл або клікніть для вибору</p>
          )}
        </div>
        {previewUrl && (
          <div className="mt-4 w-full h-56 relative rounded overflow-hidden">
            <Image
              src={previewUrl}
              alt="Зображення категорії"
              fill
              sizes="(max-width: 300px) 100vw, 300px"
              className="object-contain"
              onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
            />
          </div>
        )}
        {errors.image && (
          <p className="text-red-500 text-sm mt-1">
            {errors.image.message as string}
          </p>
        )}
      </div>
    </div>
  );
};

const updateCategoryWithImage = async (category: Category) => {
  try {
    const formData = new FormData();
    formData.append("name", category.name);

    if (category.imageUrl && category.imageUrl.startsWith("blob:")) {
      const response = await fetch(category.imageUrl);
      const blob = await response.blob();
      formData.append("image", blob, "category-image.jpg");
    }

    await apiClient.put(`/categories/${category.categoryId}`, formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success("Категорію успішно оновлено!");
  } catch (error) {
    console.error("Помилка оновлення категорії:", error);
    toast.error("Помилка оновлення категорії");
    throw error;
  }
};

export const CategoriesItem: React.FC<{ category: Category }> = ({
  category,
}) => {
  return (
    <AdminItem<Category>
      item={category}
      itemLabel="категорія"
      renderCard={renderCategoryCard}
      renderEditForm={(category, onChange) => (
        <CategoryEditForm category={category} onChange={onChange} />
      )}
      onSave={updateCategoryWithImage}
      onDelete={(item) => deleteCategory(item.categoryId)}
    />
  );
};
