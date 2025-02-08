import { useState, useEffect } from "react";

// Функція перевірки авторизації на основі токену
export const useAuth = (): boolean => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Перевірка чи є токен в localStorage
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return setIsAuthenticated(false); // Токен відсутній, користувач не авторизований
      }

      try {
        // Запит до сервера для перевірки дійсності токену
        const response = await fetch("http://localhost:5000/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Передаємо токен для перевірки
          },
        });

        if (response.ok) {
          setIsAuthenticated(true); // Токен дійсний
        } else {
          setIsAuthenticated(false); // Токен недійсний
        }
      } catch (error) {
        console.error("Error during auth check:", error);
        setIsAuthenticated(false); // Якщо сталася помилка при запиті, не авторизовано
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Повертаємо статус авторизації та стан завантаження
  return { isAuthenticated, loading };
};
