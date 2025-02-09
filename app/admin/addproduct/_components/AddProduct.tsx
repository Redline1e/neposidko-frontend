"use client";
import { useState } from "react";
import { Product } from "@/utils/api";
import { addProduct } from "@/lib/product-service";

export default function AddProduct() {
  const [form, setForm] = useState<Product>({
    productId: 0,
    brandId: 1,
    price: 0,
    discount: 0,
    description: "",
    imageUrl: "",
    sizes: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "sizes") {
      setForm({ ...form, sizes: value.split(",").map((size) => size.trim()) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addProduct(form);
    alert("Товар додано!");
    setForm({
      productId: 0,
      brandId: 1,
      price: 0,
      discount: 0,
      description: "",
      imageUrl: "",
      sizes: [],
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 shadow-md rounded-lg flex flex-col gap-4 w-full max-w-md mx-auto"
    >
      <h2 className="text-lg font-semibold text-center">Додати товар</h2>

      <label className="flex flex-col">
        <span className="text-sm font-medium text-gray-700">ID бренду:</span>
        <input
          type="number"
          name="brandId"
          value={form.brandId}
          onChange={handleChange}
          placeholder="Введіть ID бренду"
          required
          className="border p-2 rounded-md"
        />
      </label>

      <label className="flex flex-col">
        <span className="text-sm font-medium text-gray-700">Ціна:</span>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Введіть ціну"
          required
          className="border p-2 rounded-md"
        />
      </label>

      <label className="flex flex-col">
        <span className="text-sm font-medium text-gray-700">Знижка (%):</span>
        <input
          type="number"
          name="discount"
          value={form.discount}
          onChange={handleChange}
          placeholder="Введіть відсоток знижки"
          className="border p-2 rounded-md"
        />
      </label>

      <label className="flex flex-col">
        <span className="text-sm font-medium text-gray-700">Опис товару:</span>
        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
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
          required
          className="border p-2 rounded-md"
        />
      </label>

      <label className="flex flex-col">
        <span className="text-sm font-medium text-gray-700">Розміри:</span>
        <input
          type="text"
          name="sizes"
          value={form.sizes.join(", ")}
          onChange={handleChange}
          placeholder="(напр. 36, 37, 38)"
          className="border p-2 rounded-md"
        />
      </label>

      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Додати товар
      </button>
    </form>
  );
}
