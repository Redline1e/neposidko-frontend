import { apiClient } from "@/utils/apiClient";
import { Category, CategorySchema } from "@/utils/types";
import { z } from "zod";

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get("/categories");
    return z.array(CategorySchema).parse(response.data);
  } catch (error: any) {
    console.error("Помилка завантаження категорій:", error);
    throw new Error("Не вдалося завантажити категорії");
  }
};

export const addCategory = async (category: Category): Promise<void> => {
  try {
    await apiClient.post("/categories", category);
  } catch (error: any) {
    console.error("Помилка при додаванні категорії:", error);
    throw new Error("Не вдалося додати категорію");
  }
};

export const updateCategory = async (category: Category): Promise<void> => {
  try {
    if (!category.categoryId) {
      throw new Error("categoryId є обов’язковим для оновлення");
    }
    await apiClient.put(`/categories/${category.categoryId}`, category);
  } catch (error: any) {
    console.error("Помилка при оновленні категорії:", error);
    throw new Error("Не вдалося оновити категорію");
  }
};

export const deleteCategory = async (categoryId: number): Promise<void> => {
  try {
    await apiClient.delete(`/categories/${categoryId}`);
  } catch (error: any) {
    console.error("Помилка при видаленні категорії:", error);
    throw new Error("Не вдалося видалити категорію");
  }
};
