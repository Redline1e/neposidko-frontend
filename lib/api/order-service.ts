import { Order } from "@/utils/api";
import axios from "axios";

export async function fetchOrders(): Promise<Order[]> {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`http://localhost:5000/orders`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Помилка завантаження замовлень:", error);
    throw new Error("Не вдалося завантажити замовлення");
  }
}

export async function addOrder(order: Order): Promise<Order> {
  try {
    const response = await axios.post(`http://localhost:5000/orders`, order, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Помилка при додаванні замовлення:", error);
    throw new Error("Не вдалося додати замовлення");
  }
}
