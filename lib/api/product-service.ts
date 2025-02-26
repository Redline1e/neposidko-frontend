import axios from "axios";
import { Product } from "@/utils/api";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

// Отримання всіх продуктів (без фільтрації за isActive)
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get("/products");
    return response.data;
  } catch (error) {
    console.error("Помилка при завантаженні товарів:", error);
    throw new Error("Не вдалося завантажити товари");
  }
};

// Додано: Отримання лише активних продуктів (isActive: true)
export const fetchActiveProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get("/products/active");
    return response.data;
  } catch (error) {
    console.error("Помилка при завантаженні активних товарів:", error);
    throw new Error("Не вдалося завантажити активні товари");
  }
};

// Додано: Отримання лише неактивних продуктів (isActive: false)
export const fetchInactiveProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get("/products/inactive");
    return response.data;
  } catch (error) {
    console.error("Помилка при завантаженні неактивних товарів:", error);
    throw new Error("Не вдалося завантажити неактивні товари");
  }
};

// Додавання нового продукту (при створенні isActive встановлюється як true за замовчуванням)
export const addProduct = async (product: Product): Promise<void> => {
  try {
    await api.post("/products", product);
  } catch (error) {
    console.error("Помилка при додаванні товару:", error);
    throw new Error("Не вдалося додати товар");
  }
};

// Отримання продукту за articleNumber
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

// Пошук продуктів за запитом
export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error("Помилка при пошуку товарів:", error);
    throw new Error("Не вдалося виконати пошук");
  }
};

// Оновлення даних продукту
export const updateProduct = async (product: Product): Promise<void> => {
  try {
    await api.put(`/product/${product.articleNumber}`, product);
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Не вдалося оновити товар");
  }
};

// Додавання: Зміна параметра isActive для продукту
export const updateProductActiveStatus = async (
  articleNumber: string,
  isActive: boolean
): Promise<void> => {
  try {
    await api.patch(`/product/${articleNumber}/active`, { isActive });
  } catch (error) {
    console.error("Error updating product active status:", error);
    throw new Error("Не вдалося оновити статус активності товару");
  }
};

// Видалення продукту
export const deleteProduct = async (product: Product): Promise<void> => {
  try {
    await api.delete(`/product/${product.articleNumber}`);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Не вдалося видалити товар");
  }
};
