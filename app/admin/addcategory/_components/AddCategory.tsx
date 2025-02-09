"use client";
import { useState } from "react";
import { Category } from "@/utils/api";
import { addCategory } from "@/lib/category-service";

export default function AddCategory() {
  const [form, setForm] = useState<Category>({
    name: "",
    imageUrl: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCategory(form);
      alert("Категорію додано!");
      setForm({
        name: "",
        imageUrl: "",
      });
    } catch (error) {
      console.error("Помилка при додаванні категорії:", error);
      alert("Не вдалося додати категорію");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 shadow-md rounded-lg flex flex-col gap-4 w-full max-w-md mx-auto"
    >
      <h2 className="text-lg font-semibold text-center">Додати категорію</h2>

      <label className="flex flex-col">
        <span className="text-sm font-medium text-gray-700">
          Назва категорії:
        </span>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Введіть назву категорії"
          required
          className="border p-2 rounded-md"
        />
      </label>

      <label className="flex flex-col">
        <span className="text-sm font-medium text-gray-700">
          URL зображення:
        </span>
        <input
          type="text"
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          placeholder="Введіть URL зображення"
          required
          className="border p-2 rounded-md"
        />
      </label>

      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Додати категорію
      </button>
    </form>
  );
}
