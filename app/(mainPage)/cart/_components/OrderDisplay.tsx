"use client";
import { useEffect, useState } from "react";
import OrderItem from "./OrderItem";
import OrderTotal from "./OrderTotal";
import { OrderItemData } from "@/utils/api";
import { fetchOrderItems } from "@/lib/order-items-service";
import { fetchProductByArticle } from "@/lib/product-service";

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
              return {
                ...item,
                ...productData,
                imageUrl: productData.imageUrls?.[0] || "", // Виправлення тут
              } as OrderItemData;
            } catch (error) {
              console.error(
                `Помилка отримання даних продукту для ${item.articleNumber}:`,
                error
              );
              return {
                ...item,
                price: 0,
                discount: 0,
                description: "Немає даних",
                imageUrl: "", // Виправлення тут
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
