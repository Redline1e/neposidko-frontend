import axios from "axios";
import { getToken } from "@/utils/auth";
import { Product } from "@/utils/api";

export const addToFavorites = async (articleNumber: string): Promise<void> => {
  try {
    const token = getToken(); // Retrieve the token (you can replace this with your own logic)

    if (!token) {
      throw new Error("Token not available");
    }

    await axios.post(
      `http://localhost:5000/favorites`,
      { articleNumber },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the token here
        },
      }
    );
  } catch (error) {
    console.error("Помилка при додаванні товару в улюблені:", error);
    throw new Error("Не вдалося додати товар в улюблені");
  }
};

// Fetch favorite products of the user
export const fetchFavorites = async (): Promise<Product[]> => {
  try {
    const response = await axios.get("http://localhost:5000/favorites", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure the token is passed
      },
    });
    return response.data;
  } catch (error) {
    console.error("Помилка при завантаженні улюблених товарів:", error);
    throw new Error("Не вдалося завантажити улюблені товари");
  }
};
