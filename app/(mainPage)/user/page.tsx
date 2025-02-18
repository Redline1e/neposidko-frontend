"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { fetchUser, updateUser } from "@/lib/user-service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

type FormData = {
  name: string;
  email: string;
};

const ProtectedPage = () => {
  const [loading, setLoading] = useState(true);
  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    const loadUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }
      try {
        const userData = await fetchUser(token);
        console.log("Fetched user data:", userData);
        reset({
          name: userData.name,
          email: userData.email,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Помилка завантаження користувача");
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [reset]);

  const onSubmit = async (data: FormData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Користувач не авторизований");
      window.location.href = "/login";
      return;
    }
    try {
      await updateUser(token, data.name, data.email);
      toast.success("Дані успішно оновлено!");
    } catch (error) {
      toast.error("Не вдалося оновити дані");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <Card className="max-w-md mx-auto mt-10 p-4">
      <CardHeader>
        <CardTitle>Редагувати профіль</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Ім'я</label>
            <Controller
              control={control}
              name="name"
              render={({ field }) => <Input {...field} required />}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <Controller
              control={control}
              name="email"
              render={({ field }) => <Input {...field} type="email" required />}
            />
          </div>
          <Button type="submit" className="w-full">
            Зберегти зміни
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProtectedPage;
