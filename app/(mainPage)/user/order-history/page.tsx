"use client";

import React, { useEffect, useState } from "react";
import { Order, OrderItem } from "@/utils/types";
import { fetchOrders } from "@/lib/api/order-service";
import { fetchOrderItems } from "@/lib/api/order-items-service";

interface ExtendedOrderItem extends OrderItem {
  name?: string;
  imageUrls?: string[];
}

interface ExtendedOrder extends Order {
  orderItems: ExtendedOrderItem[];
  userName?: string;
}

const STATUS_STYLES: Record<number, string> = {
  1: "bg-blue-100 text-blue-800",
  2: "bg-yellow-100 text-yellow-800",
  3: "bg-orange-100 text-orange-800",
  4: "bg-purple-100 text-purple-800",
  5: "bg-green-100 text-green-800",
  6: "bg-red-100 text-red-800",
  7: "bg-gray-100 text-gray-800",
  8: "bg-black text-white",
};

const STATUS_LABELS: Record<number, string> = {
  1: "Нове замовлення",
  2: "В обробці",
  3: "Очікує оплати",
  4: "Відправлене",
  5: "Доставлене",
  6: "Повернене",
  7: "Виконане",
  8: "Відмінене",
};

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<ExtendedOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersData = await fetchOrders();
        const orderItemsData = await fetchOrderItems();

        const orderItemsByOrderId = orderItemsData.reduce(
          (acc, item: ExtendedOrderItem) => {
            if (!acc[item.orderId]) {
              acc[item.orderId] = [];
            }
            acc[item.orderId].push(item);
            return acc;
          },
          {} as Record<number, ExtendedOrderItem[]>
        );

        const extendedOrders: ExtendedOrder[] = ordersData.map((order) => ({
          ...order,
          orderItems: orderItemsByOrderId[order.orderId || 0] || [],
        }));

        setOrders(extendedOrders);
      } catch (error) {
        console.error("Помилка завантаження даних:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Завантаження...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Історія замовлень
      </h1>
      {orders.length === 0 ? (
        <p className="text-gray-500 text-center">У вас ще немає замовлень.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.orderId}
            className="border rounded-lg p-4 shadow-lg bg-white mb-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Замовлення #{order.orderId}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  STATUS_STYLES[order.orderStatusId || 1]
                }`}
              >
                {STATUS_LABELS[order.orderStatusId || 1]}
              </span>
            </div>
            {order.userName && (
              <div className="mb-4 text-gray-700">
                <p>
                  <span className="font-medium">Замовник:</span> {order.userName}
                </p>
              </div>
            )}
            <div className="mt-2">
              <h3 className="font-semibold mb-2">Товари в замовленні:</h3>
              {order.orderItems && order.orderItems.length > 0 ? (
                <ul className="space-y-3">
                  {order.orderItems.map((item) => {
                    const productImage =
                      item.imageUrls && item.imageUrls.length > 0
                        ? item.imageUrls[0]
                        : "https://via.placeholder.com/50";
                    const productName = item.name || item.articleNumber;
                    return (
                      <li
                        key={item.productOrderId}
                        className="flex items-center space-x-4 p-2 border rounded-lg bg-gray-50"
                      >
                        <img
                          src={productImage}
                          alt={productName}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div>
                          <p className="font-semibold">{productName}</p>
                          {item.size && (
                            <p className="text-gray-600 text-sm">
                              Розмір: {item.size}
                            </p>
                          )}
                          <p className="text-gray-600 text-sm">
                            Кількість: {item.quantity}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">
                  Немає товарів у замовленні.
                </p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
