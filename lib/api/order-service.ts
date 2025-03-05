import axios from "axios";
import { Order } from "@/utils/api";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

export async function fetchOrders(): Promise<Order[]> {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get("/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Помилка завантаження замовлень:", error);
    throw new Error("Не вдалося завантажити замовлення");
  }
}

// Додавання нового замовлення
export async function addOrder(order: Order): Promise<Order> {
  try {
    const response = await api.post("/orders", order);
    return response.data;
  } catch (error) {
    console.error("Помилка при додаванні замовлення:", error);
    throw new Error("Не вдалося додати замовлення");
  }
}


export async function fetchAllOrders(): Promise<Order[]> {
  try {
    const response = await api.get("/orders/all");
    return response.data;
  } catch (error) {
    console.error("Помилка завантаження всіх замовлень:", error);
    throw new Error("Не вдалося завантажити всі замовлення");
  }
}
