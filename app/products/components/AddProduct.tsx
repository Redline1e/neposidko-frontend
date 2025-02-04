"use client";
import { useState } from "react";
import { addProduct, Product } from "@/utils/api";

export default function AddProduct() {
  const [form, setForm] = useState<Product>({
    brandId: 1,
    price: 0,
    discount: 0,
    description: "",
    imageUrl: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addProduct(form);
    alert("Товар додано!");
    setForm({
      brandId: 1,
      price: 0,
      discount: 0,
      description: "",
      imageUrl: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 shadow-md rounded-lg flex flex-col gap-4 w-full max-w-md mx-auto"
    >
      <h2 className="text-lg font-semibold text-center">Додати товар</h2>
      <input
        type="number"
        name="brandId"
        value={form.brandId}
        onChange={handleChange}
        placeholder="ID бренду"
        required
        className="border p-2 rounded-md"
      />
      <input
        type="number"
        name="price"
        value={form.price}
        onChange={handleChange}
        placeholder="Ціна"
        required
        className="border p-2 rounded-md"
      />
      <input
        type="number"
        name="discount"
        value={form.discount}
        onChange={handleChange}
        placeholder="Знижка"
        className="border p-2 rounded-md"
      />
      <input
        type="text"
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Опис"
        required
        className="border p-2 rounded-md"
      />
      <input
        type="text"
        name="imageUrl"
        value={form.imageUrl}
        onChange={handleChange}
        placeholder="URL зображення"
        required
        className="border p-2 rounded-md"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Додати товар
      </button>
    </form>
  );
}
