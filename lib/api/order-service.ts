import {
  apiClient,
  getAuthHeaders,
  extractErrorMessage,
} from "@/utils/apiClient";
import { Order, OrderSchema } from "@/utils/types";
import { z } from "zod";

export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const response = await apiClient.get("/orders", {
      headers: getAuthHeaders(),
    });
    return z.array(OrderSchema).parse(response.data);
  } catch (error: any) {
    const message = extractErrorMessage(
      error,
      "Не вдалося завантажити замовлення"
    );
    console.error(message);
    throw new Error(message);
  }
};

export const addOrder = async (order: Order): Promise<Order> => {
  try {
    const response = await apiClient.post("/orders", order, {
      headers: getAuthHeaders(),
    });
    return OrderSchema.parse(response.data);
  } catch (error: any) {
    const message = extractErrorMessage(error, "Не вдалося додати замовлення");
    console.error(message);
    throw new Error(message);
  }
};

export const fetchAllOrders = async (): Promise<Order[]> => {
  try {
    const response = await apiClient.get("/orders/all", {
      headers: getAuthHeaders(),
    });
    return z.array(OrderSchema).parse(response.data);
  } catch (error: any) {
    const message = extractErrorMessage(
      error,
      "Не вдалося завантажити всі замовлення"
    );
    console.error(message);
    throw new Error(message);
  }
};

export const fetchOrderHistory = async (): Promise<Order[]> => {
  try {
    const response = await apiClient.get("/orders/history", {
      headers: getAuthHeaders(),
    });
    return z.array(OrderSchema).parse(response.data);
  } catch (error: any) {
    const message = extractErrorMessage(
      error,
      "Не вдалося завантажити історію замовлень"
    );
    console.error(message);
    throw new Error(message);
  }
};

export const fetchAdminOrders = async () => {
  try {
    const response = await apiClient.get("/admin/orders", {
      headers: getAuthHeaders(),
    });
    return z
      .array(
        OrderSchema.extend({
          userEmail: z.string(),
          statusName: z.string(),
          deliveryAddress: z.string().nullable(),
          telephone: z.string().nullable(),
          paymentMethod: z.string().nullable(),
        })
      )
      .parse(response.data);
  } catch (error: any) {
    const message = extractErrorMessage(
      error,
      "Не вдалося завантажити замовлення для адміністратора"
    );
    console.error(message);
    throw new Error(message);
  }
};

export const fetchAdminOrderDetails = async (orderId: number) => {
  try {
    const response = await apiClient.get(`/admin/orders/${orderId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error: any) {
    const message = extractErrorMessage(
      error,
      `Не вдалося завантажити деталі замовлення ${orderId}`
    );
    console.error(message);
    throw new Error(message);
  }
};

export const updateAdminOrder = async (
  orderId: number,
  data: Partial<Order>
) => {
  try {
    const response = await apiClient.put(`/admin/orders/${orderId}`, data, {
      headers: getAuthHeaders(),
    });
    return OrderSchema.parse(response.data);
  } catch (error: any) {
    const message = extractErrorMessage(
      error,
      `Не вдалося оновити замовлення ${orderId}`
    );
    console.error(message);
    throw new Error(message);
  }
};

export const deleteAdminOrder = async (orderId: number) => {
  try {
    await apiClient.delete(`/admin/orders/${orderId}`, {
      headers: getAuthHeaders(),
    });
  } catch (error: any) {
    const message = extractErrorMessage(
      error,
      `Не вдалося видалити замовлення ${orderId}`
    );
    console.error(message);
    throw new Error(message);
  }
};
