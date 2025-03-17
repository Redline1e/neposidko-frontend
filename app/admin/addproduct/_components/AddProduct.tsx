"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { toast } from "sonner";

// Схема валідації для товару
const productSchema = z.object({
  articleNumber: z.string().min(1, "Номер артикулу є обов'язковим"),
  name: z.string().min(1, "Назва товару є обов'язковою"),
  brandId: z.number().min(1, "Оберіть бренд"),
  categoryId: z.number().min(1, "Оберіть категорію"),
  price: z.number().min(0.01, "Ціна повинна бути більше 0"),
  discount: z.number().min(0).max(100, "Знижка повинна бути від 0 до 100"),
  description: z.string().min(1, "Опис товару є обов'язковим"),
  imageFiles: z
    .array(z.instanceof(File))
    .min(1, "Завантажте хоча б одне зображення"),
  sizes: z
    .array(
      z.object({
        size: z.string().min(1, "Розмір є обов'язковим"),
        stock: z.number().min(1, "Кількість повинна бути більше 0"),
      })
    )
    .optional(),
});

type FormData = z.infer<typeof productSchema>;

const AddProduct: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [discountMode, setDiscountMode] = useState<"percent" | "amount">(
    "percent"
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      articleNumber: "",
      name: "",
      brandId: 1,
      categoryId: 1,
      price: 0,
      discount: 0,
      description: "",
      imageFiles: [],
      sizes: [],
    },
  });

  useEffect(() => {
    fetchBrands().then(setBrands).catch(console.error);
    fetchCategories().then(setCategories).catch(console.error);
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...watch("imageFiles"), ...acceptedFiles];
      setValue("imageFiles", newFiles);
      const newUrls = acceptedFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newUrls]);
    },
    [setValue, watch]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    multiple: true,
  });

  const handleAddSize = () => {
    const size = prompt("Введіть розмір");
    const stock = Number(prompt("Введіть кількість"));
    if (size && stock > 0) {
      setValue("sizes", [...(watch("sizes") || []), { size, stock }]);
    }
  };

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append("articleNumber", data.articleNumber);
    formData.append("name", data.name);
    formData.append("brandId", String(data.brandId));
    formData.append("categoryId", String(data.categoryId));
    formData.append("price", String(data.price));
    formData.append("discount", String(data.discount));
    formData.append("description", data.description);
    formData.append("sizes", JSON.stringify(data.sizes || []));

    data.imageFiles.forEach((file) => formData.append("images", file));

    try {
      const response = await fetch("http://localhost:5000/products", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          toast.error("Товар з таким articleNumber уже існує");
        } else {
          throw new Error(errorData.message || "Не вдалося додати продукт");
        }
      } else {
        toast.success("Товар успішно додано!");
        setPreviewUrls([]);
      }
    } catch (error: any) {
      console.error("Помилка при додаванні товару:", error);
      toast.error(error.message || "Не вдалося додати товар");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 shadow-md rounded-lg flex flex-col gap-4 w-full max-w-md mx-auto"
    >
      <h2 className="text-lg font-semibold text-center">Додати товар</h2>

      <div>
        <label className="text-sm font-medium text-gray-700">
          Номер артикулу:
        </label>
        <input
          {...register("articleNumber")}
          type="text"
          className="border p-2 rounded-md w-full"
        />
        {errors.articleNumber && (
          <p className="text-red-500 text-sm mt-1">
            {errors.articleNumber.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">
          Назва товару:
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
        <label className="text-sm font-medium text-gray-700">Бренд:</label>
        <Select
          value={String(watch("brandId"))}
          onValueChange={(value) => setValue("brandId", Number(value))}
        >
          <SelectTrigger className="border p-2 rounded-md w-full">
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
        {errors.brandId && (
          <p className="text-red-500 text-sm mt-1">{errors.brandId.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Категорія:</label>
        <Select
          value={String(watch("categoryId"))}
          onValueChange={(value) => setValue("categoryId", Number(value))}
        >
          <SelectTrigger className="border p-2 rounded-md w-full">
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
        {errors.categoryId && (
          <p className="text-red-500 text-sm mt-1">
            {errors.categoryId.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Ціна:</label>
        <input
          {...register("price", { valueAsNumber: true })}
          type="number"
          className="border p-2 rounded-md w-full"
        />
        {errors.price && (
          <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
        )}
      </div>

      <div className="flex items-start gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700">
            {discountMode === "percent" ? "Знижка (%)" : "Знижка (₴)"}
          </label>
          <input
            {...register("discount", { valueAsNumber: true })}
            type="number"
            className="border p-2 rounded-md w-full"
          />
          {errors.discount && (
            <p className="text-red-500 text-sm mt-1">
              {errors.discount.message}
            </p>
          )}
        </div>
        <div>
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

      <div>
        <label className="text-sm font-medium text-gray-700">
          Опис товару:
        </label>
        <input
          {...register("description")}
          type="text"
          className="border p-2 rounded-md w-full"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
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
        {errors.imageFiles && (
          <p className="text-red-500 text-sm mt-1">
            {errors.imageFiles.message}
          </p>
        )}
      </div>

      <div className="border p-4 rounded-md">
        <h3 className="text-md font-medium text-gray-700">
          Додати розмір та кількість
        </h3>
        <button
          type="button"
          onClick={handleAddSize}
          className="bg-green-500 text-white px-2 py-2 rounded-md mt-2"
        >
          <Plus />
        </button>
        {watch("sizes")?.map((s, index) => (
          <div key={index}>
            {s.size} - {s.stock} шт.
          </div>
        ))}
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
