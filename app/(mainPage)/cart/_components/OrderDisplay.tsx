"use client";

import React, { useEffect, useState } from "react";
import OrderItem from "./OrderItem";
import OrderTotal from "./OrderTotal";
import { OrderItemData } from "@/utils/types";
import { fetchOrderItems } from "@/lib/api/order-items-service";
import { fetchProductByArticle } from "@/lib/api/product-service";

export const OrderDisplay: React.FC = () => {
  const [orderItems, setOrderItems] = useState<OrderItemData[]>([]);

  useEffect(() => {
    const loadOrders = async () => {
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
                ...item,
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
    };

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

  const handleItemDelete = (deletedItemId: number) => {
    setOrderItems((prevItems) =>
      prevItems.filter((item) => item.productOrderId !== deletedItemId)
    );
  };

  const orderId = orderItems.length > 0 ? orderItems[0].orderId : 0;

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4">
      <div className="flex-1 space-y-4">
        <h1 className="text-2xl font-bold mb-6">Ваш кошик</h1>
        {orderItems.length > 0 ? (
          orderItems.map((item) => (
            <OrderItem
              key={item.productOrderId}
              item={item}
              onItemUpdate={handleItemUpdate}
              onItemDelete={handleItemDelete}
            />
          ))
        ) : (
          <p className="text-center text-gray-600 -mt-4">Ваш кошик порожній.</p>
        )}
      </div>
      {orderItems.length > 0 && (
        <OrderTotal
          orderItems={orderItems}
          orderId={orderId}
          onCheckoutSuccess={() => {
            setOrderItems([]);
          }}
        />
      )}
    </div>
  );
};
