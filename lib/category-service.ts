import { Category, Product } from "@/utils/api";
import axios from "axios";

export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await axios.get(`http://localhost:5000/categories`);
    return response.data;
  } catch (error) {
    console.error("Помилка завантаження категорії:", error);
    throw new Error("Не вдалося завантажити категорії");
  }
}


export const addCategory = async (category: Category): Promise<void> => {
    try {
      await axios.post(`http://localhost:5000/categories`, category, {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Помилка при додаванні категорії:", error);
      throw new Error("Не вдалося додати категорію");
    }
  };
  