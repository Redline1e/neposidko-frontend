"use client";

import React, {
  useCallback,
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragEndEvent,
  UniqueIdentifier,
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
import { apiClient, getAuthHeaders } from "@/utils/apiClient";

interface SortableImageProps {
  image: string;
  id: UniqueIdentifier;
  onDelete: (id: UniqueIdentifier) => void;
}

const SortableImage: React.FC<SortableImageProps> = ({
  image,
  id,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef,
  } = useSortable({ id });
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
        alt={`Зображення ${id}`}
        width={96}
        height={96}
        className="w-24 h-24 object-cover rounded"
        onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
      />
      <button
        type="button"
        onClick={() => onDelete(id)}
        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Видалити
      </button>
    </div>
  );
};

const useProductForm = (
  product: Product,
  onChange: (changed: Partial<Product>) => void
) => {
  const [discountMode, setDiscountMode] = useState<"percent" | "amount">(
    "percent"
  );
  const [previewUrls, setPreviewUrls] = useState<string[]>(
    product.imageUrls || []
  );
  const formRef = useRef<HTMLFormElement>(null);

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(1, "Назва товару є обов'язковою"),
        description: z.string().min(1, "Опис товару є обов'язковим"),
        price: z.number().min(0.01, "Ціна повинна бути більше 0"),
        discount: z
          .number()
          .min(0)
          .max(discountMode === "percent" ? 100 : product.price),
        imageUrls: z.array(z.string()).min(1, "Додайте хоча б одне зображення"),
        sizes: z
          .array(
            z.object({
              size: z.string().min(1, "Розмір є обов'язковим"),
              stock: z.number().min(0, "Кількість не може бути від'ємною"),
            })
          )
          .optional(),
      }),
    [discountMode, product.price]
  );

  const { register, formState, setValue, watch, trigger, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: useMemo(
      () => ({
        name: product.name,
        description: product.description,
        price: product.price,
        discount: product.discount,
        imageUrls: product.imageUrls,
        sizes: product.sizes,
      }),
      [product]
    ),
  });

  const currentPrice = watch("price") || product.price;

  const handleDiscountChange = useCallback(
    (value: number) => {
      let newValue = value;
      if (discountMode === "percent" && value > 100) {
        newValue = 100;
      } else if (discountMode === "amount" && value > currentPrice) {
        newValue = currentPrice;
      } else if (value < 0) {
        newValue = 0;
      }

      setValue("discount", newValue);
      onChange({ discount: newValue });
    },
    [discountMode, currentPrice, setValue, onChange]
  );

  useEffect(() => {
    reset({ ...watch() });
    trigger();
  }, [discountMode, currentPrice, reset, trigger, watch]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newUrls = acceptedFiles.map((file) => URL.createObjectURL(file));
      const updatedUrls = [...previewUrls, ...newUrls];
      setPreviewUrls(updatedUrls);
      setValue("imageUrls", updatedUrls);
      onChange({ imageUrls: updatedUrls });
    },
    [previewUrls, setValue, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    multiple: true,
  });

  const handleImageDelete = useCallback(
    (id: UniqueIdentifier) => {
      const newImages = previewUrls.filter((url) => url !== id);
      setPreviewUrls(newImages);
      setValue("imageUrls", newImages);
      onChange({ imageUrls: newImages });
    },
    [previewUrls, setValue, onChange]
  );

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      const oldIndex = previewUrls.indexOf(active.id.toString());
      const newIndex = previewUrls.indexOf(over.id.toString());

      if (oldIndex !== newIndex) {
        const newImages = arrayMove(previewUrls, oldIndex, newIndex);
        setPreviewUrls(newImages);
        setValue("imageUrls", newImages);
        onChange({ imageUrls: newImages });
      }
    },
    [previewUrls, setValue, onChange]
  );

  return {
    formRef,
    register,
    errors: formState.errors,
    watch,
    discountMode,
    setDiscountMode,
    previewUrls,
    getRootProps,
    getInputProps,
    isDragActive,
    sensors,
    handleDragEnd,
    handleImageDelete,
    handleDiscountChange,
    currentPrice,
    setValue,
  };
};

const ProductEditForm: React.FC<{
  product: Product;
  onChange: (changed: Partial<Product>) => void;
}> = ({ product, onChange }) => {
  const {
    formRef,
    register,
    errors,
    discountMode,
    setDiscountMode,
    previewUrls,
    getRootProps,
    getInputProps,
    isDragActive,
    sensors,
    handleDragEnd,
    handleImageDelete,
    handleDiscountChange,
    currentPrice,
    watch,
    setValue,
  } = useProductForm(product, onChange);

  return (
    <form ref={formRef} className="space-y-4">
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
            onChange={(e) => handleDiscountChange(Number(e.target.value))}
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
              {previewUrls.map((image) => (
                <SortableImage
                  key={image}
                  image={image}
                  id={image}
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
              const [size, stock] = item.includes(":")
                ? item.split(":")
                : [item.trim(), "0"];
              return {
                size: size?.trim() || "",
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

const updateProductWithImages = async (product: Product) => {
  const formData = new FormData();
  formData.append("brandId", String(product.brandId));
  formData.append("price", String(product.price));
  formData.append("name", product.name);
  formData.append("description", product.description);
  formData.append("categoryId", String(product.categoryId));
  formData.append("sizes", JSON.stringify(product.sizes || []));

  let discountToSave = product.discount;
  if (product.discountMode === "amount") {
    discountToSave = (product.discount / product.price) * 100;
  }
  formData.append("discount", String(discountToSave));

  const existingImages = product.imageUrls.filter(
    (url) => !url.startsWith("blob:")
  );
  const newImages = product.imageUrls.filter((url) => url.startsWith("blob:"));
  formData.append("existingImageUrls", JSON.stringify(existingImages));
  for (const url of newImages) {
    const response = await fetch(url);
    const blob = await response.blob();
    formData.append("images", blob, `image-${Date.now()}.jpg`);
  }

  try {
    await apiClient.put(`/product/${product.articleNumber}`, formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });
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
      renderEditForm={(item, onChange) => (
        <ProductEditForm product={item} onChange={onChange} />
      )}
      onSave={updateProductWithImages}
      onDelete={onDelete}
      onToggleActive={(item) => onStatusChange(item)}
    />
  );
};
