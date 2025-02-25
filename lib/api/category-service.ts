import axios from "axios";
import { Category } from "@/utils/api";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

// Отримання списку категорій
export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Помилка завантаження категорії:", error);
    throw new Error("Не вдалося завантажити категорії");
  }
}

// Додавання нової категорії
export const addCategory = async (category: Category): Promise<void> => {
  try {
    await api.post("/categories", category);
  } catch (error) {
    console.error("Помилка при додаванні категорії:", error);
    throw new Error("Не вдалося додати категорію");
  }
}
