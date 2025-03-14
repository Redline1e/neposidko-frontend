"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Product, Brand, Category } from "@/utils/types";
import { useDropzone } from "react-dropzone";
import { Plus } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchBrands } from "@/lib/api/brands-service";
import { fetchCategories } from "@/lib/api/category-service";

const AddProduct: React.FC = () => {
  const [form, setForm] = useState<Product>({
    articleNumber: "",
    name: "",
    brandId: 1,
    categoryId: 1,
    price: 0,
    discount: 0,
    description: `Категорія:   Бренд:    Колір:    Сезон:    Країна виробник:    Матеріал верху:    Матеріал підкладки:`,
    imageUrls: [],
    isActive: true,
    sizes: [],
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [newSize, setNewSize] = useState<string>("");
  const [newStock, setNewStock] = useState<number>(0);
  const [discountMode, setDiscountMode] = useState<"percent" | "amount">(
    "percent"
  );
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchBrands().then(setBrands).catch(console.error);
    fetchCategories().then(setCategories).catch(console.error);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "discount" ? Number(value) : value,
    }));
  }, []);

  const handleAddSize = useCallback(() => {
    if (!newSize.trim() || newStock <= 0) {
      alert("Введіть коректний розмір та кількість (кількість > 0)");
      return;
    }
    setForm((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { size: newSize.trim(), stock: newStock }],
    }));
    setNewSize("");
    setNewStock(0);
  }, [newSize, newStock]);

  const handleRemoveSize = useCallback((index: number) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }));
  }, []);

  // Оновлена функція onDrop – додаємо файли до існуючих масивів
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImageFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    setPreviewUrls((prevUrls) => [
      ...prevUrls,
      ...acceptedFiles.map((file) => URL.createObjectURL(file)),
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    multiple: true,
  });

  const validateForm = (): boolean => {
    if (!form.articleNumber.trim()) {
      alert("Номер артикулу є обов’язковим");
      return false;
    }
    if (!form.name.trim()) {
      alert("Назва товару є обов’язковою");
      return false;
    }
    if (!form.price || form.price <= 0) {
      alert("Ціна повинна бути більше 0");
      return false;
    }
    if (!form.description.trim()) {
      alert("Опис товару є обов’язковим");
      return false;
    }
    if (imageFiles.length === 0) {
      alert("Завантажте хоча б одне зображення");
      return false;
    }
    if (discountMode === "percent") {
      if (form.discount < 0 || form.discount > 100) {
        alert("Знижка (%) повинна бути від 0 до 100");
        return false;
      }
    }
    if (discountMode === "amount" && form.price > 0) {
      if (form.discount < 0 || form.discount > form.price) {
        alert("Знижка (₴) повинна бути від 0 до ціни товару");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const discountPercent =
      discountMode === "amount" && form.price > 0
        ? (form.discount / form.price) * 100
        : form.discount;

    const formData = new FormData();
    formData.append("articleNumber", form.articleNumber);
    formData.append("name", form.name);
    formData.append("brandId", String(form.brandId));
    formData.append("categoryId", String(form.categoryId));
    formData.append("price", String(form.price));
    formData.append("discount", String(discountPercent));
    formData.append("description", form.description);
    formData.append("sizes", JSON.stringify(form.sizes));

    // Додаємо всі файли, що накопичились
    imageFiles.forEach((file) => formData.append("images", file));

    try {
      const response = await fetch("http://localhost:5000/products", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Не вдалося додати продукт");
      await response.json();
      alert("Товар успішно додано!");
      setForm({
        articleNumber: "",
        name: "",
        brandId: 1,
        categoryId: 1,
        price: 0,
        discount: 0,
        description: "",
        imageUrls: [],
        isActive: true,
        sizes: [],
      });
      setImageFiles([]);
      setPreviewUrls([]);
    } catch (error) {
      console.error("Помилка додавання товару:", error);
      alert("Не вдалося додати товар");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 shadow-md rounded-lg flex flex-col gap-4 w-full max-w-md mx-auto"
    >
      <h2 className="text-lg font-semibold text-center">Додати товар</h2>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Номер артикулу:
        </label>
        <input
          type="text"
          name="articleNumber"
          value={form.articleNumber}
          onChange={handleChange}
          required
          className="border p-2 rounded-md"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Назва товару:
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="border p-2 rounded-md"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Бренд:</label>
        <Select
          value={String(form.brandId)}
          onValueChange={(value) =>
            setForm((prev) => ({ ...prev, brandId: Number(value) }))
          }
        >
          <SelectTrigger className="border p-2 rounded-md">
            <SelectValue placeholder="Оберіть бренд" />
          </SelectTrigger>
          <SelectContent>
            {brands.map((brand) => (
              <SelectItem key={brand.brandId} value={String(brand.brandId)}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Категорія:</label>
        <Select
          value={String(form.categoryId)}
          onValueChange={(value) =>
            setForm((prev) => ({ ...prev, categoryId: Number(value) }))
          }
        >
          <SelectTrigger className="border p-2 rounded-md">
            <SelectValue placeholder="Оберіть категорію" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem
                key={category.categoryId}
                value={String(category.categoryId)}
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Ціна:</label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          required
          className="border p-2 rounded-md"
        />
      </div>

      <div className="flex items-start gap-4">
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            {discountMode === "percent" ? "Знижка (%)" : "Знижка (₴)"}
          </label>
          <input
            type="number"
            name="discount"
            value={form.discount}
            onChange={handleChange}
            className="border p-2 rounded-md"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Режим знижки:
          </label>
          <RadioGroup
            value={discountMode}
            onValueChange={(value) =>
              setDiscountMode(value as "percent" | "amount")
            }
            className="flex space-x-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="percent" id="percent" />
              <label htmlFor="percent">%</label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="amount" id="amount" />
              <label htmlFor="amount">₴</label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Опис товару:
        </label>
        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
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
            <p>Відпустіть файли тут...</p>
          ) : (
            <p>Перетягніть файли або клікніть для вибору</p>
          )}
        </div>
        {previewUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {previewUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Preview ${index}`}
                className="h-24 w-full object-cover rounded"
                onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
              />
            ))}
          </div>
        )}
      </div>

      <div className="border p-4 rounded-md flex flex-col gap-2">
        <h3 className="text-md font-medium text-gray-700">
          Додати розмір та кількість
        </h3>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            placeholder="Розмір"
            className="border p-2 rounded-md flex-1"
          />
          <input
            type="number"
            value={newStock}
            onChange={(e) => setNewStock(Number(e.target.value))}
            placeholder="Кількість"
            className="border p-2 rounded-md w-24"
          />
          <button
            type="button"
            onClick={handleAddSize}
            className="bg-green-500 text-white px-2 py-2 rounded-md"
          >
            <Plus />
          </button>
        </div>
        {form.sizes.length > 0 && (
          <ul className="mt-2">
            {form.sizes.map((s, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>
                  {s.size} - {s.stock} шт.
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveSize(index)}
                  className="text-red-500"
                >
                  Видалити
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Додати товар
      </button>
    </form>
  );
};

export default AddProduct;
