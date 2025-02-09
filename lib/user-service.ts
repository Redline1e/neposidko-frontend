import axios from "axios";
import { useState, useEffect } from "react";

export const fetchUser = async (token: string) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Помилка отримання користувача:", error);
    throw new Error("Не вдалося отримати дані користувача");
  }
};

export const updateUser = async (
  token: string,
  name: string,
  email: string
) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/api/user`,
      { name, email },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Помилка оновлення користувача:", error);
    throw new Error("Не вдалося оновити дані користувача");
  }
};

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

export const useCheckRole = (): { hasAccess: boolean; loading: boolean } => {
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkUserRole = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/getUserRole", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user role");
        }

        const data = await response.json();
        // Наприклад, доступ є лише якщо roleId === 1
        setHasAccess(data.roleId === 1);
      } catch (error) {
        console.error("Error checking user role:", error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, []);

  return { hasAccess, loading };
};
