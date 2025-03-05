"use client";

import { useForm } from "react-hook-form";
import { FC } from "react";
import Link from "next/link";
import { toast } from "sonner";

type FormData = {
  email: string;
  password: string;
};

const LoginPage: FC = () => {
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Помилка входу");
      }

      const result = await response.json();

      localStorage.setItem("token", result.token);
      window.location.href = "/";
      toast.success("Вхід успішний!");
    } catch (error: any) {
      toast.error(error.message || "Помилка входу");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-center mb-6">Вхід</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("email")}
          type="email"
          placeholder="Email"
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          {...register("password")}
          type="password"
          placeholder="Пароль"
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-between text-sm">
          <p>Ще не маєте акаунта?</p>
          <Link className="font-semibold" href="/register">
            Зареєструватися
          </Link>
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Увійти
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
