"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { OrderItemData, OrderItem as OrderItemType } from "@/utils/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOrderItem, deleteOrderItem } from "@/lib/order-items-service";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  item: OrderItemData;
  onItemUpdate?: (updatedItem: OrderItemData) => void;
  onItemDelete?: (deletedItemId: number) => void;
};

export default function OrderItem({ item, onItemUpdate, onItemDelete }: Props) {
  const router = useRouter();

  // Локальні стани для селектів
  const [selectedSize, setSelectedSize] = useState<string>(item.size);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(
    item.quantity
  );
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Використовуємо ref для збереження останніх збережених значень,
  // щоб уникнути збереження при першому рендері
  const initialValues = useRef({ size: item.size, quantity: item.quantity });

  // Отримуємо дані про розмір з властивості sizes
  const sizeData = item.sizes?.find((s) => s.size === selectedSize);
  const availableStock = sizeData ? sizeData.stock : 0;

  // Формуємо опції для вибору кількості (від 1 до availableStock)
  const quantityOptions = [];
  for (let i = 1; i <= availableStock; i++) {
    quantityOptions.push(i);
  }

  // Функція для автоматичного збереження
  async function handleSave() {
    setIsSaving(true);
    try {
      // Формуємо об’єкт для оновлення (тип OrderItemType)
      const updatedItem: OrderItemType = {
        productOrderId: item.productOrderId,
        orderId: item.orderId,
        articleNumber: item.articleNumber,
        size: selectedSize,
        quantity: selectedQuantity,
      };
      // Викликаємо API для оновлення позиції
      await updateOrderItem(updatedItem);
      // Формуємо нову позицію типу OrderItemData, зберігаючи додаткові поля
      const newItem: OrderItemData = {
        ...item,
        size: selectedSize,
        quantity: selectedQuantity,
      };
      if (onItemUpdate) {
        onItemUpdate(newItem);
      }
    } catch (error) {
      console.error("Помилка оновлення позиції:", error);
    }
    setIsSaving(false);
  }

  // Обробник видалення позиції замовлення
  async function handleDelete() {
    if (!confirm("Ви впевнені, що хочете видалити цю позицію?")) return;
    setIsDeleting(true);
    try {
      await deleteOrderItem(item.productOrderId);
      if (onItemDelete) {
        onItemDelete(item.productOrderId);
      }
      // Оновлюємо сторінку після видалення
      router.refresh();
    } catch (error) {
      console.error("Помилка видалення позиції:", error);
    }
    setIsDeleting(false);
  }

  // Використовуємо useEffect для debounce-автозбереження при зміні селектів
  useEffect(() => {
    if (
      selectedSize === initialValues.current.size &&
      selectedQuantity === initialValues.current.quantity
    ) {
      return;
    }
    const timer = setTimeout(() => {
      handleSave();
      initialValues.current = {
        size: selectedSize,
        quantity: selectedQuantity,
      };
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedSize, selectedQuantity]);

  return (
    <div className="flex items-start border-b pb-4">
      <Image
        src={item.imageUrl}
        alt={item.description}
        width={100}
        height={100}
        className="rounded-lg"
      />
      <div className="ml-4 flex-1">
        <h2 className="text-lg font-semibold">{item.description}</h2>
        <p className="text-sm text-gray-500">Артикул: {item.articleNumber}</p>
        {item.discount > 0 ? (
          <div>
            <p className="text-gray-500 line-through text-sm">
              {item.price + item.discount} грн.
            </p>
            <p className="text-red-500 font-semibold">{item.price} грн.</p>
          </div>
        ) : (
          <p className="text-red-500 font-semibold">{item.price} грн.</p>
        )}
        <div className="mt-2 flex flex-col md:flex-row md:items-center gap-4">
          {/* Селект для вибору розміру */}
          <div className="w-32">
            <Select
              value={selectedSize}
              onValueChange={(value) => setSelectedSize(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Оберіть розмір" />
              </SelectTrigger>
              <SelectContent>
                {item.sizes &&
                  item.sizes.map((sizeObj) => (
                    <SelectItem key={sizeObj.size} value={sizeObj.size}>
                      {sizeObj.size}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          {/* Селект для вибору кількості */}
          <div className="w-24">
            <Select
              value={String(selectedQuantity)}
              onValueChange={(value) => setSelectedQuantity(Number(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Кількість" />
              </SelectTrigger>
              <SelectContent>
                {quantityOptions.map((qty) => (
                  <SelectItem key={qty} value={String(qty)}>
                    {qty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Індикатор процесу збереження */}
          {isSaving && (
            <span className="text-sm text-gray-500">Збереження...</span>
          )}
        </div>
      </div>
      <div>
        <Button variant="outline" onClick={handleDelete} disabled={isDeleting}>
          <Trash2 className={isDeleting ? "animate-spin" : ""} />
        </Button>
      </div>
    </div>
  );
}
