"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { fetchUser, updateUser } from "@/lib/api/user-service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

type FormData = {
  name: string;
  email: string;
  telephone: string;
  deliveryAddress: string;
};

const redirectToLogin = () => {
  window.location.href = "/login";
};

const EditUser: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      telephone: "",
      deliveryAddress: "",
    },
  });

  useEffect(() => {
    const loadUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        redirectToLogin();
        return;
      }
      try {
        const userData = await fetchUser(token);
        reset({
          name: userData.name,
          email: userData.email,
          telephone: userData.telephone ?? "",
          deliveryAddress: userData.deliveryAddress ?? "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Помилка завантаження користувача");
        redirectToLogin();
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [reset]);

  const onSubmit = useCallback(async (data: FormData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Користувач не авторизований");
      redirectToLogin();
      return;
    }
    try {
      await updateUser(
        token,
        data.name,
        data.email,
        data.telephone,
        data.deliveryAddress
      );
      toast.success("Дані успішно оновлено!");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Не вдалося оновити дані");
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-16">
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium">Ім'я</label>
            <Controller
              control={control}
              name="name"
              rules={{ required: "Ім'я є обов'язковим" }}
              render={({ field }) => (
                <>
                  <Input {...field} />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <Controller
              control={control}
              name="email"
              rules={{
                required: "Email є обов'язковим",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Введіть коректний email",
                },
              }}
              render={({ field }) => (
                <>
                  <Input {...field} type="email" />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Телефон</label>
            <Controller
              control={control}
              name="telephone"
              rules={{
                validate: (value) =>
                  !value ||
                  /^[0-9+\s()-]+$/.test(value) ||
                  "Введіть коректний номер телефону",
              }}
              render={({ field }) => (
                <>
                  <Input {...field} />
                  {errors.telephone && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.telephone.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Адреса доставки</label>
            <Controller
              control={control}
              name="deliveryAddress"
              render={({ field }) => <Input {...field} />}
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

export default EditUser;
