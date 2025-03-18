"use client";
import React, { useCallback, useState, useEffect } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Product } from "@/utils/types";
import { AdminItem } from "../../_components/AdminItem";
import { GripVertical } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

// Схема валідації без кастомних повідомлень для знижки
const createProductEditSchema = (
  discountMode: "percent" | "amount",
  price: number
) => {
  return z.object({
    name: z.string().min(1, "Назва товару є обов'язковою"),
    description: z.string().min(1, "Опис товару є обов'язковим"),
    price: z.number().min(0.01, "Ціна повинна бути більше 0"),
    discount: z
      .number()
      .min(0)
      .max(discountMode === "percent" ? 100 : price),
    imageUrls: z.array(z.string()).min(1, "Додайте хоча б одне зображення"),
    sizes: z
      .array(
        z.object({
          size: z.string().min(1, "Розмір є обов'язковим"),
          stock: z.number().min(0, "Кількість не може бути від'ємною"),
        })
      )
      .optional(),
  });
};

type FormData = z.infer<ReturnType<typeof createProductEditSchema>>;

interface SortableImageProps {
  image: string;
  index: number;
  onDelete: (index: number) => void;
}

const SortableImage: React.FC<SortableImageProps> = ({
  image,
  index,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef,
  } = useSortable({ id: image });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-center space-x-2 p-2 border rounded"
    >
      <div ref={setActivatorNodeRef} {...listeners} className="cursor-grab p-1">
        <GripVertical size={20} />
      </div>
      <Image
        src={image}
        alt={`Зображення ${index + 1}`}
        width={96}
        height={96}
        className="w-24 h-24 object-cover rounded"
        onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
      />
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(index);
        }}
        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Видалити
      </button>
    </div>
  );
};

const renderProductCard = (product: Product) => {
  const imageSrc = product.imageUrls?.[0] || "/fallback.jpg";
  const discountedPrice =
    product.discount > 0
      ? Math.round(product.price * (1 - product.discount / 100))
      : product.price;

  return (
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border">
      <div className="relative">
        <Image
          src={imageSrc}
          alt={product.name}
          width={300}
          height={300}
          className="w-full h-60 object-cover"
        />
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{product.discount}%
          </div>
        )}
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 truncate">
          {product.name}
        </h2>
        <p className="text-sm text-gray-600 truncate mb-2">
          {product.description}
        </p>
        <div className="mt-2 flex items-center space-x-2">
          {product.discount > 0 && (
            <span className="text-gray-400 line-through text-sm">
              {product.price} грн
            </span>
          )}
          <span className="text-red-500 font-semibold text-lg">
            {discountedPrice} грн
          </span>
        </div>
        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-2">
            <span className="text-md text-gray-600">
              {product.sizes.map((s) => s.size).join(", ")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const renderProductEditForm = (
  product: Product,
  onChange: (changed: Partial<Product>) => void
) => {
  const [discountMode, setDiscountMode] = useState<"percent" | "amount">(
    "percent"
  );
  const [previewUrls, setPreviewUrls] = useState<string[]>(
    product.imageUrls || []
  );

  const {
    register,
    formState: { errors },
    setValue,
    watch,
    trigger,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(createProductEditSchema(discountMode, product.price)),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price,
      discount: product.discount,
      imageUrls: product.imageUrls,
      sizes: product.sizes,
    },
  });

  const currentPrice = watch("price") || product.price;

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (discountMode === "percent" && value > 100) {
      setValue("discount", 100);
      onChange({ discount: 100 });
    } else if (discountMode === "amount" && value > currentPrice) {
      setValue("discount", currentPrice);
      onChange({ discount: currentPrice });
    } else if (value < 0) {
      setValue("discount", 0);
      onChange({ discount: 0 });
    } else {
      setValue("discount", value);
      onChange({ discount: value });
    }
  };

  useEffect(() => {
    reset({ ...watch() }, { keepDefaultValues: false });
    trigger("discount");
  }, [discountMode, currentPrice, trigger, reset, watch]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newUrls = acceptedFiles.map((file) => URL.createObjectURL(file));
      const updatedUrls = [...previewUrls, ...newUrls];
      setPreviewUrls(updatedUrls);
      setValue("imageUrls", updatedUrls);
      onChange({ imageUrls: updatedUrls });
    },
    [setValue, previewUrls, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    multiple: true,
  });

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = previewUrls.indexOf(active.id);
      const newIndex = previewUrls.indexOf(over.id);
      const newImages = arrayMove(previewUrls, oldIndex, newIndex);
      setPreviewUrls(newImages);
      setValue("imageUrls", newImages);
      onChange({ imageUrls: newImages });
    }
  };

  const handleImageDelete = (index: number) => {
    const newImages = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(newImages);
    setValue("imageUrls", newImages);
    onChange({ imageUrls: newImages });
  };

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  return (
    <form className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700">Артикул:</label>
        <input
          type="text"
          value={product.articleNumber}
          readOnly
          className="border p-2 rounded-md bg-gray-100 w-full"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">
          Назва товару:
        </label>
        <input
          {...register("name")}
          type="text"
          className="border p-2 rounded-md w-full"
          onChange={(e) => onChange({ name: e.target.value })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">
          Опис товару:
        </label>
        <textarea
          {...register("description")}
          className="border p-2 rounded-md w-full"
          onChange={(e) => onChange({ description: e.target.value })}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Ціна:</label>
        <input
          {...register("price", { valueAsNumber: true })}
          type="number"
          min={0.01}
          step={0.01}
          className="border p-2 rounded-md w-full"
          onChange={(e) => onChange({ price: Number(e.target.value) })}
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
            min={0}
            max={discountMode === "percent" ? 100 : currentPrice}
            step={discountMode === "percent" ? 1 : 0.01}
            className="border p-2 rounded-md w-full"
            onChange={handleDiscountChange}
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
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="percent"
                checked={discountMode === "percent"}
                onChange={() => {
                  setDiscountMode("percent");
                  onChange({ discountMode: "percent" });
                }}
              />
              %
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="amount"
                checked={discountMode === "amount"}
                onChange={() => {
                  setDiscountMode("amount");
                  onChange({ discountMode: "amount" });
                }}
              />
              ₴
            </label>
          </div>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Зображення:</label>
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={previewUrls}
            strategy={verticalListSortingStrategy}
          >
            <div className="mt-4 space-y-2">
              {previewUrls.map((image, index) => (
                <SortableImage
                  key={image}
                  image={image}
                  index={index}
                  onDelete={handleImageDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        {errors.imageUrls && (
          <p className="text-red-500 text-sm mt-1">
            {errors.imageUrls.message}
          </p>
        )}
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">
          Розміри (формат: розмір:кількість):
        </label>
        <input
          type="text"
          value={
            watch("sizes")
              ?.map((s) => `${s.size}:${s.stock}`)
              .join(", ") || ""
          }
          onChange={(e) => {
            const newSizes = e.target.value.split(",").map((item) => {
              const [size, stock] = item.split(":");
              return {
                size: size.trim(),
                stock: Math.max(0, Number(stock) || 0),
              };
            });
            setValue("sizes", newSizes);
            onChange({ sizes: newSizes });
          }}
          className="border p-2 rounded-md w-full"
          placeholder="S:10, M:5"
        />
        {errors.sizes && (
          <p className="text-red-500 text-sm mt-1">{errors.sizes.message}</p>
        )}
      </div>
    </form>
  );
};

const updateProductWithImages = async (product: Product) => {
  const formData = new FormData();
  formData.append("brandId", String(product.brandId));
  formData.append("price", String(product.price));

  // Якщо режим знижки передається, відправляємо його
  if ((product as any).discountMode) {
    formData.append("discountMode", (product as any).discountMode);
  }

  // Якщо потрібно, можна також провести конвертацію, наприклад,
  // якщо бекенд завжди очікує відсоткове значення:
  let discountToSave = product.discount;
  if ((product as any).discountMode === "amount") {
    discountToSave = (product.discount / product.price) * 100;
  }
  formData.append("discount", String(discountToSave));

  formData.append("name", product.name);
  formData.append("description", product.description);
  formData.append("categoryId", String(product.categoryId));
  formData.append("sizes", JSON.stringify(product.sizes || []));

  // Обробка зображень (залишається без змін)
  const existingImages = product.imageUrls.filter(
    (url) => !url.startsWith("blob:")
  );
  formData.append("imageUrls", JSON.stringify(existingImages));
  const newImages = product.imageUrls.filter((url) => url.startsWith("blob:"));
  for (const url of newImages) {
    const response = await fetch(url);
    const blob = await response.blob();
    formData.append("images", blob, `image-${Date.now()}.jpg`);
  }

  try {
    const response = await fetch(
      `http://localhost:5000/product/${product.articleNumber}`,
      {
        method: "PUT",
        body: formData,
      }
    );
    if (!response.ok) throw new Error("Не вдалося оновити продукт");
    await response.json();
    toast.success("Продукт успішно оновлено!");
  } catch (error) {
    toast.error("Помилка оновлення продукту");
    throw error;
  }
};

export const ProductItem: React.FC<{
  product: Product;
  onDelete: (product: Product) => Promise<void>;
  onStatusChange: (product: Product) => Promise<void>;
}> = ({ product, onDelete, onStatusChange }) => {
  return (
    <AdminItem<Product>
      item={product}
      itemLabel="товар"
      renderCard={renderProductCard}
      renderEditForm={renderProductEditForm}
      onSave={updateProductWithImages}
      onDelete={onDelete}
      onToggleActive={(item) => onStatusChange(item)}
    />
  );
};
