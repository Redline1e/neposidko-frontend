import { z } from "zod";
import { Product, ProductSchema } from "@/utils/types";
import {
  apiClient,
  getAuthHeaders,
  extractErrorMessage,
} from "@/utils/apiClient";
import { toast } from "sonner";
import { getToken } from "@/lib/hooks/getToken";

// Функція для отримання улюблених товарів
export const fetchFavorites = async (): Promise<Product[]> => {
  try {
    const token = getToken();
    if (token) {
      const response = await apiClient.get("/favorites", {
        headers: getAuthHeaders(),
      });
      return z.array(ProductSchema).parse(response.data);
    } else {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      if (favorites.length > 0) {
        const productsData = await fetchProductsByArticleNumbers(favorites);
        return productsData;
      }
      return [];
    }
  } catch (error) {
    const message = extractErrorMessage(
      error,
      "Не вдалося завантажити улюблені товари"
    );
    return [];
  }
};

// Функція для отримання товарів за списком артикулів
export const fetchProductsByArticleNumbers = async (
  articleNumbers: string[]
): Promise<Product[]> => {
  try {
    if (!articleNumbers || articleNumbers.length === 0) {
      return [];
    }
    const response = await apiClient.post("/products/by-articles", {
      articleNumbers,
    });
    return z.array(ProductSchema).parse(response.data);
  } catch (error) {
    const message = extractErrorMessage(error, "Не вдалося завантажити товари");
    return [];
  }
};

// Функція для додавання товару до улюблених
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
    toast.error(message);
    throw new Error(message);
  }
};

// Функція для видалення товару з улюблених
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
    toast.error(message);
    throw new Error(message);
  }
};

// Функція для отримання кількості улюблених товарів
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
    return 0;
  }
};
