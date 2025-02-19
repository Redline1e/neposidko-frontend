import { Product } from "@/utils/api";
import axios from "axios";

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get("http://localhost:5000/products");
    return response.data;
  } catch (error) {
    console.error("Помилка при завантаженні товарів:", error);
    throw new Error("Не вдалося завантажити товари");
  }
};



export const addProduct = async (product: Product): Promise<void> => {
  try {
    await axios.post("http://localhost:5000/products", product, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Помилка при додаванні товару:", error);
    throw new Error("Не вдалося додати товар");
  }
};

export const fetchProductByArticle = async (
  articleNumber: string
): Promise<Product> => {
  try {
    const response = await axios.get(
      `http://localhost:5000/product/${articleNumber}`
    );
    return response.data;
  } catch (error) {
    console.error(`Помилка при завантаженні товару ${articleNumber}:`, error);
    throw new Error("Не вдалося завантажити товар");
  }
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const response = await axios.get(
      `http://localhost:5000/search?q=${encodeURIComponent(query)}`
    );
    return response.data;
  } catch (error) {
    console.error("Помилка при пошуку товарів:", error);
    throw new Error("Не вдалося виконати пошук");
  }
};
