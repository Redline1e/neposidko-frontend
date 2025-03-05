import axios from "axios";
import { OrderItem } from "@/utils/api";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

export async function fetchOrderItems(): Promise<OrderItem[]> {
  try {
    const token = localStorage.getItem("token");
    if (!token) return [];
    const response = await api.get("/order-items", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      return [];
    }
    console.error("Помилка завантаження позицій замовлення:", error);
    throw new Error("Не вдалося завантажити позиції замовлення");
  }
}

// Додавання позиції замовлення
export async function addOrderItem(orderItem: OrderItem): Promise<OrderItem> {
  try {
    const response = await api.post("/order-items", orderItem);
    return response.data;
  } catch (error) {
    console.error("Помилка при додаванні позиції замовлення:", error);
    throw new Error("Не вдалося додати позицію замовлення");
  }
}

// Оновлення позиції замовлення
export async function updateOrderItem(
  orderItem: OrderItem
): Promise<OrderItem> {
  try {
    const token = localStorage.getItem("token");
    if (!token) return orderItem;
    const response = await api.put(
      `/order-items/${orderItem.productOrderId}`,
      orderItem,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      return orderItem;
    }
    console.error("Помилка при оновленні позиції замовлення:", error);
    throw new Error("Не вдалося оновити позицію замовлення");
  }
}

// Видалення позиції замовлення
export async function deleteOrderItem(productOrderId: number): Promise<void> {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;
    await api.delete(`/order-items/${productOrderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      return;
    }
    console.error("Помилка при видаленні позиції замовлення:", error);
    throw new Error("Не вдалося видалити позицію замовлення");
  }
}
