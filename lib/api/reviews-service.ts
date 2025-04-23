import {
  apiClient,
  getAuthHeaders,
  extractErrorMessage,
} from "@/utils/apiClient";
import { Review, ReviewSchema } from "@/utils/types";
import { z } from "zod";

export const createReview = async (reviewData: {
  articleNumber: string;
  rating: number;
  comment: string;
}): Promise<Review> => {
  try {
    const response = await apiClient.post("/reviews", reviewData, {
      headers: getAuthHeaders(),
    });
    return ReviewSchema.parse(response.data);
  } catch (error) {
    const message = extractErrorMessage(error, "Не вдалося створити відгук");
    console.error(message);
    throw new Error(message);
  }
};

export const fetchReviewsByArticle = async (
  articleNumber: string
): Promise<Review[]> => {
  try {
    const response = await apiClient.get(`/reviews/${articleNumber}`, {
      headers: getAuthHeaders(),
    });
    return z.array(ReviewSchema).parse(response.data);
  } catch (error) {
    const message = extractErrorMessage(
      error,
      "Не вдалося завантажити відгуки"
    );
    console.error(message);
    throw new Error(message);
  }
};

export const updateReview = async (
  reviewId: number,
  reviewData: { rating: number; comment: string }
): Promise<Review> => {
  try {
    const response = await apiClient.put(`/reviews/${reviewId}`, reviewData, {
      headers: getAuthHeaders(),
    });
    return ReviewSchema.parse(response.data);
  } catch (error) {
    const message = extractErrorMessage(error, "Не вдалося оновити відгук");
    console.error(message);
    throw new Error(message);
  }
};

export const deleteReview = async (reviewId: number): Promise<void> => {
  try {
    await apiClient.delete(`/reviews/${reviewId}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    const message = extractErrorMessage(error, "Не вдалося видалити відгук");
    console.error(message);
    throw new Error(message);
  }
};

export const fetchAdminReviews = async (): Promise<Review[]> => {
  try {
    const response = await apiClient.get("/admin/reviews", {
      headers: getAuthHeaders(),
    });
    return z
      .array(
        ReviewSchema.extend({
          userEmail: z.string(),
          productName: z.string(),
        })
      )
      .parse(response.data);
  } catch (error) {
    const message = extractErrorMessage(
      error,
      "Не вдалося завантажити відгуки для адміністратора"
    );
    console.error(message);
    throw new Error(message);
  }
};

export const updateAdminReview = async (
  reviewId: number,
  data: { rating: number; comment: string }
): Promise<Review> => {
  try {
    const response = await apiClient.put(`/admin/reviews/${reviewId}`, data, {
      headers: getAuthHeaders(),
    });
    return ReviewSchema.parse(response.data);
  } catch (error) {
    const message = extractErrorMessage(
      error,
      `Не вдалося оновити відгук ${reviewId}`
    );
    console.error(message);
    throw new Error(message);
  }
};

export const deleteAdminReview = async (reviewId: number): Promise<void> => {
  try {
    await apiClient.delete(`/admin/reviews/${reviewId}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    const message = extractErrorMessage(
      error,
      `Не вдалося видалити відгук ${reviewId}`
    );
    console.error(message);
    throw new Error(message);
  }
};
