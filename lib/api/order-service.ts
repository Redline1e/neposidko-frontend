import { apiClient } from "@/utils/apiClient";
import { Order, OrderItem, OrderSchema } from "@/utils/types";
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
export const fetchOrderHistory = async (): Promise<Order[]> => {
    try {
      const response = await fetch("http://localhost:5000/orders/history", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      console.log("Response status:", response.status); // Логування статусу
  
      const text = await response.text(); // Читаємо тіло відповіді як текст один раз
      console.log("Response data:", text); // Логування тіла відповіді
  
      if (!response.ok) {
        throw new Error("Не вдалося завантажити історію замовлень");
      }
  
      if (!text) {
        throw new Error("Порожня відповідь від сервера");
      }
  
      const data = JSON.parse(text); // Парсимо текст у JSON
      return data;
    } catch (error) {
      console.error("Помилка отримання історії замовлень:", error);
      throw error;
    }
  };
  
