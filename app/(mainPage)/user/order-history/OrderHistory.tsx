"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Order, OrderItem } from "@/utils/types";
import { fetchOrderHistory } from "@/lib/api/order-service";
import { fetchOrderHistoryItems } from "@/lib/api/order-items-service";
import { Loader2 } from "lucide-react";
import Head from "next/head";

interface ExtendedOrderItem extends OrderItem {
  name?: string;
  imageUrls?: string[];
}

interface ExtendedOrder extends Order {
  orderItems: ExtendedOrderItem[];
}

const STATUS_STYLES: Record<number, string> = {
  2: "bg-yellow-100 text-yellow-800",
  3: "bg-blue-100 text-blue-800",
  4: "bg-purple-100 text-purple-800",
  5: "bg-green-100 text-green-800",
  6: "bg-red-100 text-red-800",
};

const STATUS_LABELS: Record<number, string> = {
  2: "В обробці",
  3: "Прийнято",
  4: "Відправлено",
  5: "Доставлено",
  6: "Скасовано",
};

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<ExtendedOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersData = await fetchOrderHistory();
        const orderItemsData = await fetchOrderHistoryItems();

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
        setError("Не вдалося завантажити історію замовлень");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loader2 className="animate-spin h-10 w-10" />;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="w-full max-w-[800px] mx-auto p-4 sm:p-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
          Історія замовлень
        </h1>
        {orders.length === 0 ? (
          <p className="text-gray-500 text-center">
            У вас ще немає виконаних замовлень.
          </p>
        ) : (
          orders.map((order) => {
            const statusId = order.orderStatusId || 2; // Default to "В обробці" if status is missing
            const statusStyle =
              STATUS_STYLES[statusId] || "bg-gray-100 text-gray-800";
            const statusLabel = STATUS_LABELS[statusId] || "Невідомий статус";

            return (
              <div
                key={order.orderId}
                className="border rounded-lg p-4 shadow-lg bg-white mb-6"
              >
                <div className="flex flex-wrap justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    Замовлення #{order.orderId}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyle}`}
                  >
                    {statusLabel}
                  </span>
                </div>
                <div className="mt-2">
                  <h3 className="font-semibold mb-2">Товари в замовленні:</h3>
                  {order.orderItems && order.orderItems.length > 0 ? (
                    <ul className="space-y-3">
                      {order.orderItems.map((item) => {
                        const productImage =
                          item.imageUrls && item.imageUrls.length > 0
                            ? item.imageUrls[0]
                            : "/placeholder-product.png";
                        const productName = item.name || item.articleNumber;
                        return (
                          <li
                            key={item.productOrderId}
                            className="flex flex-row items-center p-2 border rounded-lg bg-gray-50 space-x-4"
                          >
                            <div className="relative w-20 h-20">
                              <Image
                                src={productImage}
                                alt={productName}
                                fill
                                sizes="(max-width: 80px) 100vw"
                                className="object-cover rounded-lg"
                                quality={80}
                              />
                            </div>
                            <div className="text-left">
                              <p className="font-semibold">{productName}</p>
                              <p className="text-gray-600 text-sm">
                                Артикул: {item.articleNumber}
                              </p>
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
            );
          })
        )}
      </div>
    </>
  );
};

export default OrderHistory;
