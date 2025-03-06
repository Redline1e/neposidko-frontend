import { apiClient } from "@/utils/apiClient";
import { OrderItem, OrderItemSchema } from "@/utils/types";
import { z } from "zod";
import axios from "axios";

import { OrderItemDataSchema, OrderItemData } from "@/utils/types"; // переконайтеся, що експортуєте OrderItemDataSchema

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
    const response = await apiClient.post("/order-items", orderItem);
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
