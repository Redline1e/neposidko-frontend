import axios from "axios";
import { Product } from "@/utils/api";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

// Отримання списку товарів
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get("/products");
    return response.data;
  } catch (error) {
    console.error("Помилка при завантаженні товарів:", error);
    throw new Error("Не вдалося завантажити товари");
  }
};

// Додавання нового товару
export const addProduct = async (product: Product): Promise<void> => {
  try {
    await api.post("/products", product);
  } catch (error) {
    console.error("Помилка при додаванні товару:", error);
    throw new Error("Не вдалося додати товар");
  }
};

// Отримання товару за articleNumber
export const fetchProductByArticle = async (
  articleNumber: string
): Promise<Product> => {
  try {
    const response = await api.get(`/product/${articleNumber}`);
    return response.data;
  } catch (error) {
    console.error(`Помилка при завантаженні товару ${articleNumber}:`, error);
    throw new Error("Не вдалося завантажити товар");
  }
};

// Пошук товарів за запитом
export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error("Помилка при пошуку товарів:", error);
    throw new Error("Не вдалося виконати пошук");
  }
};
