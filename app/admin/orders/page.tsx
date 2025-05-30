"use client";
import React, { useState, useEffect } from "react";
import {
  fetchAdminOrders,
  updateAdminOrder,
  deleteAdminOrder,
  fetchAdminOrderDetails,
} from "@/lib/api/order-service";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import Head from "next/head";

interface OrderItem {
  orderItemId: number;
  orderId: number;
  articleNumber: string;
  quantity: number;
  price: number | null;
  size: string;
}

interface Order {
  orderId: number;
  userId: string | null;
  orderStatusId: number | null;
  orderDate: string;
  userEmail: string | null;
  statusName?: string;
  deliveryAddress?: string;
  telephone?: string;
  paymentMethod?: string;
  items?: OrderItem[];
}

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const ordersList = await fetchAdminOrders();
        const filteredOrders = ordersList.filter(
          (order) => order.orderStatusId !== 1
        );

        const ordersWithDetails = await Promise.all(
          filteredOrders.map(async (order) => {
            const details = await fetchAdminOrderDetails(order.orderId);
            return {
              ...order,
              ...details,
              items: details.items,
              userId: order.userId,
            } as Order;
          })
        );

        setOrders(ordersWithDetails);
      } catch (error) {
        console.error("Помилка завантаження:", error);
      }
    };

    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: number) => {
    try {
      await updateAdminOrder(orderId, { orderStatusId: newStatus });
      setOrders(
        orders.map((o) =>
          o.orderId === orderId ? { ...o, orderStatusId: newStatus } : o
        )
      );
    } catch (error) {
      console.error("Помилка оновлення статусу:", error);
      alert("Не вдалося оновити статус замовлення");
    }
  };

  const handleDelete = async (orderId: number) => {
    try {
      await deleteAdminOrder(orderId);
      setOrders(orders.filter((o) => o.orderId !== orderId));
    } catch (error) {
      console.error("Помилка видалення:", error);
    }
  };

  const toggleOrderDetails = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const formatPrice = (price: number | null): string => {
    if (price === null || price === undefined) return "Невідомо";
    return `${price.toFixed(2)} грн`;
  };

  return (
    <div className="mx-auto mt-20 max-w-7xl px-4">
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <h1 className="text-2xl font-bold mb-6">Управління замовленнями</h1>
      <table className="w-full border rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left w-64">Користувач</th>
            <th className="px-4 py-3 text-left">Статус</th>
            <th className="px-4 py-3 text-left">Дата</th>
            <th className="px-4 py-3 text-left">Адреса доставки</th>
            <th className="px-4 py-3 text-left">Телефон</th>
            <th className="px-4 py-3 text-left">Спосіб оплати</th>
            <th className="px-4 py-3 text-left">Дії</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <React.Fragment key={order.orderId}>
              <tr className="border-t">
                <td className="px-4 py-3">{order.orderId}</td>
                <td className="px-4 py-3">{order.userEmail}</td>
                <td className="px-4 py-3">
                  <select
                    value={order.orderStatusId ?? ""}
                    onChange={(e) =>
                      handleStatusChange(order.orderId, Number(e.target.value))
                    }
                    className="border rounded p-1"
                  >
                    <option value={2}>В обробці</option>
                    <option value={3}>Прийнято</option>
                    <option value={4}>Відправлено</option>
                    <option value={5}>Доставлено</option>
                    <option value={6}>Скасовано</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  {new Date(order.orderDate).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  {order.deliveryAddress ?? "Не вказано"}
                </td>
                <td className="px-4 py-3">{order.telephone ?? "Не вказано"}</td>
                <td className="px-4 py-3">
                  {order.paymentMethod ?? "Не вказано"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button onClick={() => toggleOrderDetails(order.orderId)}>
                      {expandedOrderId === order.orderId
                        ? "Приховати"
                        : "Показати товари"}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Ви впевнені?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Ця дія видалить замовлення назавжди. Продовжити?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Скасувати</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(order.orderId)}
                          >
                            Видалити
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
              {expandedOrderId === order.orderId && order.items && (
                <tr key={`${order.orderId}-details`}>
                  <td colSpan={8} className="px-4 py-2 bg-gray-50">
                    <div>
                      <h3 className="font-semibold">Товари в замовленні:</h3>
                      <ul>
                        {order.items.map((item, idx) => (
                          <li
                            key={`${order.orderId}-${item.articleNumber}-${item.size}-${idx}`}
                          >
                            {item.articleNumber} - Кількість: {item.quantity},
                            Ціна: {formatPrice(item.price)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrdersPage;
