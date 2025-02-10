import { Brand } from "@/utils/api";
import axios from "axios";

export async function fetchBrands(): Promise<Brand[]> {
  try {
    const response = await axios.get("http://localhost:5000/brands");
    return response.data;
  } catch (error) {
    console.error("Помилка завантаження брендів:", error);
    throw new Error("Не вдалося завантажити бренди");
  }
}

export const addBrand = async (brand: Brand): Promise<void> => {
  try {
    await axios.post("http://localhost:5000/brands", brand, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Помилка при додаванні бренду:", error);
    throw new Error("Не вдалося додати бренд");
  }
};
