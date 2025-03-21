import { apiClient } from "@/utils/apiClient";
import { OrderItem, OrderItemSchema } from "@/utils/types";
import { z } from "zod";
import axios from "axios";

import { OrderItemDataSchema, OrderItemData } from "@/utils/types"; // переконайтеся, що експортуєте OrderItemDataSchema
import { getToken } from "../hooks/getToken";

export const fetchOrderItems = async (): Promise<OrderItemData[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return [];
    const response = await apiClient.get("/order-items", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return z.array(OrderItemDataSchema).parse(response.data);
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      return [];
    }
    console.error("Помилка завантаження позицій замовлення:", error);
    throw new Error("Не вдалося завантажити позиції замовлення");
  }
};

export const addOrderItem = async (
  orderItem: OrderItem
): Promise<OrderItem> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Не авторизовано");
    const response = await apiClient.post("/order-items", orderItem, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return OrderItemSchema.parse(response.data);
  } catch (error: any) {
    console.error("Помилка при додаванні позиції замовлення:", error);
    throw new Error("Не вдалося додати позицію замовлення");
  }
};

export const updateOrderItem = async (
  orderItem: OrderItem
): Promise<OrderItem> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return orderItem;
    const response = await apiClient.put(
      `/order-items/${orderItem.productOrderId}`,
      orderItem,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return OrderItemSchema.parse(response.data);
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      return orderItem;
    }
    console.error("Помилка при оновленні позиції замовлення:", error);
    throw new Error("Не вдалося оновити позицію замовлення");
  }
};

export const deleteOrderItem = async (
  productOrderId: number
): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;
    await apiClient.delete(`/order-items/${productOrderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    console.error("Помилка при видаленні позиції замовлення:", error);
    throw new Error("Не вдалося видалити позицію замовлення");
  }
};

export const fetchOrderHistoryItems = async (): Promise<OrderItem[]> => {
  const response = await fetch("http://localhost:5000/order-items/history", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) {
    throw new Error("Не вдалося завантажити позиції історії замовлень");
  }
  return response.json();
};

export const fetchCartCount = async (): Promise<number> => {
  try {
    const token = getToken();
    if (!token) return 0;
    const response = await apiClient.get("/order-items/count", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.count;
  } catch (error: any) {
    console.error("Error fetching cart count:", error);
    return 0;
  }
};
