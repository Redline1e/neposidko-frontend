import axios from "axios";
import { Brand } from "@/utils/api";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

// Отримання списку брендів
export async function fetchBrands(): Promise<Brand[]> {
  try {
    const response = await api.get("/brands");
    return response.data;
  } catch (error) {
    console.error("Помилка завантаження брендів:", error);
    throw new Error("Не вдалося завантажити бренди");
  }
}

// Додавання нового бренду
export const addBrand = async (brand: Brand): Promise<void> => {
  try {
    await api.post("/brands", brand);
  } catch (error) {
    console.error("Помилка при додаванні бренду:", error);
    throw new Error("Не вдалося додати бренд");
  }
};

// Отримання даних бренду за ID
export const fetchBrandById = async (brandId: number): Promise<Brand> => {
  try {
    const response = await api.get(`/brand/${brandId}`);
    return response.data;
  } catch (error) {
    console.error(`Помилка при завантаженні бренду ${brandId}:`, error);
    throw new Error("Не вдалося завантажити бренд");
  }
};
