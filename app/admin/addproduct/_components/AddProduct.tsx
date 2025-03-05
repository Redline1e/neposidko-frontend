"use client";
import { useState, useEffect } from "react";
import { Product, Brand, Category } from "@/utils/types"; // Переконайтеся, що Product тепер містить imageUrls: string[]
import { addProduct } from "@/lib/api/product-service";
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

export default function AddProduct() {
  const [form, setForm] = useState<Product>({
    articleNumber: "",
    name: "",
    brandId: 1,
    categoryId: 1,
    price: 0,
    discount: 0,
    description: "",
    imageUrls: [],
    sizes: [],
  });

  // Окремий стан для введення URL зображень (як рядок, де URL розділено комами)
  const [imageUrlsInput, setImageUrlsInput] = useState<string>("");

  // Стан для введення нового розміру та кількості
  const [newSize, setNewSize] = useState<string>("");
  const [newStock, setNewStock] = useState<number>(0);

  // Режим введення знижки: "percent" (відсотки) або "amount" (гривні)
  const [discountMode, setDiscountMode] = useState<"percent" | "amount">(
    "percent"
  );

  // Стан для завантажених брендів та категорій
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Завантаження брендів та категорій при монтуванні компонента
  useEffect(() => {
    fetchBrands()
      .then((data) => setBrands(data))
      .catch((error) => console.error(error));

    fetchCategories()
      .then((data) => setCategories(data))
      .catch((error) => console.error(error));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Для числових полів перетворюємо значення у Number
    if (
      name === "brandId" ||
      name === "price" ||
      name === "discount" ||
      name === "categoryId"
    ) {
      setForm({ ...form, [name]: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Додаємо пару розмір/кількість до масиву form.sizes
  const handleAddSize = () => {
    if (newSize.trim() === "" || newStock < 0) {
      alert("Будь ласка, введіть коректний розмір та кількість");
      return;
    }
    setForm({
      ...form,
      sizes: [...form.sizes, { size: newSize.trim(), stock: newStock }],
    });
    setNewSize("");
    setNewStock(0);
  };

  // Видалення доданого розміру за індексом
  const handleRemoveSize = (index: number) => {
    const updatedSizes = form.sizes.filter((_, i) => i !== index);
    setForm({ ...form, sizes: updatedSizes });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Розбиваємо введений рядок URL за комами, обрізаємо пробіли та фільтруємо порожні рядки
    const imageUrls = imageUrlsInput
      .split(",")
      .map((url: string) => url.trim())
      .filter((url) => url !== "");

    // Якщо режим введення знижки "amount", конвертуємо її у відсотки
    let discountPercent = form.discount;
    if (discountMode === "amount") {
      if (form.price > 0) {
        discountPercent = (form.discount / form.price) * 100;
      } else {
        discountPercent = 0;
      }
    }

    const productToAdd: Product = {
      ...form,
      discount: discountPercent,
      imageUrls: imageUrls, // Зберігаємо масив URL
    };

    await addProduct(productToAdd);
    alert("Товар додано!");

    // Очищуємо форму та поле введення URL
    setForm({
      articleNumber: "",
      name: "",
      brandId: 1,
      categoryId: 1,
      price: 0,
      discount: 0,
      description: "",
      imageUrls: [],
      sizes: [],
    });
    setImageUrlsInput("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 shadow-md rounded-lg flex flex-col gap-4 w-full max-w-md mx-auto"
    >
      <h2 className="text-lg font-semibold text-center">Додати товар</h2>

      <label className="flex flex-col">
        <span className="text-sm font-medium text-gray-700">
          Номер артикулу:
        </span>
        <input
          type="text"
          name="articleNumber"
          value={form.articleNumber}
          onChange={handleChange}
          required
          className="border p-2 rounded-md"
        />
      </label>

      {/* Поле для введення назви товару */}
      <label className="flex flex-col">
        <span className="text-sm font-medium text-gray-700">Назва товару:</span>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="border p-2 rounded-md"
        />
      </label>

      {/* Випадаюче меню для вибору бренду */}
      <label className="flex flex-col">
        <span className="text-sm font-medium text-gray-700">Бренд:</span>
        <Select
          value={String(form.brandId)}
          onValueChange={(value) =>
            setForm({ ...form, brandId: Number(value) })
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
      </label>

      {/* Випадаюче меню для вибору категорії */}
      <label className="flex flex-col">
        <span className="text-sm font-medium text-gray-700">Категорія:</span>
        <Select
          value={String(form.categoryId)}
          onValueChange={(value) =>
            setForm({ ...form, categoryId: Number(value) })
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

      {/* Рядок з полем для знижки та перемикачем режимів */}
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">
              {discountMode === "percent" ? "Знижка (%)" : "Знижка (₴)"}
            </span>
            <input
              type="number"
              name="discount"
              value={form.discount}
              onChange={handleChange}
              placeholder={
                discountMode === "percent"
                  ? "Введіть відсоток знижки"
                  : "Введіть знижку в гривнях"
              }
              required
              className="border p-2 rounded-md"
            />
            {discountMode === "amount" && form.price > 0 && (
              <span className="text-xs text-gray-500">
                Це відповідає {((form.discount / form.price) * 100).toFixed(2)}%
              </span>
            )}
          </label>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">
            Режим знижки:
          </span>
          <RadioGroup
            value={discountMode}
            onValueChange={(value) =>
              setDiscountMode(value as "percent" | "amount")
            }
            className="flex space-x-4 mt-1"
          >
            <div className="flex items-center space-x-2 mt-1">
              <RadioGroupItem value="percent" id="discount-percent" />
              <label htmlFor="discount-percent">%</label>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <RadioGroupItem value="amount" id="discount-amount" />
              <label htmlFor="discount-amount">₴</label>
            </div>
          </RadioGroup>
        </div>
      </div>

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

      {/* Поле для введення URL зображень через кому */}
      <label className="flex flex-col">
        <span className="text-sm font-medium text-gray-700">
          URL зображень (через кому):
        </span>
        <input
          type="text"
          name="imageUrls"
          value={imageUrlsInput}
          onChange={(e) => setImageUrlsInput(e.target.value)}
          required
          placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
          className="border p-2 rounded-md"
        />
      </label>

      {/* Блок для додавання розмірів */}
      <div className="border p-4 rounded-md">
        <h3 className="text-md font-medium text-gray-700 mb-2">
          Додати розмір та кількість
        </h3>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            placeholder="Розмір (наприклад, 36)"
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
            className="bg-green-500 text-white px-1 py-1 rounded-md"
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
}
