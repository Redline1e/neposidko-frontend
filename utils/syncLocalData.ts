import { apiClient } from "@/utils/apiClient";
import { toast } from "sonner";

export const syncLocalData = async (token: string) => {
  try {
    // Синхронізація кошика
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cart.length > 0) {
      await apiClient.post(
        "/order-items/bulk", // Використовуємо масовий ендпоінт
        { items: cart },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("cart"); // Очищаємо після успіху
    }

    // Синхронізація улюблених
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (favorites.length > 0) {
      await apiClient.post(
        "/favorites/bulk", // Використовуємо масовий ендпоінт
        {
          items: favorites.map((articleNumber: string) => ({ articleNumber })),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("favorites"); // Очищаємо після успіху
    }

    // Синхронізація сесії (якщо потрібно)
    const sessionId = localStorage.getItem("sessionId") || "unknown";
    await apiClient.patch(
      "/orders/sync",
      { sessionId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    localStorage.removeItem("sessionId");

    toast.success("Дані успішно синхронізовано з вашим обліковим записом");
  } catch (error: any) {
    console.error("Помилка синхронізації:", error);
    toast.error("Не вдалося синхронізувати дані");
    throw error; // Кидаємо помилку, щоб обробити її в компонентах
  }
};
