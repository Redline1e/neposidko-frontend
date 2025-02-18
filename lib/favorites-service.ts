import axios from "axios";
import { toast } from "sonner";
import { getToken } from "@/utils/auth";
import { Product } from "@/utils/api";

export const addToFavorites = async (articleNumber: string): Promise<void> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token not available");
    }
    await axios.post(
      `http://localhost:5000/favorites`,
      { articleNumber },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    toast.success("Товар успішно додано до улюблених");
  } catch (error) {
    console.error("Помилка при додаванні товару в улюблені:", error);
    toast.error("Не вдалося додати товар до улюблених");
    throw new Error("Не вдалося додати товар в улюблені");
  }
};

export const fetchFavorites = async (): Promise<Product[]> => {
  try {
    const response = await axios.get("http://localhost:5000/favorites", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Помилка при завантаженні улюблених товарів:", error);
    throw new Error("Не вдалося завантажити улюблені товари");
  }
};

export const isProductFavorite = async (
  articleNumber: string
): Promise<boolean> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token not available");
    }
    const response = await axios.get(
      `http://localhost:5000/favorites/${articleNumber}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.isFavorite;
  } catch (error) {
    console.error("Помилка перевірки статусу улюбленого товару:", error);
    toast.error("Не вдалося перевірити статус улюбленого товару");
    throw new Error("Не вдалося перевірити статус улюбленого товару");
  }
};

export const removeFromFavorites = async (
  articleNumber: string
): Promise<void> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token not available");
    }
    await axios.delete(`http://localhost:5000/favorites/${articleNumber}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success("Товар успішно видалено з улюблених");
  } catch (error) {
    console.error("Помилка при видаленні товару з улюблених:", error);
    toast.error("Не вдалося видалити товар з улюблених");
    throw new Error("Не вдалося видалити товар з улюблених");
  }
};
