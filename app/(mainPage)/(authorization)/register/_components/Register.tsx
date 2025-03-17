"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FC } from "react";
import Link from "next/link";
import { toast } from "sonner";

// Схема валідації для форми реєстрації
const registerSchema = z.object({
  email: z.string().email("Некоректний email"),
  password: z.string().min(6, "Пароль повинен бути не менше 6 символів"),
});

type FormData = z.infer<typeof registerSchema>;

const RegisterPage: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Помилка реєстрації");

      const result = await response.json();

      if (result.token) {
        localStorage.setItem("token", result.token);
        window.location.href = "/";
        toast.success("Реєстрація успішна! Ви авторизовані.");
      } else {
        throw new Error("Сталася помилка при реєстрації");
      }
    } catch (error: any) {
      toast.error(error.message || "Помилка реєстрації");
    }
  };

  return (
    <div className="w-[400px] mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-center mb-8">Реєстрація</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>
          )}
        </div>
        <div>
          <input
            {...register("password")}
            type="password"
            placeholder="Пароль"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-2">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="flex justify-between text-sm gap-5">
          <p>Вже маєте акаунт?</p>
          <Link
            className="font-semibold text-blue-600 hover:underline"
            href="/login"
          >
            Увійти
          </Link>
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Зареєструватися
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
