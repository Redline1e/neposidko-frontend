"use client";
import { useEffect, useState } from "react";
import OrderItem from "./OrderItem";
import OrderTotal from "./OrderTotal";
import { OrderItemData } from "@/utils/types";
import { fetchOrderItems } from "@/lib/api/order-items-service";
import { fetchProductByArticle } from "@/lib/api/product-service";

export const OrderDisplay = () => {
  const [orderItems, setOrderItems] = useState<OrderItemData[]>([]);

  useEffect(() => {
    async function loadOrders() {
      try {
        const items = await fetchOrderItems();
        const enrichedItems = await Promise.all(
          items.map(async (item) => {
            try {
              const productData = await fetchProductByArticle(
                item.articleNumber
              );
              // Формуємо об’єкт, що відповідає OrderItemData
              return {
                productOrderId: item.productOrderId,
                orderId: item.orderId,
                articleNumber: item.articleNumber,
                size: item.size,
                quantity: item.quantity,
                price: productData.price,
                discount: productData.discount,
                name: productData.name,
                imageUrls: productData.imageUrls || [],
                sizes: productData.sizes || [],
              } as OrderItemData;
            } catch (error) {
              console.error(
                `Помилка отримання даних продукту для ${item.articleNumber}:`,
                error
              );
              return {
                productOrderId: item.productOrderId,
                orderId: item.orderId,
                articleNumber: item.articleNumber,
                size: item.size,
                quantity: item.quantity,
                price: 0,
                discount: 0,
                name: "Немає даних",
                imageUrls: [],
                sizes: [],
              } as OrderItemData;
            }
          })
        );
        setOrderItems(enrichedItems);
      } catch (error) {
        console.error("Помилка завантаження order items:", error);
      }
    }

    loadOrders();
  }, []);

  const handleItemUpdate = (updatedItem: OrderItemData) => {
    setOrderItems((prevItems) =>
      prevItems.map((item) =>
        item.productOrderId === updatedItem.productOrderId
          ? { ...item, ...updatedItem }
          : item
      )
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-1 space-y-4">
        {orderItems.length > 0 ? (
          orderItems.map((item) => (
            <OrderItem
              key={item.productOrderId}
              item={item}
              onItemUpdate={handleItemUpdate}
            />
          ))
        ) : (
          <p>Ваш кошик порожній.</p>
        )}
      </div>
      <OrderTotal orderItems={orderItems} />
    </div>
  );
};
