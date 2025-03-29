import { apiClient } from "@/utils/apiClient";
import { Product, ProductSchema } from "@/utils/types";
import { toast } from "sonner";
import { getToken } from "../hooks/getToken";
import { z } from "zod";
import { fetchProductByArticle } from "./product-service";

export const addToFavorites = async (articleNumber: string): Promise<void> => {
  try {
    const token = getToken();
    if (token) {
      // Authenticated users: send to server
      await apiClient.post(
        "/favorites",
        { articleNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Товар успішно додано до улюблених");
    } else {
      // Guests: save to localStorage
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      if (!favorites.includes(articleNumber)) {
        favorites.push(articleNumber);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        toast.success("Товар додано до улюблених (локально)");
      } else {
        toast.info("Товар уже в улюблених");
      }
    }
  } catch (error: any) {
    console.error("Помилка при додаванні товару в улюблені:", error);
    toast.error("Не вдалося додати товар до улюблених");
    throw new Error("Не вдалося додати товар в улюблені");
  }
};

export const fetchFavorites = async (): Promise<Product[]> => {
  try {
    const token = getToken();
    if (token) {
      // Authenticated users: fetch from server
      const response = await apiClient.get("/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return z.array(ProductSchema).parse(response.data);
    } else {
      // Guests: fetch from localStorage
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      const products = await Promise.all(
        favorites.map((articleNumber: string) =>
          fetchProductByArticle(articleNumber)
        )
      );
      return products;
    }
  } catch (error: any) {
    console.error("Помилка при завантаженні улюблених товарів:", error);
    return [];
  }
};

export const isProductFavorite = async (
  articleNumber: string
): Promise<boolean> => {
  try {
    const token = getToken();
    if (token) {
      const response = await apiClient.get(`/favorites/${articleNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.isFavorite;
    } else {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      return favorites.includes(articleNumber);
    }
  } catch (error: any) {
    console.error("Помилка перевірки статусу улюбленого товару:", error);
    return false;
  }
};

export const removeFromFavorites = async (
  articleNumber: string
): Promise<void> => {
  try {
    const token = getToken();
    if (token) {
      await apiClient.delete(`/favorites/${articleNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Товар успішно видалено з улюблених");
    } else {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      const updatedFavorites = favorites.filter(
        (fav: string) => fav !== articleNumber
      );
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      toast.success("Товар видалено з улюблених (локально)");
    }
  } catch (error: any) {
    console.error("Помилка при видаленні товару з улюблених:", error);
    toast.error("Не вдалося видалити товар з улюблених");
    throw new Error("Не вдалося видалити товар з улюблених");
  }
};

export const fetchFavoritesCount = async (): Promise<number> => {
  try {
    const token = getToken();
    if (token) {
      const favorites = await fetchFavorites();
      return favorites.length;
    } else {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      return favorites.length;
    }
  } catch (error: any) {
    console.error("Error fetching favorites count:", error);
    return 0;
  }
};
