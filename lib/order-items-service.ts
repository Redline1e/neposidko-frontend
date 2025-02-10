import { OrderItem } from "@/utils/api";
import axios from "axios";

export async function fetchOrderItems(): Promise<OrderItem[]> {
  try {
    const response = await axios.get("http://localhost:5000/order-items");
    return response.data;
  } catch (error) {
    console.error("Помилка завантаження позицій замовлень:", error);
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
    const response = await axios.put(
      `http://localhost:5000/order-items/${orderItem.productOrderId}`,
      orderItem,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Помилка при оновленні позиції замовлення:", error);
    throw new Error("Не вдалося оновити позицію замовлення");
  }
}

// Нова функція для видалення позиції замовлення
export async function deleteOrderItem(productOrderId: number): Promise<void> {
  try {
    await axios.delete(`http://localhost:5000/order-items/${productOrderId}`);
  } catch (error) {
    console.error("Помилка при видаленні позиції замовлення:", error);
    throw new Error("Не вдалося видалити позицію замовлення");
  }
}
