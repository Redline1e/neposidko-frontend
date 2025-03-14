import { apiClient } from "@/utils/apiClient";
import { Product, ProductSchema } from "@/utils/types";
import { z } from "zod";

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get("/products");
    return z.array(ProductSchema).parse(response.data);
  } catch (error: any) {
    console.error("Помилка при завантаженні товарів:", error);
    throw new Error("Не вдалося завантажити товари");
  }
};

export const fetchActiveProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get("/products/active");
    return z.array(ProductSchema).parse(response.data);
  } catch (error: any) {
    console.error("Помилка при завантаженні активних товарів:", error);
    throw new Error("Не вдалося завантажити активні товари");
  }
};

export const fetchInactiveProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get("/products/inactive");
    return z.array(ProductSchema).parse(response.data);
  } catch (error: any) {
    console.error("Помилка при завантаженні неактивних товарів:", error);
    throw new Error("Не вдалося завантажити неактивні товари");
  }
};

export const addProduct = async (product: Product): Promise<void> => {
  try {
    await apiClient.post("/products", product);
  } catch (error: any) {
    console.error("Помилка при додаванні товару:", error);
    throw new Error("Не вдалося додати товар");
  }
};

export const fetchProductByArticle = async (
  articleNumber: string
): Promise<Product> => {
  try {
    const response = await apiClient.get(`/product/${articleNumber}`);
    return ProductSchema.parse(response.data);
  } catch (error: any) {
    console.error(`Помилка при завантаженні товару ${articleNumber}:`, error);
    throw new Error("Не вдалося завантажити товар");
  }
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const response = await apiClient.get(
      `/search?q=${encodeURIComponent(query)}`
    );
    return z.array(ProductSchema).parse(response.data);
  } catch (error: any) {
    console.error("Помилка при пошуку товарів:", error);
    throw new Error("Не вдалося виконати пошук");
  }
};

export const updateProduct = async (product: Product): Promise<void> => {
  try {
    await apiClient.put(`/product/${product.articleNumber}`, product);
  } catch (error: any) {
    console.error("Помилка оновлення товару:", error);
    throw new Error("Не вдалося оновити товар");
  }
};

export const updateProductActiveStatus = async (
  articleNumber: string,
  isActive: boolean
): Promise<void> => {
  try {
    await apiClient.patch(`/product/${articleNumber}/active`, { isActive });
  } catch (error: any) {
    console.error("Помилка оновлення статусу активності товару:", error);
    throw new Error("Не вдалося оновити статус активності товару");
  }
};

export const deleteProduct = async (articleNumber: string): Promise<void> => {
  try {
    await apiClient.delete(`/product/${articleNumber}`);
  } catch (error: any) {
    console.error("Помилка видалення товару:", error);
    throw new Error("Не вдалося видалити товар");
  }
};
