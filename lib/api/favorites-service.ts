import axios from "axios";
import { toast } from "sonner";
import { getToken } from "../hooks/getToken";
import { Product } from "@/utils/api";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

// Додавання товару в улюблені
export const addToFavorites = async (articleNumber: string): Promise<void> => {
  try {
    const token = getToken();
    if (!token) throw new Error("Token not available");
    await api.post(
      "/favorites",
      { articleNumber },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success("Товар успішно додано до улюблених");
  } catch (error: any) {
    console.error("Помилка при додаванні товару в улюблені:", error);
    toast.error("Не вдалося додати товар до улюблених");
    throw new Error("Не вдалося додати товар в улюблені");
  }
};

// Отримання улюблених товарів користувача
export const fetchFavorites = async (): Promise<Product[]> => {
  try {
    const token = getToken();
    if (!token) {
      console.warn("Token is not available");
      return [];
    }
    const response = await api.get("/favorites", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 403) {
      console.warn(
        "Access forbidden: invalid token or insufficient permissions"
      );
      return [];
    }
    console.error("Помилка при завантаженні улюблених товарів:", error);
    return [];
  }
};

// Перевірка, чи товар знаходиться в улюблених
export const isProductFavorite = async (
  articleNumber: string
): Promise<boolean> => {
  try {
    const token = getToken();
    if (!token) throw new Error("Token not available");
    const response = await api.get(`/favorites/${articleNumber}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.isFavorite;
  } catch (error: any) {
    console.error("Помилка перевірки статусу улюбленого товару:", error);
    toast.error("Не вдалося перевірити статус улюбленого товару");
    throw new Error("Не вдалося перевірити статус улюбленого товару");
  }
};

// Видалення товару з улюблених
export const removeFromFavorites = async (
  articleNumber: string
): Promise<void> => {
  try {
    const token = getToken();
    if (!token) throw new Error("Token not available");
    await api.delete(`/favorites/${articleNumber}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("Товар успішно видалено з улюблених");
  } catch (error: any) {
    console.error("Помилка при видаленні товару з улюблених:", error);
    toast.error("Не вдалося видалити товар з улюблених");
    throw new Error("Не вдалося видалити товар з улюблених");
  }
};
