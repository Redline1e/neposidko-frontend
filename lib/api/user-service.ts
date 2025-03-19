import { apiClient, extractErrorMessage } from "@/utils/apiClient";
import { User, UserSchema } from "@/utils/types";
import { z } from "zod";

// Отримання даних користувача
export const fetchUser = async (token: string): Promise<User> => {
  try {
    const response = await apiClient.get("/protected", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return UserSchema.parse(response.data);
  } catch (error: any) {
    const message = extractErrorMessage(
      error,
      "Не вдалося отримати дані користувача"
    );
    console.error("Помилка отримання користувача:", message);
    throw new Error(message);
  }
};

// Оновлення даних користувача
export const updateUser = async (
  token: string,
  name: string,
  email: string,
  telephone?: string,
  deliveryAddress?: string
): Promise<User> => {
  try {
    const response = await apiClient.put(
      "/user",
      { name, email, telephone, deliveryAddress },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return UserSchema.parse(response.data);
  } catch (error: any) {
    const message = extractErrorMessage(
      error,
      "Не вдалося оновити дані користувача"
    );
    console.error("Помилка оновлення користувача:", message);
    throw new Error(message);
  }
};

// Видалення користувача
export const deleteUser = async (
  token: string
): Promise<{ message: string }> => {
  try {
    const response = await apiClient.delete("/user", {
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

// Альтернативний endpoint для отримання даних користувача
export const getUserData = async (token: string): Promise<User> => {
  try {
    const response = await apiClient.get("/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return UserSchema.parse(response.data);
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
    const response = await apiClient.get(`/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return UserSchema.parse(response.data);
  } catch (error: any) {
    const message = extractErrorMessage(
      error,
      "Не вдалося отримати дані користувача"
    );
    console.error("Помилка отримання користувача за ID:", message);
    throw new Error(message);
  }
};

export const fetchAdminUsers = async () => {
  const token = localStorage.getItem("token");
  const response = await apiClient.get("/admin/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return z.array(UserSchema).parse(response.data);
};

export const updateAdminUser = async (userId: number, data: Partial<User>) => {
  const token = localStorage.getItem("token");
  const response = await apiClient.put(`/admin/users/${userId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return UserSchema.parse(response.data);
};

export const deleteAdminUser = async (userId: number) => {
  const token = localStorage.getItem("token");
  await apiClient.delete(`/admin/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
