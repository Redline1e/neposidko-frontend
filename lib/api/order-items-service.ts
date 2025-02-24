import { OrderItem } from "@/utils/api";
import axios from "axios";

export async function fetchOrderItems(): Promise<OrderItem[]> {
  try {
    const token = localStorage.getItem("token");
    // Якщо токена немає, повертаємо порожній масив без спроби виклику API
    if (!token) {
      return [];
    }
    const response = await axios.get("http://localhost:5000/order-items", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    // Якщо статус помилки 403, повертаємо порожній масив
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      return [];
    }
    console.error("Помилка завантаження позицій замовлення:", error);
    throw new Error("Не вдалося завантажити позиції замовлення");
  }
}

export async function addOrderItem(orderItem: OrderItem): Promise<OrderItem> {
  try {
    const response = await axios.post(
      "http://localhost:5000/order-items",
      orderItem,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Помилка при додаванні позиції замовлення:", error);
    throw new Error("Не вдалося додати позицію замовлення");
  }
}

export async function updateOrderItem(
  orderItem: OrderItem
): Promise<OrderItem> {
  try {
    const token = localStorage.getItem("token");
    // Якщо токена немає, просто повертаємо отриманий об'єкт без спроби оновлення
    if (!token) {
      return orderItem;
    }
    const response = await axios.put(
      `http://localhost:5000/order-items/${orderItem.productOrderId}`,
      orderItem,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    // Якщо статус помилки 403, повертаємо об'єкт без змін
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      return orderItem;
    }
    console.error("Помилка при оновленні позиції замовлення:", error);
    throw new Error("Не вдалося оновити позицію замовлення");
  }
}


export async function deleteOrderItem(productOrderId: number): Promise<void> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    await axios.delete(`http://localhost:5000/order-items/${productOrderId}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      return;
    }
    console.error("Помилка при видаленні позиції замовлення:", error);
    throw new Error("Не вдалося видалити позицію замовлення");
  }
}
