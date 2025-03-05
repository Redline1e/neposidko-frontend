import { apiClient } from "@/utils/apiClient";
import { Review, ReviewSchema } from "@/utils/types";
import { z } from "zod";
import axios from "axios";

// Створення відгуку
export const createReview = async (reviewData: {
  articleNumber: string;
  rating: number;
  comment: string;
}): Promise<Review> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Токен не знайдено");
    const response = await apiClient.post("/reviews", reviewData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return ReviewSchema.parse(response.data);
  } catch (error: any) {
    console.error("Помилка при створенні відгуку:", error);
    throw new Error("Не вдалося створити відгук");
  }
};

export const fetchReviewsByArticle = async (articleNumber: string): Promise<Review[]> => {
  try {
    const response = await apiClient.get(`/reviews/${articleNumber}`);
    return z.array(ReviewSchema).parse(response.data);
  } catch (error: any) {
    console.error("Помилка при завантаженні відгуків:", error);
    throw new Error("Не вдалося завантажити відгуки");
  }
};

export const updateReview = async (
  reviewId: number,
  reviewData: { rating: number; comment: string }
): Promise<Review> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Токен не знайдено");
    const response = await apiClient.put(`/reviews/${reviewId}`, reviewData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return ReviewSchema.parse(response.data);
  } catch (error: any) {
    console.error("Помилка при оновленні відгуку:", error);
    throw new Error("Не вдалося оновити відгук");
  }
};

export const deleteReview = async (reviewId: number): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Токен не знайдено");
    await apiClient.delete(`/reviews/${reviewId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    console.error("Помилка при видаленні відгуку:", error);
    throw new Error("Не вдалося видалити відгук");
  }
};
