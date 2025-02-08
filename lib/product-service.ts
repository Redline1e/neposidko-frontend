import { Product } from "@/utils/api";
import axios from "axios";

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await axios.get(`http://localhost:5000/products`);
    return response.data;
  } catch (error) {
    console.error("Помилка завантаження товарів:", error);
    throw new Error("Не вдалося завантажити товари");
  }
}

export const fetchUser = async (token: string) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Помилка отримання користувача:", error);
    throw new Error("Не вдалося отримати дані користувача");
  }
};

export const updateUser = async (
  token: string,
  name: string,
  email: string
) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/api/user`,
      { name, email },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Помилка оновлення користувача:", error);
    throw new Error("Не вдалося оновити дані користувача");
  }
};
