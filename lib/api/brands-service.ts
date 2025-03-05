import { apiClient } from "@/utils/apiClient";
import { Brand, BrandSchema } from "@/utils/types";
import { z } from "zod";

export const fetchBrands = async (): Promise<Brand[]> => {
  try {
    const response = await apiClient.get("/brands");
    return z.array(BrandSchema).parse(response.data);
  } catch (error: any) {
    console.error("Помилка завантаження брендів:", error);
    throw new Error("Не вдалося завантажити бренди");
  }
};

export const addBrand = async (brand: Brand): Promise<void> => {
  try {
    await apiClient.post("/brands", brand);
  } catch (error: any) {
    console.error("Помилка при додаванні бренду:", error);
    throw new Error("Не вдалося додати бренд");
  }
};

export const fetchBrandById = async (brandId: number): Promise<Brand> => {
  try {
    const response = await apiClient.get(`/brand/${brandId}`);
    return BrandSchema.parse(response.data);
  } catch (error: any) {
    console.error(`Помилка при завантаженні бренду ${brandId}:`, error);
    throw new Error("Не вдалося завантажити бренд");
  }
};

export const updateBrand = async (brand: Brand): Promise<void> => {
  try {
    if (!brand.brandId) {
      throw new Error("brandId є обов’язковим для оновлення");
    }
    await apiClient.put(`/brand/${brand.brandId}`, brand);
  } catch (error: any) {
    console.error("Помилка при оновленні бренду:", error);
    throw new Error("Не вдалося оновити бренд");
  }
};

export const deleteBrand = async (brandId: number): Promise<void> => {
  try {
    await apiClient.delete(`/brand/${brandId}`);
  } catch (error: any) {
    console.error("Помилка при видаленні бренду:", error);
    throw new Error("Не вдалося видалити бренд");
  }
};
