import {
  apiClient,
  getAuthHeaders,
  extractErrorMessage,
} from "@/utils/apiClient";
import { User, UserSchema } from "@/utils/types";
import { z } from "zod";

export const fetchUser = async (): Promise<User> => {
  try {
    const response = await apiClient.get("/protected", {
      headers: getAuthHeaders(),
    });
    return UserSchema.parse(response.data);
  } catch (error) {
    const message = extractErrorMessage(
      error,
      "Не вдалося отримати дані користувача"
    );
    console.error("Error in fetchUser:", error);
    throw new Error(message);
  }
};

export const updateUser = async (data: {
  name: string;
  email: string;
  telephone?: string;
  deliveryAddress?: string;
}): Promise<User> => {
  try {
    const response = await apiClient.put("/user", data, {
      headers: getAuthHeaders(),
    });
    return UserSchema.parse(response.data);
  } catch (error) {
    const message = extractErrorMessage(
      error,
      "Не вдалося оновити дані користувача"
    );
    console.error("Error in updateUser:", error);
    throw new Error(message);
  }
};

export const deleteUser = async (): Promise<{ message: string }> => {
  try {
    const response = await apiClient.delete("/user", {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    const message = extractErrorMessage(
      error,
      "Не вдалося видалити користувача"
    );
    console.error(message);
    throw new Error(message);
  }
};

export const getUserData = async (): Promise<User> => {
  try {
    const response = await apiClient.get("/user", {
      headers: getAuthHeaders(),
    });
    return UserSchema.parse(response.data);
  } catch (error) {
    const message = extractErrorMessage(
      error,
      "Не вдалося отримати дані про користувача"
    );
    console.error(message);
    throw new Error(message);
  }
};

export const fetchUserById = async (userId: string): Promise<User> => {
  try {
    const response = await apiClient.get(`/user/${userId}`, {
      headers: getAuthHeaders(),
    });
    return UserSchema.parse(response.data);
  } catch (error) {
    const message = extractErrorMessage(
      error,
      `Не вдалося отримати дані користувача за ID ${userId}`
    );
    console.error(message);
    throw new Error(message);
  }
};

export const fetchAdminUsers = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get("/admin/users", {
      headers: getAuthHeaders(),
    });
    return z.array(UserSchema).parse(response.data);
  } catch (error) {
    const message = extractErrorMessage(
      error,
      "Не вдалося завантажити користувачів для адміністратора"
    );
    console.error(message);
    throw new Error(message);
  }
};

export const updateAdminUser = async (
  userId: string,
  data: Partial<User>
): Promise<User> => {
  try {
    const response = await apiClient.put(`/admin/users/${userId}`, data, {
      headers: getAuthHeaders(),
    });
    return UserSchema.parse(response.data);
  } catch (error) {
    const message = extractErrorMessage(
      error,
      `Не вдалося оновити користувача ${userId}`
    );
    console.error(message);
    throw new Error(message);
  }
};

export const deleteAdminUser = async (userId: string): Promise<void> => {
  try {
    await apiClient.delete(`/admin/users/${userId}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    const message = extractErrorMessage(
      error,
      `Не вдалося видалити користувача ${userId}`
    );
    console.error(message);
    throw new Error(message);
  }
};

export const fetchUserNameById = async (userId: string): Promise<string> => {
  try {
    const response = await apiClient.get(`/public/user/${userId}/name`);
    return response.data.name;
  } catch (error) {
    console.error(`Помилка завантаження імені для userId ${userId}:`, error);
    return "Невідомий користувач";
  }
};
