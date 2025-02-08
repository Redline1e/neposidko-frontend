"use client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface User {
  name?: string;
  email?: string;
  userId?: number;
}

const ProtectedPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        // Перевірка дійсності токену та отримання даних користувача
        const response = await fetch("http://localhost:5000/protected", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Помилка авторизації:", error);
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin size-10" />
      </div>
    );
  }

  if (!user) {
    return null; 
  }

  const { name, email, userId } = user;

  return (
    <div>
      <h1>Вітаємо, {name || "Користувач"}</h1>
      <p>Ваш email: {email || "Не вказано"}</p>
      <p>Ваш ID: {userId !== undefined ? userId : "Не вказано"}</p>
    </div>
  );
};

export default ProtectedPage;
