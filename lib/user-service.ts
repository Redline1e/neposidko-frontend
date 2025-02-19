import axios from "axios";
import { useEffect, useState } from "react";

// Функція для отримання даних користувача
export const fetchUser = async (token: string) => {
  try {
    const response = await axios.get("http://localhost:5000/protected", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.error || "Не вдалося отримати дані користувача";
    console.error("Помилка отримання користувача:", message);
    throw new Error(message);
  }
};

// Функція для оновлення даних користувача
export const updateUser = async (
  token: string,
  name: string,
  email: string,
  telephone: string,
  deliveryAddress: string
) => {
  try {
    const response = await axios.put(
      "http://localhost:5000/user",
      { name, email, telephone, deliveryAddress },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.error || "Не вдалося оновити дані користувача";
    console.error("Помилка оновлення користувача:", message);
    throw new Error(message);
  }
};

// Функція для видалення користувача
export const deleteUser = async (token: string) => {
  try {
    const response = await axios.delete("http://localhost:5000/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.error || "Не вдалося видалити користувача";
    console.error("Помилка видалення користувача:", message);
    throw new Error(message);
  }
};

// Функція для отримання даних користувача (якщо потрібен інший endpoint)
export const getUserData = async (token: string) => {
  try {
    const response = await axios.get("http://localhost:5000/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.error || "Не вдалося отримати дані про користувача";
    console.error("Помилка отримання даних про користувача:", message);
    throw new Error(message);
  }
};

// Хук для перевірки автентифікації
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return setIsAuthenticated(false);
      }
      try {
        const response = await axios.get("http://localhost:5000/protected", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAuthenticated(response.status === 200);
      } catch (error) {
        console.error("Error during auth check:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  return { isAuthenticated, loading };
};

// Хук для перевірки ролі користувача
export const useCheckRole = () => {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setHasAccess(false);
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get("http://localhost:5000/getUserRole", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHasAccess(response.data.roleId === 1);
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
