"use client";
import React, { useCallback, useState } from "react";
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
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center space-x-2 p-2 border rounded"
    >
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
        onClick={() => onDelete(index)}
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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(
    product.imageUrls || []
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...imageFiles, ...acceptedFiles];
      setImageFiles(newFiles);
      const newUrls = acceptedFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newUrls]);
      onChange({ imageUrls: [...previewUrls, ...newUrls] });
    },
    [imageFiles, previewUrls, onChange]
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
      onChange({ imageUrls: newImages });
    }
  };

  const handleImageDelete = (index: number) => {
    const newImages = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(newImages);
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    onChange({ imageUrls: newImages });
  };

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Артикул:</label>
        <input
          type="text"
          value={product.articleNumber}
          readOnly
          className="border p-2 rounded-md bg-gray-100"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Назва товару:
        </label>
        <input
          type="text"
          value={product.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="border p-2 rounded-md"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Опис товару:
        </label>
        <textarea
          value={product.description}
          onChange={(e) => onChange({ description: e.target.value })}
          className="border p-2 rounded-md"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Ціна:</label>
        <input
          type="number"
          value={product.price}
          onChange={(e) => onChange({ price: Number(e.target.value) })}
          className="border p-2 rounded-md"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Знижка (%):</label>
        <input
          type="number"
          value={product.discount}
          onChange={(e) => onChange({ discount: Number(e.target.value) })}
          className="border p-2 rounded-md"
        />
      </div>
      <div className="flex flex-col gap-2">
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
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Розміри (формат: розмір:кількість):
        </label>
        <input
          type="text"
          value={product.sizes.map((s) => `${s.size}:${s.stock}`).join(", ")}
          onChange={(e) => {
            const newSizes = e.target.value.split(",").map((item) => {
              const [size, stock] = item.split(":");
              return { size: size.trim(), stock: Number(stock) || 0 };
            });
            onChange({ sizes: newSizes });
          }}
          className="border p-2 rounded-md"
          placeholder="S:10, M:5"
        />
      </div>
    </div>
  );
};

const updateProductWithImages = async (product: Product) => {
  const formData = new FormData();
  formData.append("brandId", String(product.brandId));
  formData.append("price", String(product.price));
  formData.append("discount", String(product.discount));
  formData.append("name", product.name);
  formData.append("description", product.description);
  formData.append("categoryId", String(product.categoryId));
  formData.append("sizes", JSON.stringify(product.sizes));

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

  const response = await fetch(
    `http://localhost:5000/product/${product.articleNumber}`,
    {
      method: "PUT",
      body: formData,
    }
  );
  if (!response.ok) throw new Error("Не вдалося оновити продукт");
  return response.json();
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
