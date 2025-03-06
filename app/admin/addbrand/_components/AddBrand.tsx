"use client";
import React, { useState, useCallback } from "react";
import { Brand } from "@/utils/types";
import { addBrand } from "@/lib/api/brands-service";

// Вкажемо brandId як 0 за замовчуванням, оскільки він обов'язковий
const AddBrand: React.FC = () => {
  const [form, setForm] = useState<Brand>({ name: "", brandId: 0 });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addBrand(form);
      alert("Бренд додано!");
      setForm({ name: "", brandId: 0 });
    } catch (error) {
      console.error("Помилка при додаванні бренду:", error);
      alert("Не вдалося додати бренд");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 shadow-md rounded-lg flex flex-col gap-4 w-full max-w-md mx-auto"
    >
      <h2 className="text-lg font-semibold text-center">Додати бренд</h2>
      <label className="flex flex-col">
        <span className="text-sm font-medium text-gray-700">Назва бренду:</span>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Введіть назву бренду"
          required
          className="border p-2 rounded-md"
        />
      </label>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Додати бренд
      </button>
    </form>
  );
};

export default AddBrand;
