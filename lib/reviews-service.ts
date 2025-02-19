import axios from "axios";
import { Review } from "@/utils/api";

// Створення нового відгуку
export const createReview = async (reviewData: {
  articleNumber: string;
  rating: number;
  comment: string;
}): Promise<Review> => {
  try {
    const response = await axios.post(
      "http://localhost:5000/reviews",
      reviewData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
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
    const response = await axios.get(
      `http://localhost:5000/reviews/${articleNumber}`
    );
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
    const response = await axios.put(
      `http://localhost:5000/reviews/${reviewId}`,
      reviewData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Помилка при оновленні відгуку:", error);
    throw new Error("Не вдалося оновити відгук");
  }
};

// Видалення відгуку (тільки для власника)
export const deleteReview = async (reviewId: number): Promise<void> => {
  try {
    await axios.delete(`http://localhost:5000/reviews/${reviewId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (error) {
    console.error("Помилка при видаленні відгуку:", error);
    throw new Error("Не вдалося видалити відгук");
  }
};
