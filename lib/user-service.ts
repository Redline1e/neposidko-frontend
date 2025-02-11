import axios from "axios";
import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000";

export const fetchUser = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/protected`, {
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
      `${API_URL}/user`,
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

export const deleteUser = async (token: string) => {
  try {
    const response = await axios.delete(`${API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Помилка видалення користувача:", error);
    throw new Error("Не вдалося видалити користувача");
  }
};

export const getUserData = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Помилка отримання даних про користувача:", error);
    throw new Error("Не вдалося отримати дані про користувача");
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
        const response = await axios.get(`${API_URL}/protected`, {
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
        const response = await axios.get(`${API_URL}/getUserRole`, {
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
