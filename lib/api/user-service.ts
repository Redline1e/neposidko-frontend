import axios from "axios";
import { useEffect, useState } from "react";
import { User } from "@/utils/api";

// Створення axios‑instance із базовим URL
const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

// Допоміжна функція для узгодженого отримання повідомлення про помилку
const extractErrorMessage = (error: any, defaultMsg: string) =>
  error?.response?.data?.error || defaultMsg;

// Функція для отримання даних користувача
export const fetchUser = async (token: string): Promise<User> => {
  try {
    const response = await api.get("/protected", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    const message = extractErrorMessage(
      error,
      "Не вдалося отримати дані користувача"
    );
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
): Promise<User> => {
  try {
    const response = await api.put(
      "/user",
      { name, email, telephone, deliveryAddress },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error: any) {
    const message = extractErrorMessage(
      error,
      "Не вдалося оновити дані користувача"
    );
    console.error("Помилка оновлення користувача:", message);
    throw new Error(message);
  }
};

// Функція для видалення користувача
export const deleteUser = async (
  token: string
): Promise<{ message: string }> => {
  try {
    const response = await api.delete("/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    const message = extractErrorMessage(
      error,
      "Не вдалося видалити користувача"
    );
    console.error("Помилка видалення користувача:", message);
    throw new Error(message);
  }
};

// Функція для отримання даних користувача (альтернативний endpoint)
export const getUserData = async (token: string): Promise<User> => {
  try {
    const response = await api.get("/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    const message = extractErrorMessage(
      error,
      "Не вдалося отримати дані про користувача"
    );
    console.error("Помилка отримання даних про користувача:", message);
    throw new Error(message);
  }
};

// Отримання користувача за ID
export const fetchUserById = async (userId: number): Promise<User> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Токен не знайдено");
  try {
    const response = await api.get(`/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    const message = extractErrorMessage(
      error,
      "Не вдалося отримати дані користувача"
    );
    console.error("Помилка отримання користувача за ID:", message);
    throw new Error(message);
  }
};

// Хук для перевірки автентифікації
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      try {
        const response = await api.get("/protected", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setIsAuthenticated(true);
          setUser(response.data);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error during auth check:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  return { isAuthenticated, loading, user };
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
        const response = await api.get("/getUserRole", {
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
