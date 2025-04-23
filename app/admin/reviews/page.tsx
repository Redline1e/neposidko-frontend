"use client";
import React, { useState, useEffect } from "react";
import {
  fetchAdminReviews,
  updateAdminReview,
  deleteAdminReview,
} from "@/lib/api/reviews-service";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

// Визначення типу Review
interface Review {
  reviewId: number;
  userId: string;
  articleNumber: string;
  rating: number;
  comment: string;
  reviewDate: string;
  userEmail?: string;
  productName?: string;
}

const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await fetchAdminReviews();
        setReviews(data);
      } catch (error) {
        console.error("Помилка завантаження коментарів:", error);
      }
    };
    loadReviews();
  }, []);

  const handleUpdate = async (
    reviewId: number,
    rating: number,
    comment: string
  ) => {
    try {
      await updateAdminReview(reviewId, { rating, comment });
      setReviews(
        reviews.map((r) =>
          r.reviewId === reviewId ? { ...r, rating, comment } : r
        )
      );
    } catch (error) {
      console.error("Помилка оновлення:", error);
    }
  };

  const handleDelete = async (reviewId: number) => {
    try {
      await deleteAdminReview(reviewId);
      setReviews(reviews.filter((r) => r.reviewId !== reviewId));
    } catch (error) {
      console.error("Помилка видалення:", error);
    }
  };

  return (
    <div className="mx-auto mt-20 max-w-7xl px-4">
      <h1 className="text-2xl font-bold mb-6">Управління коментарями</h1>
      <table className="w-full border rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Користувач</th>
            <th className="px-4 py-3 text-left">Товар</th>
            <th className="px-4 py-3 text-left">Артикул</th>
            <th className="px-4 py-3 text-left">Рейтинг</th>
            <th className="px-4 py-3 text-left">Коментар</th>
            <th className="px-4 py-3 text-left">Дії</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.reviewId} className="border-t">
              <td className="px-4 py-3">{review.reviewId}</td>
              <td className="px-4 py-3">
                {review.userEmail ?? "Невідомий користувач"}
              </td>
              <td className="px-4 py-3">
                {review.productName ?? "Невідомий товар"}
              </td>
              <td className="px-4 py-3">{review.articleNumber}</td>
              <td className="px-4 py-3">
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={review.rating}
                  onChange={(e) =>
                    handleUpdate(
                      review.reviewId,
                      Number(e.target.value),
                      review.comment
                    )
                  }
                  className="border rounded p-1 w-16"
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="text"
                  value={review.comment}
                  onChange={(e) =>
                    handleUpdate(review.reviewId, review.rating, e.target.value)
                  }
                  className="border rounded p-1 w-full"
                />
              </td>
              <td className="px-4 py-3">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Ви впевнені?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Ця дія видалить коментар назавжди. Продовжити?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Скасувати</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(review.reviewId)}
                      >
                        Видалити
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminReviewsPage;
