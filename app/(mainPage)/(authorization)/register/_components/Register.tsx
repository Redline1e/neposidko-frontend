"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FC, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { apiClient } from "@/utils/apiClient";
import Head from "next/head";

const registerSchema = z.object({
  email: z.string().email("Некоректний email"),
  password: z.string().min(6, "Пароль повинен бути не менше 6 символів"),
  recaptchaToken: z.string().min(1, "Підтвердіть, що ви не робот"),
});

type FormData = z.infer<typeof registerSchema>;

const RegisterPage: FC = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.onerror = () => console.error("Failed to load reCAPTCHA script");
    document.body.appendChild(script);

    (window as WindowWithRecaptcha).onRecaptchaSuccess = (token: string) => {
      console.log("reCAPTCHA Token:", token);
      setValue("recaptchaToken", token);
    };

    (window as WindowWithRecaptcha).onRecaptchaError = () => {
      console.error("reCAPTCHA Error: Failed to generate token");
      toast.error("Помилка reCAPTCHA. Спробуйте ще раз.");
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      const payload = { ...data, cart, favorites };
      console.log("Register Payload:", payload);
      const response = await apiClient.post("/register", payload);
      const token = response.data.token;
      localStorage.setItem("token", token);
      localStorage.removeItem("cart");
      localStorage.removeItem("favorites");

      if (localStorage.getItem("returnToCheckout") === "true") {
        localStorage.removeItem("returnToCheckout");
        router.push("/cart");
      } else {
        router.push("/");
      }
      toast.success("Реєстрація успішна!");
    } catch (error: unknown) {
      console.error("Submission Error:", error);
      if ((window as WindowWithRecaptcha).grecaptcha) {
        (window as WindowWithRecaptcha).grecaptcha.reset();
        setValue("recaptchaToken", "");
      }
      const message =
        error instanceof Error ? error.message : "Невідома помилка";
      toast.error(message || "Помилка реєстрації");
    }
  };

  console.log(
    "reCAPTCHA Site Key:",
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  );

  return (
    <>
      <Head>
        <title>Реєстрація - Непосидько</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
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
              <p className="text-red-500 text-sm mt-2">
                {errors.email.message}
              </p>
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
          <div>
            <div
              className="g-recaptcha"
              data-sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
              data-callback="onRecaptchaSuccess"
              data-error-callback="onRecaptchaError"
            ></div>
            {errors.recaptchaToken && (
              <p className="text-red-500 text-sm mt-2">
                {errors.recaptchaToken.message}
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
    </>
  );
};

export default RegisterPage;

declare global {
  interface Window {
    onRecaptchaSuccess: (token: string) => void;
    onRecaptchaError: () => void;
    grecaptcha: {
      reset: () => void;
      render: (
        container: string | HTMLElement,
        parameters: { sitekey: string; theme: string }
      ) => void;
      execute: () => void;
      getResponse: () => string;
    };
  }
}

interface WindowWithRecaptcha extends Window {
  grecaptcha: {
    reset: () => void;
    render: (
      container: string | HTMLElement,
      parameters: { sitekey: string; theme: string }
    ) => void;
    execute: () => void;
    getResponse: () => string;
  };
}
