import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { OrderItemData, OrderItem as OrderItemType } from "@/utils/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  updateOrderItem,
  deleteOrderItem,
} from "@/lib/api/order-items-service";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface OrderItemProps {
  item: OrderItemData;
  onItemUpdate?: (updatedItem: OrderItemData) => void;
  onItemDelete?: (deletedItemId: number) => void;
}

const OrderItem: React.FC<OrderItemProps> = ({
  item,
  onItemUpdate,
  onItemDelete,
}) => {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string>(item.size);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(
    item.quantity
  );
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const initialValues = useRef({ size: item.size, quantity: item.quantity });

  // Знаходимо інформацію про доступний stock для обраного розміру
  const sizeData = item.sizes?.find((s) => s.size === selectedSize);
  const availableStock = sizeData ? sizeData.stock : 0;

  // Використовуємо useMemo для створення масиву варіантів кількості
  const quantityOptions = useMemo(() => {
    return Array.from({ length: availableStock }, (_, i) => i + 1);
  }, [availableStock]);

  const handleSave = async () => {
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

      onItemUpdate?.(newItem);
    } catch (error) {
      console.error("Помилка оновлення позиції:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Ви впевнені, що хочете видалити цю позицію?")) return;
    setIsDeleting(true);
    try {
      await deleteOrderItem(item.productOrderId);
      onItemDelete?.(item.productOrderId);
      router.refresh();
    } catch (error) {
      console.error("Помилка видалення позиції:", error);
    } finally {
      setIsDeleting(false);
    }
  };

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

  // Обчислюємо оригінальну ціну для відображення
  const originalPrice =
    item.discount > 0 ? item.price / (1 - item.discount / 100) : item.price;

  return (
    <div className="flex items-start border-b pb-4 w-full">
      <Link href={`/product/${item.articleNumber}`} className="block">
        {item.imageUrls.length > 0 ? (
          <Image
            src={item.imageUrls[0]}
            alt={item.name}
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
              {originalPrice.toFixed(0)} грн.
            </p>
            <p className="text-red-500 font-semibold">
              {item.price.toFixed(0)} грн.
            </p>
          </div>
        ) : (
          <p className="text-red-500 font-semibold">
            {item.price.toFixed(0)} грн.
          </p>
        )}
        <div className="mt-2 flex flex-col md:flex-row md:items-center gap-4">
          {/* Селектор розміру */}
          <div className="w-40">
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Оберіть розмір" />
              </SelectTrigger>
              <SelectContent>
                {item.sizes?.map((sizeObj) => (
                  <SelectItem key={sizeObj.size} value={sizeObj.size}>
                    {sizeObj.size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Селектор кількості */}
          <div className="w-20">
            <Select
              value={selectedQuantity.toString()}
              onValueChange={(value) => setSelectedQuantity(Number(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Кількість" />
              </SelectTrigger>
              <SelectContent>
                {quantityOptions.map((q) => (
                  <SelectItem key={q} value={q.toString()}>
                    {q}
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
};

export default OrderItem;
