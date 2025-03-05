"use client";

import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  createReview,
  fetchReviewsByArticle,
  updateReview,
  deleteReview,
} from "@/lib/api/reviews-service";
import { Review } from "@/utils/types";
import { toast } from "sonner";
import { Star, Trash2, User2Icon } from "lucide-react";
import { useAuth } from "@/lib/hooks/auth";
import { fetchUserById } from "@/lib/api/user-service";

interface CommentsSectionProps {
  articleNumber: string;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ articleNumber }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [newRating, setNewRating] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editComment, setEditComment] = useState<string>("");
  const [editRating, setEditRating] = useState<number>(5);
  const [reviewUsers, setReviewUsers] = useState<Record<number, string>>({});

  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const fetchedReviews = await fetchReviewsByArticle(articleNumber);
        setReviews(fetchedReviews);
      } catch (error) {
        console.error("Помилка завантаження відгуків:", error);
      }
    };
    loadReviews();
  }, [articleNumber]);

  useEffect(() => {
    const loadReviewUsers = async () => {
      const uniqueUserIds = Array.from(new Set(reviews.map((r) => r.userId)));
      const usersMap: Record<number, string> = { ...reviewUsers };

      await Promise.all(
        uniqueUserIds.map(async (id) => {
          if (!usersMap[id]) {
            try {
              const userData = await fetchUserById(id);
              usersMap[id] = userData.name;
            } catch (error) {
              usersMap[id] = "Невідомий користувач";
            }
          }
        })
      );

      setReviewUsers(usersMap);
    };

    if (reviews.length > 0) {
      loadReviewUsers();
    }
  }, [reviews]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!isAuthenticated) {
      toast.error("Будь ласка, увійдіть для створення відгуку");
      return;
    }
    setLoading(true);
    try {
      const createdReview = await createReview({
        articleNumber,
        rating: newRating,
        comment: newComment,
      });
      setReviews((prevReviews) => [createdReview, ...prevReviews]);
      setNewComment("");
      setNewRating(5);
    } catch (error) {
      console.error("Помилка створення відгуку:", error);
      toast.error("Не вдалося створити відгук");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (review: Review) => {
    setEditingReviewId(review.reviewId);
    setEditComment(review.comment);
    setEditRating(review.rating);
  };

  const handleEditSubmit = async (reviewId: number) => {
    try {
      const updated = await updateReview(reviewId, {
        rating: editRating,
        comment: editComment,
      });
      setReviews((prevReviews) =>
        prevReviews.map((r) => (r.reviewId === reviewId ? updated : r))
      );
      setEditingReviewId(null);
    } catch (error) {
      toast.error("Не вдалося оновити відгук");
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    try {
      await deleteReview(reviewId);
      setReviews((prevReviews) => prevReviews.filter((r) => r.reviewId !== reviewId));
      toast.success("Відгук успішно видалено");
    } catch (error) {
      toast.error("Не вдалося видалити відгук");
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={i < rating ? "text-yellow-500" : "text-gray-300"} />
      ))}
    </div>
  );

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Відгуки ({reviews.length})</h2>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex items-center mb-2 space-x-2">
            <label className="block">Оцінка:</label>
            <input
              type="number"
              min="1"
              max="5"
              value={newRating}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewRating(Number(e.target.value))
              }
              className="border p-2 w-20"
            />
          </div>
          <Textarea
            placeholder="Напишіть свій відгук..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mb-2 w-full"
            rows={4}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Відправка..." : "Відправити"}
          </Button>
        </form>
      ) : (
        <p className="mb-4 text-gray-500">
          Будь ласка, увійдіть, щоб залишити свій відгук.
        </p>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500">Поки немає відгуків.</p>
        ) : (
          reviews.map((review) => {
            const canEdit =
              isAuthenticated &&
              user &&
              review.userId === user.userId &&
              Date.now() - new Date(review.reviewDate).getTime() <= 10 * 60 * 1000;

            return (
              <div
                key={review.reviewId}
                className="p-4 border rounded flex flex-col"
              >
                <div className="flex items-center mb-2">
                  <User2Icon className="w-10 h-10 text-neutral-700 mr-2" />
                  <p className="font-bold">
                    {reviewUsers[review.userId] || "Невідомий користувач"}
                  </p>
                  <span className="text-sm text-gray-500 ml-auto">
                    {new Date(review.reviewDate).toLocaleString()}
                  </span>
                </div>
                <div className="mb-2">{renderStars(review.rating)}</div>

                {editingReviewId === review.reviewId ? (
                  <div className="mb-2">
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={editRating}
                      onChange={(e) => setEditRating(Number(e.target.value))}
                      className="border p-2 w-20 mb-2"
                    />
                    <Textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      className="mb-2 w-full"
                      rows={3}
                    />
                    <div className="space-x-2">
                      <Button onClick={() => handleEditSubmit(review.reviewId)}>
                        Зберегти
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingReviewId(null)}
                      >
                        Відмінити
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="mb-2">{review.comment}</p>
                )}

                {canEdit && editingReviewId !== review.reviewId && (
                  <div className="flex space-x-2">
                    <Button onClick={() => handleEditClick(review)} size="sm">
                      Редагувати
                    </Button>
                    <Button
                      onClick={() => handleDeleteReview(review.reviewId)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Видалити
                    </Button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
