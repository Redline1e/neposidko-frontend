"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { Category } from "@/utils/types";
import { deleteCategory, updateCategory } from "@/lib/api/category-service";
import { AdminItem } from "../../_components/AdminItem";

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

const renderCategoryEditForm = (
  category: Category,
  onChange: (changed: Partial<Category>) => void
) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(category.imageUrl || "");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setImageFile(file);
        const newUrl = URL.createObjectURL(file);
        setPreviewUrl(newUrl);
        onChange({ imageUrl: newUrl });
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    multiple: false,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Назва категорії:
        </label>
        <input
          type="text"
          value={category.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="border p-2 rounded-md"
          placeholder="Назва категорії"
        />
      </div>
      <div className="flex flex-col gap-2">
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
          <Image
            src={previewUrl}
            alt="Зображення категорії"
            width={300}
            height={300}
            className="mt-4 w-full h-56 object-contain rounded"
            onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
          />
        )}
      </div>
    </div>
  );
};

const updateCategoryWithImage = async (category: Category) => {
  const formData = new FormData();
  formData.append("name", category.name);
  if (category.imageUrl && category.imageUrl.startsWith("blob:")) {
    const response = await fetch(category.imageUrl);
    const blob = await response.blob();
    formData.append("image", blob, "category-image.jpg");
  }

  const response = await fetch(
    `http://localhost:5000/categories/${category.categoryId}`,
    {
      method: "PUT",
      body: formData,
    }
  );
  if (!response.ok) throw new Error("Не вдалося оновити категорію");
  return response.json();
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
      onSave={updateCategoryWithImage}
      onDelete={(item) => deleteCategory(item.categoryId)}
    />
  );
};
