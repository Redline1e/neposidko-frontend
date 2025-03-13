"use client";
import React, { useState, useCallback } from "react";
import { Category } from "@/utils/types";
import { useDropzone } from "react-dropzone";

const AddCategory: React.FC = () => {
  const [form, setForm] = useState<Category>({
    categoryId: 0,
    name: "",
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    multiple: false,
  });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      alert("Введіть назву категорії");
      return;
    }
    if (!imageFile) {
      alert("Завантажте зображення для категорії");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("image", imageFile);

    try {
      const response = await fetch("http://localhost:5000/categories", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Не вдалося додати категорію");
      await response.json();
      alert("Категорію успішно додано!");
      setForm({ categoryId: 0, name: "", imageUrl: "" });
      setImageFile(null);
      setPreviewUrl("");
    } catch (error) {
      console.error("Помилка додавання категорії:", error);
      alert("Не вдалося додати категорію");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 shadow-md rounded-lg flex flex-col gap-4 w-full max-w-md mx-auto"
    >
      <h2 className="text-lg font-semibold text-center">Додати категорію</h2>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Назва категорії:
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Введіть назву"
          required
          className="border p-2 rounded-md"
        />
      </div>
      <div className="flex flex-col gap-2">
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
