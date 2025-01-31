"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";

// Валідація через Zod
const schema = z.object({
  name: z.string().min(2, "Ім'я має бути не менше 2 символів"),
  email: z.string().email("Некоректний email"),
  password: z.string().min(6, "Пароль має бути не менше 6 символів"),
});

type FormData = z.infer<typeof schema>;

export default function RegisterForm() {
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setMessage("");
    try {
      const res = await fetch("http://localhost:3000/actions/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Щось пішло не так");

      setMessage("Реєстрація успішна!");
      reset();
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow"
    >
      <h2 className="text-xl font-bold mb-4">Реєстрація</h2>

      <div className="mb-3">
        <input
          type="text"
          {...register("name")}
          placeholder="Ім'я"
          className="w-full p-2 border rounded"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div className="mb-3">
        <input
          type="email"
          {...register("email")}
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="mb-3">
        <input
          type="password"
          {...register("password")}
          placeholder="Пароль"
          className="w-full p-2 border rounded"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Реєструємо..." : "Зареєструватися"}
      </button>

      {message && <p className="mt-3 text-center text-green-500">{message}</p>}
    </form>
  );
}
