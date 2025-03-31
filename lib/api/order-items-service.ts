import { apiClient } from "@/utils/apiClient";
import {
  OrderItem,
  OrderItemSchema,
  OrderItemData,
  OrderItemDataSchema,
} from "@/utils/types";
import { z } from "zod";
import { getToken } from "../hooks/getToken";
import { toast } from "sonner";

export const fetchOrderItems = async (): Promise<OrderItemData[]> => {
  try {
    const token = getToken();
    if (token) {
      const response = await apiClient.get("/order-items", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return z.array(OrderItemDataSchema).parse(response.data);
    } else {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      return cart;
    }
  } catch (error: any) {
    console.error("Помилка завантаження позицій замовлення:", error);
    return [];
  }
};

export const addOrderItem = async (
  orderItem: OrderItem
): Promise<OrderItem> => {
  try {
    const token = getToken();
    if (token) {
      const response = await apiClient.post("/order-items", orderItem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.dispatchEvent(new Event("cartUpdated")); // Сповіщаємо про зміну
      return OrderItemSchema.parse(response.data);
    } else {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      orderItem.productOrderId = Date.now(); // Тимчасовий ID для гостей
      cart.push(orderItem);
      localStorage.setItem("cart", JSON.stringify(cart));
      toast.success("Товар додано до кошика (локально)");
      window.dispatchEvent(new Event("cartUpdated")); // Сповіщаємо про зміну
      return orderItem;
    }
  } catch (error: any) {
    console.error("Помилка при додаванні позиції замовлення:", error);
    throw new Error("Не вдалося додати позицію замовлення");
  }
};

export const updateOrderItem = async (
  orderItem: OrderItem
): Promise<OrderItem> => {
  try {
    const token = getToken();
    if (token) {
      const response = await apiClient.put(
        `/order-items/${orderItem.productOrderId}`,
        orderItem,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.dispatchEvent(new Event("cartUpdated")); // Сповіщаємо про зміну
      return OrderItemSchema.parse(response.data);
    } else {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const updatedCart = cart.map((item: OrderItem) =>
        item.productOrderId === orderItem.productOrderId ? orderItem : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("cartUpdated")); // Сповіщаємо про зміну
      return orderItem;
    }
  } catch (error: any) {
    console.error("Помилка при оновленні позиції замовлення:", error);
    throw new Error("Не вдалося оновити позицію замовлення");
  }
};

export const deleteOrderItem = async (
  productOrderId: number
): Promise<void> => {
  try {
    const token = getToken();
    if (token) {
      await apiClient.delete(`/order-items/${productOrderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const updatedCart = cart.filter(
        (item: OrderItem) => item.productOrderId !== productOrderId
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
    window.dispatchEvent(new Event("cartUpdated")); // Сповіщаємо про зміну
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
    if (token) {
      const response = await apiClient.get("/order-items/count", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.count;
    } else {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      return cart.length;
    }
  } catch (error: any) {
    console.error("Помилка підрахунку товарів у кошику:", error);
    return 0;
  }
};
