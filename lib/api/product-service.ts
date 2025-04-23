import {
  apiClient,
  getAuthHeaders,
  extractErrorMessage,
} from "@/utils/apiClient";
import { Product, ProductSchema } from "@/utils/types";
import { z } from "zod";

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get("/products", {
      headers: getAuthHeaders(),
    });
    return z.array(ProductSchema).parse(response.data);
  } catch (error) {
    const message = extractErrorMessage(error, "Не вдалося завантажити товари");
    console.error(
      "Error in fetchProducts:",
      error instanceof Error ? error.message : error
    );
    throw new Error(message);
  }
};

export const fetchActiveProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get("/products/active", {
      headers: getAuthHeaders(),
    });
    const products: Product[] = z.array(ProductSchema).parse(response.data);
    return products.filter((product: Product) =>
      (product.sizes ?? []).some(
        (size: { size: string; stock: number }) => size.stock > 0
      )
    );
  } catch (error) {
    const message = extractErrorMessage(
      error,
      "Не вдалося завантажити активні товари"
    );
    console.error(message);
    throw new Error(message);
  }
};

export const fetchInactiveProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get("/products/inactive", {
      headers: getAuthHeaders(),
    });
    return z.array(ProductSchema).parse(response.data);
  } catch (error) {
    const message = extractErrorMessage(
      error,
      "Не вдалося завантажити неактивні товари"
    );
    console.error(message);
    throw new Error(message);
  }
};

export const addProduct = async (product: Product): Promise<void> => {
  try {
    await apiClient.post("/products", product, { headers: getAuthHeaders() });
  } catch (error) {
    const message = extractErrorMessage(error, "Не вдалося додати товар");
    console.error(message);
    throw new Error(message);
  }
};

export const fetchProductByArticle = async (
  articleNumber: string
): Promise<Product> => {
  try {
    const response = await apiClient.get(`/product/${articleNumber}`, {
      headers: getAuthHeaders(),
    });
    return ProductSchema.parse(response.data);
  } catch (error) {
    const message = extractErrorMessage(
      error,
      `Не вдалося завантажити товар ${articleNumber}`
    );
    console.error(
      "Error in fetchProductByArticle:",
      error instanceof Error ? error.message : error
    );
    throw new Error(message);
  }
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const response = await apiClient.get(
      `/search?q=${encodeURIComponent(query)}`,
      { headers: getAuthHeaders() }
    );
    return z.array(ProductSchema).parse(response.data);
  } catch (error) {
    const message = extractErrorMessage(error, "Не вдалося виконати пошук");
    console.error(message);
    throw new Error(message);
  }
};

export const updateProduct = async (product: Product): Promise<void> => {
  try {
    await apiClient.put(`/product/${product.articleNumber}`, product, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    const message = extractErrorMessage(error, "Не вдалося оновити товар");
    console.error(message);
    throw new Error(message);
  }
};

export const updateProductActiveStatus = async (
  articleNumber: string,
  isActive: boolean
): Promise<void> => {
  try {
    await apiClient.patch(
      `/product/${articleNumber}/active`,
      { isActive },
      { headers: getAuthHeaders() }
    );
  } catch (error) {
    const message = extractErrorMessage(
      error,
      "Не вдалося оновити статус активності товару"
    );
    console.error(message);
    throw new Error(message);
  }
};

export const deleteProduct = async (articleNumber: string): Promise<void> => {
  try {
    await apiClient.delete(`/product/${articleNumber}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    const message = extractErrorMessage(error, "Не вдалося видалити товар");
    console.error(message);
    throw new Error(message);
  }
};

export const addProductWithImages = async (
  formData: FormData
): Promise<void> => {
  try {
    await apiClient.post("/products", formData, {
      headers: {
        ...getAuthHeaders(),
      },
    });
  } catch (error) {
    const message = extractErrorMessage(error, "Не вдалося додати товар");
    throw new Error(message);
  }
};
