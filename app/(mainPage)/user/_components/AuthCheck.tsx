"use client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface AuthCheckProps {
  children: React.ReactNode;
}

export const AuthCheck = ({ children }: AuthCheckProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Якщо токен відсутній, перенаправляємо користувача на сторінку логіну
      router.push("/login");
      return;
    }

    const validateToken = async () => {
      try {
        const response = await fetch("http://localhost:5000/protected", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          // Якщо відповідь успішна, користувач авторизований
          setIsAuth(true);
        } else {
          // Якщо щось не так – перенаправляємо на логін
          router.push("/login");
        }
      } catch (error) {
        console.error("Помилка авторизації:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [router]);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-screen ">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (!isAuth) {
    // Можна повернути null або якийсь інший fallback,
    // але зазвичай користувача вже перенаправили на логін
    return null;
  }

  return <>{children}</>;
};
