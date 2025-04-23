import {
  apiClient,
  getAuthHeaders,
  extractErrorMessage,
} from "@/utils/apiClient";
import { Product, ProductSchema } from "@/utils/types";
import { toast } from "sonner";
import { z } from "zod";

export const addToFavorites = async (articleNumber: string): Promise<void> => {
  try {
    const headers = getAuthHeaders();
    if (headers.Authorization) {
      await apiClient.post("/favorites", { articleNumber }, { headers });
      toast.success("Товар успішно додано до улюблених");
    } else {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      if (!favorites.includes(articleNumber)) {
        favorites.push(articleNumber);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        toast.success("Товар додано до улюблених");
      } else {
        toast.info("Товар уже в улюблених");
      }
    }
    window.dispatchEvent(new Event("favoritesUpdated"));
  } catch (error) {
    const message = extractErrorMessage(
      error,
      "Не вдалося додати товар до улюблених"
    );
    console.error(message);
    toast.error(message);
    throw new Error(message);
  }
};

export const fetchFavorites = async (): Promise<Product[]> => {
  try {
    const headers = getAuthHeaders();
    if (headers.Authorization) {
      const response = await apiClient.get("/favorites", { headers });
      return z.array(ProductSchema).parse(response.data);
    }
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    return favorites;
  } catch (error) {
    const message = extractErrorMessage(
      error,
      "Не вдалося завантажити улюблені товари"
    );
    console.error(message);
    return [];
  }
};

export const isProductFavorite = async (
  articleNumber: string
): Promise<boolean> => {
  try {
    const headers = getAuthHeaders();
    if (headers.Authorization) {
      const response = await apiClient.get(`/favorites/${articleNumber}`, {
        headers,
      });
      return response.data.isFavorite;
    }
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    return favorites.includes(articleNumber);
  } catch (error) {
    const message = extractErrorMessage(
      error,
      "Не вдалося перевірити статус улюбленого товару"
    );
    console.error(message);
    return false;
  }
};

export const removeFromFavorites = async (
  articleNumber: string
): Promise<void> => {
  try {
    const headers = getAuthHeaders();
    if (headers.Authorization) {
      await apiClient.delete(`/favorites/${articleNumber}`, { headers });
      toast.success("Товар успішно видалено з улюблених");
    } else {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      const updatedFavorites = favorites.filter(
        (fav: string) => fav !== articleNumber
      );
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      toast.success("Товар видалено з улюблених");
    }
    window.dispatchEvent(new Event("favoritesUpdated"));
  } catch (error) {
    const message = extractErrorMessage(
      error,
      "Не вдалося видалити товар з улюблених"
    );
    console.error(message);
    toast.error(message);
    throw new Error(message);
  }
};

export const fetchFavoritesCount = async (): Promise<number> => {
  try {
    const headers = getAuthHeaders();
    if (headers.Authorization) {
      const response = await apiClient.get("/favorites/count", { headers });
      return response.data.count;
    }
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    return favorites.length;
  } catch (error) {
    const message = extractErrorMessage(
      error,
      "Не вдалося підрахувати улюблені товари"
    );
    console.error(message);
    return 0;
  }
};
