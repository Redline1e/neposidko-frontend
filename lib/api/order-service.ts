import { apiClient } from "@/utils/apiClient";
import { Order, OrderSchema } from "@/utils/types";
import { z } from "zod";

export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const token = localStorage.getItem("token");
    const response = await apiClient.get("/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return z.array(OrderSchema).parse(response.data);
  } catch (error: any) {
    console.error("Помилка завантаження замовлень:", error);
    throw new Error("Не вдалося завантажити замовлення");
  }
};

export const addOrder = async (order: Order): Promise<Order> => {
  try {
    const response = await apiClient.post("/orders", order);
    return OrderSchema.parse(response.data);
  } catch (error: any) {
    console.error("Помилка при додаванні замовлення:", error);
    throw new Error("Не вдалося додати замовлення");
  }
};

export const fetchAllOrders = async (): Promise<Order[]> => {
  try {
    const response = await apiClient.get("/orders/all");
    return z.array(OrderSchema).parse(response.data);
  } catch (error: any) {
    console.error("Помилка завантаження всіх замовлень:", error);
    throw new Error("Не вдалося завантажити всі замовлення");
  }
};
