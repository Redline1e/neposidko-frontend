import {
  apiClient,
  getAuthHeaders,
  extractErrorMessage,
} from "@/utils/apiClient";
import {
  OrderItem,
  OrderItemSchema,
  OrderItemData,
  OrderItemDataSchema,
} from "@/utils/types";
import { z } from "zod";
import { toast } from "sonner";

export const fetchOrderItems = async (): Promise<OrderItemData[]> => {
  try {
    const headers = getAuthHeaders();
    if (headers.Authorization) {
      const response = await apiClient.get("/order-items", { headers });
      return z.array(OrderItemDataSchema).parse(response.data);
    } else {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      return cart;
    }
  } catch (error: any) {
    const message = extractErrorMessage(
      error,
      "Не вдалося завантажити позиції замовлення"
    );
    console.error(message);
    return [];
  }
};

export const addOrderItem = async (
  orderItem: OrderItem
): Promise<OrderItem> => {
  try {
    const headers = getAuthHeaders();
    if (headers.Authorization) {
      const response = await apiClient.post("/order-items", orderItem, {
        headers,
      });
      window.dispatchEvent(new Event("cartUpdated"));
      return OrderItemSchema.parse(response.data);
    } else {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      orderItem.productOrderId = Date.now(); // Тимчасовий ID для гостей
      cart.push(orderItem);
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
      return orderItem;
    }
  } catch (error: any) {
    const message = extractErrorMessage(
      error,
      "Не вдалося додати позицію замовлення"
    );
    console.error(message);
    throw new Error(message);
  }
};

export const updateOrderItem = async (
  orderItem: OrderItem
): Promise<OrderItem> => {
  try {
    const headers = getAuthHeaders();
    if (headers.Authorization) {
      const response = await apiClient.put(
        `/order-items/${orderItem.productOrderId}`,
        orderItem,
        { headers }
      );
      window.dispatchEvent(new Event("cartUpdated"));
      return OrderItemSchema.parse(response.data);
    } else {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const updatedCart = cart.map((item: OrderItem) =>
        item.productOrderId === orderItem.productOrderId ? orderItem : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("cartUpdated"));
      return orderItem;
    }
  } catch (error: any) {
    const message = extractErrorMessage(
      error,
      "Не вдалося оновити позицію замовлення"
    );
    console.error(message);
    throw new Error(message);
  }
};

export const deleteOrderItem = async (
  productOrderId: number
): Promise<void> => {
  try {
    const headers = getAuthHeaders();
    if (headers.Authorization) {
      await apiClient.delete(`/order-items/${productOrderId}`, { headers });
    } else {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const updatedCart = cart.filter(
        (item: OrderItem) => item.productOrderId !== productOrderId
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
    window.dispatchEvent(new Event("cartUpdated"));
  } catch (error: any) {
    const message = extractErrorMessage(
      error,
      "Не вдалося видалити позицію замовлення"
    );
    console.error(message);
    throw new Error(message);
  }
};

export const fetchOrderHistoryItems = async (): Promise<OrderItem[]> => {
  try {
    const response = await apiClient.get("/order-items/history", {
      headers: getAuthHeaders(),
    });
    return z.array(OrderItemSchema).parse(response.data);
  } catch (error: any) {
    const message = extractErrorMessage(
      error,
      "Не вдалося завантажити історію замовлень"
    );
    console.error(message);
    throw new Error(message);
  }
};

export const fetchCartCount = async (): Promise<number> => {
  try {
    const headers = getAuthHeaders();
    if (headers.Authorization) {
      const response = await apiClient.get("/order-items/count", { headers });
      return response.data.count;
    } else {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      return cart.length;
    }
  } catch (error: any) {
    const message = extractErrorMessage(
      error,
      "Не вдалося підрахувати товари в кошику"
    );
    console.error(message);
    return 0;
  }
};
