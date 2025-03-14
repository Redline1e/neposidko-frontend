"use client";
import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

// Схема валідації для категорії
const categorySchema = z.object({
  name: z.string().min(1, "Назва категорії є обов'язковою"),
  image: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "Максимальний розмір файлу 5MB"
    ),
});

type FormData = z.infer<typeof categorySchema>;

const AddCategory: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(categorySchema),
  });

  const [previewUrl, setPreviewUrl] = useState<string>("");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue("image", file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    },
    [setValue]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    multiple: false,
  });

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("image", data.image);

    try {
      const response = await fetch("http://localhost:5000/categories", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Не вдалося додати категорію");
      await response.json();
      toast.success("Категорію успішно додано!");
      setPreviewUrl("");
    } catch (error) {
      toast.error("Не вдалося додати категорію");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 shadow-md rounded-lg flex flex-col gap-4 w-full max-w-md mx-auto"
    >
      <h2 className="text-lg font-semibold text-center">Додати категорію</h2>
      <div>
        <label className="text-sm font-medium text-gray-700">
          Назва категорії:
        </label>
        <input
          {...register("name")}
          type="text"
          className="border p-2 rounded-md w-full"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">
          Зображення (обов’язково):
        </label>
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
          <img
            src={previewUrl}
            alt="Preview"
            className="mt-2 h-24 w-full object-cover rounded"
            onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
          />
        )}
        {errors.image && (
          <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
        )}
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Додати категорію
      </button>
    </form>
  );
};

export default AddCategory;
