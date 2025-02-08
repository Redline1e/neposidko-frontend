"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type User = {
  userId: number;
  name: string;
  email: string;
};

export default function UserChangeMenu() {
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, setValue, reset } = useForm<User>({
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${API_URL}/getUser`);
        if (!res.ok) throw new Error("Не вдалося отримати дані користувача");
        const userData: User = await res.json();

        setUserId(userData.userId);
        reset(userData); // Оновлюємо всю форму відразу
      } catch (error) {
        toast.error("Помилка завантаження користувача");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [reset]);

  const onSubmit = async (data: User) => {
    if (!userId) return;

    try {
      const res = await fetch(`${API_URL}/daveUser`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId }),
      });

      if (!res.ok) throw new Error("Помилка оновлення даних");

      toast.success("Дані успішно оновлено!");
    } catch (error) {
      toast.error("Не вдалося оновити дані");
    }
  };

  if (loading) return <p className="text-center">Завантаження...</p>;

  return (
    <Card className="max-w-md mx-auto mt-10 p-4">
      <CardHeader>
        <CardTitle>Профіль</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Ім'я</label>
            <Input {...register("name")} required />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <Input {...register("email")} type="email" required />
          </div>

          <Button type="submit" className="w-full">
            Зберегти
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
