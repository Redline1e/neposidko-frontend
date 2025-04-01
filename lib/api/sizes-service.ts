import {
  apiClient,
  getAuthHeaders,
  extractErrorMessage,
} from "@/utils/apiClient";
import { Sizes, SizesSchema } from "@/utils/types";
import { z } from "zod";

export const fetchSizes = async (): Promise<Sizes[]> => {
  try {
    const response = await apiClient.get("/sizes", {
      headers: getAuthHeaders(),
    });
    return z.array(SizesSchema).parse(response.data);
  } catch (error: any) {
    const message = extractErrorMessage(
      error,
      "Не вдалося завантажити розміри"
    );
    console.error(message);
    throw new Error(message);
  }
};
