import axios from "axios";
import { Review } from "@/utils/api";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

// Створення нового відгуку
export const createReview = async (reviewData: {
  articleNumber: string;
  rating: number;
  comment: string;
}): Promise<Review> => {
  try {
    const response = await api.post("/reviews", reviewData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    console.error("Помилка при створенні відгуку:", error);
    throw new Error("Не вдалося створити відгук");
  }
};

// Отримання відгуків для заданого товару
export const fetchReviewsByArticle = async (
  articleNumber: string
): Promise<Review[]> => {
  try {
    const response = await api.get(`/reviews/${articleNumber}`);
    return response.data;
  } catch (error) {
    console.error("Помилка при завантаженні відгуків:", error);
    throw new Error("Не вдалося завантажити відгуки");
  }
};

// Оновлення відгуку (тільки для власника)
export const updateReview = async (
  reviewId: number,
  reviewData: { rating: number; comment: string }
): Promise<Review> => {
  try {
    const response = await api.put(`/reviews/${reviewId}`, reviewData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    console.error("Помилка при оновленні відгуку:", error);
    throw new Error("Не вдалося оновити відгук");
  }
};

// Видалення відгуку (тільки для власника)
export const deleteReview = async (reviewId: number): Promise<void> => {
  try {
    await api.delete(`/reviews/${reviewId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  } catch (error) {
    console.error("Помилка при видаленні відгуку:", error);
    throw new Error("Не вдалося видалити відгук");
  }
};
