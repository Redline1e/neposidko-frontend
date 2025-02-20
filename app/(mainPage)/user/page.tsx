"use client";

import { useEffect, useState } from "react";
import { fetchUser } from "@/lib/api/user-service";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type User = {
  name: string;
  email: string;
  telephone?: string;
  deliveryAddress?: string;
};

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchUser(token)
      .then((data: User) => {
        setUser(data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        toast.error("Не вдалося завантажити дані користувача");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Вітаємо, {user?.name}!</h1>
      <p className="text-lg">Ласкаво просимо на вашу особисту сторінку.</p>
    </div>
  );
}
