import { Product } from "@/utils/api";
import axios from "axios";

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get(`http://localhost:5000/products`);
    return response.data;
  } catch (error) {
    console.error("Помилка при завантаженні товарів:", error);
    throw new Error("Не вдалося завантажити товари");
  }
};


export const addProduct = async (product: Product): Promise<void> => {
  try {
    await axios.post(`http://localhost:5000/products`, product, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Помилка при додаванні товару:", error);
    throw new Error("Не вдалося додати товар");
  }
};
