"use client";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Comment {
  id: number;
  text: string;
}

export const CommentsSection: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now(),
      text: newComment,
    };
    setComments([comment, ...comments]);
    setNewComment("");
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Коментарі</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <Textarea
          placeholder="Напишіть коментар..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="mb-2 w-full"
        />
        <Button type="submit">Відправити</Button>
      </form>
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p>Поки немає коментарів.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="p-4 border rounded">
              {comment.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
