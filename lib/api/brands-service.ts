import {
  apiClient,
  getAuthHeaders,
  extractErrorMessage,
} from "@/utils/apiClient";
import { Brand, BrandSchema } from "@/utils/types";
import { z } from "zod";

export const fetchBrands = async (): Promise<Brand[]> => {
  try {
    const response = await apiClient.get("/brands", {
      headers: getAuthHeaders(),
    });
    return z.array(BrandSchema).parse(response.data);
  } catch (error: any) {
    const message = extractErrorMessage(error, "Не вдалося завантажити бренди");
    console.error(message);
    throw new Error(message);
  }
};

export const addBrand = async (brand: Brand): Promise<void> => {
  try {
    await apiClient.post("/brands", brand, { headers: getAuthHeaders() });
  } catch (error: any) {
    const message = extractErrorMessage(error, "Не вдалося додати бренд");
    console.error(message);
    throw new Error(message);
  }
};

export const fetchBrandById = async (brandId: number): Promise<Brand> => {
  try {
    const response = await apiClient.get(`/brand/${brandId}`, {
      headers: getAuthHeaders(),
    });
    return BrandSchema.parse(response.data);
  } catch (error: any) {
    const message = extractErrorMessage(
      error,
      `Не вдалося завантажити бренд ${brandId}`
    );
    console.error(message);
    throw new Error(message);
  }
};

export const updateBrand = async (brand: Brand): Promise<void> => {
  try {
    if (!brand.brandId) {
      throw new Error("brandId є обов’язковим для оновлення");
    }
    await apiClient.put(`/brand/${brand.brandId}`, brand, {
      headers: getAuthHeaders(),
    });
  } catch (error: any) {
    const message = extractErrorMessage(error, "Не вдалося оновити бренд");
    console.error(message);
    throw new Error(message);
  }
};

export const deleteBrand = async (brandId: number): Promise<void> => {
  try {
    await apiClient.delete(`/brand/${brandId}`, { headers: getAuthHeaders() });
  } catch (error: any) {
    const message = extractErrorMessage(error, "Не вдалося видалити бренд");
    console.error(message);
    throw new Error(message);
  }
};
