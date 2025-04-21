"use client";

import React, { useEffect, useState } from "react";
import { fetchUser } from "@/lib/api/user-service";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export type User = {
  name: string;
  email: string;
  telephone?: string;
  deliveryAddress?: string;
};

const UserProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Токен перевіряється всередині fetchUser (через getAuthHeaders)
    fetchUser()
      .then((data: User) => setUser(data))
      .catch((error) => {
        console.error("Error fetching user data:", error);
        toast.error("Не вдалося завантажити дані користувача");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }
  return (
    <div className="w-full sm:w-[600px] mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Вітаємо, {user?.name}!</h1>
      <p className="text-lg">Ласкаво просимо на вашу особисту сторінку.</p>
    </div>
  );
};

export default UserProfilePage;
