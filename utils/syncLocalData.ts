import {
  apiClient,
  getAuthHeaders,
  extractErrorMessage,
} from "@/utils/apiClient";
import { toast } from "sonner";

export const syncLocalData = async (): Promise<void> => {
  try {
    const headers = getAuthHeaders();
    if (!headers.Authorization) {
      throw new Error("Токен автентифікації відсутній");
    }

    // Синхронізація кошика
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cart.length > 0) {
      await apiClient.post("/order-items/bulk", { items: cart }, { headers });
      localStorage.removeItem("cart");
    }

    // Синхронізація улюблених
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (favorites.length > 0) {
      await apiClient.post(
        "/favorites/bulk",
        {
          items: favorites.map((articleNumber: string) => ({ articleNumber })),
        },
        { headers }
      );
      localStorage.removeItem("favorites");
    }

    // Синхронізація сесії (якщо потрібно)
    const sessionId = localStorage.getItem("sessionId") || "unknown";
    await apiClient.patch("/orders/sync", { sessionId }, { headers });
    localStorage.removeItem("sessionId");

    toast.success("Дані успішно синхронізовано з вашим обліковим записом");
  } catch (error: any) {
    const message = extractErrorMessage(
      error,
      "Не вдалося синхронізувати дані"
    );
    console.error(message);
    toast.error(message);
    throw new Error(message);
  }
};
