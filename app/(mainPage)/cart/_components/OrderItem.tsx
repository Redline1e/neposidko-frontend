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
import Link from "next/link";

type Props = {
  item: OrderItemData;
  onItemUpdate?: (updatedItem: OrderItemData) => void;
  onItemDelete?: (deletedItemId: number) => void;
};

export default function OrderItem({ item, onItemUpdate, onItemDelete }: Props) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string>(item.size);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(
    item.quantity
  );
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const initialValues = useRef({ size: item.size, quantity: item.quantity });

  const sizeData = item.sizes?.find((s) => s.size === selectedSize);
  const availableStock = sizeData ? sizeData.stock : 0;

  const quantityOptions = [];
  for (let i = 1; i <= availableStock; i++) {
    quantityOptions.push(i);
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const updatedItem: OrderItemType = {
        productOrderId: item.productOrderId,
        orderId: item.orderId,
        articleNumber: item.articleNumber,
        size: selectedSize,
        quantity: selectedQuantity,
      };

      await updateOrderItem(updatedItem);

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

  async function handleDelete() {
    if (!confirm("Ви впевнені, що хочете видалити цю позицію?")) return;
    setIsDeleting(true);
    try {
      await deleteOrderItem(item.productOrderId);
      if (onItemDelete) {
        onItemDelete(item.productOrderId);
      }
      router.refresh();
    } catch (error) {
      console.error("Помилка видалення позиції:", error);
    }
    setIsDeleting(false);
  }

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
    <div className="flex items-start border-b pb-4 w-full">
      <Link href={`/product/${item.articleNumber}`} className="block">
        {item.imageUrls.length > 0 ? (
          <Image
            src={item.imageUrls[0]}
            alt={item.description}
            width={100}
            height={100}
            className="rounded-lg"
          />
        ) : (
          <div className="w-[100px] h-[100px] bg-gray-200 flex items-center justify-center rounded-lg">
            <span className="text-gray-500 text-sm">Немає зображення</span>
          </div>
        )}
      </Link>
      <div className="ml-4 flex-1">
        <Link href={`/product/${item.articleNumber}`} className="block">
          <h2 className="text-lg font-semibold hover:underline">{item.name}</h2>
        </Link>
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
          <div className="w-40">
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
        </div>
      </div>
      <Button variant="outline" onClick={handleDelete} disabled={isDeleting}>
        <Trash2 className={isDeleting ? "animate-spin" : ""} />
      </Button>
    </div>
  );
}
