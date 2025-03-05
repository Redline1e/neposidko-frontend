import { apiClient } from "@/utils/apiClient";
import { Sizes, SizesSchema } from "@/utils/types";
import { z } from "zod";

export const fetchSizes = async (): Promise<Sizes[]> => {
  try {
    const response = await apiClient.get("/sizes");
    return z.array(SizesSchema).parse(response.data);
  } catch (error: any) {
    console.error("Помилка завантаження розмірів:", error);
    throw new Error("Не вдалося завантажити розміри");
  }
};
