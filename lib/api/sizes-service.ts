import axios from "axios";
import { Sizes } from "@/utils/api";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

// Отримання списку брендів
export async function fetchSizes(): Promise<Sizes[]> {
  try {
    const response = await api.get("/sizes");
    return response.data;
  } catch (error) {
    console.error("Помилка завантаження розмірів:", error);
    throw new Error("Не вдалося завантажити розміри");
  }
}
