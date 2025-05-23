import {
  apiClient,
  getAuthHeaders,
  extractErrorMessage,
} from "@/utils/apiClient";
import { Category, CategorySchema } from "@/utils/types";
import { z } from "zod";

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get("/categories", {
      headers: getAuthHeaders(),
    });
    return z.array(CategorySchema).parse(response.data);
  } catch (error) {
    const message = extractErrorMessage(
      error,
      "Не вдалося завантажити категорії"
    );
    throw new Error(message);
  }
};

export const addCategoryWithImage = async (
  formData: FormData
): Promise<void> => {
  try {
    await apiClient.post("/categories", formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    const message = extractErrorMessage(error, "Не вдалося додати категорію");
    throw new Error(message);
  }
};

export const addCategory = async (category: Category): Promise<void> => {
  try {
    await apiClient.post("/categories", category, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    const message = extractErrorMessage(error, "Не вдалося додати категорію");
    console.error(message);
    throw new Error(message);
  }
};

export const updateCategory = async (category: Category): Promise<void> => {
  try {
    if (!category.categoryId) {
      throw new Error("categoryId є обов’язковим для оновлення");
    }
    await apiClient.put(`/categories/${category.categoryId}`, category, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    const message = extractErrorMessage(error, "Не вдалося оновити категорію");
    console.error(message);
    throw new Error(message);
  }
};

export const deleteCategory = async (categoryId: number): Promise<void> => {
  try {
    await apiClient.delete(`/categories/${categoryId}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    const message = extractErrorMessage(error, "Не вдалося видалити категорію");
    throw new Error(message);
  }
};

export const updateCategoryWithImage = async (category: Category) => {
  try {
    const formData = new FormData();
    formData.append("name", category.name);

    if (category.imageUrl.startsWith("blob:")) {
      const blob = await (await fetch(category.imageUrl)).blob();
      formData.append("image", blob, "category.jpg");
    }

    await apiClient.put(`/categories/${category.categoryId}`, formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    const message = extractErrorMessage(error, "Не вдалося оновити категорію");
    throw new Error(message);
  }
};
