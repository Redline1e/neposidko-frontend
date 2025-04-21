import {
  apiClient,
  extractErrorMessage,
  getAuthHeaders,
} from "@/utils/apiClient";

export const downloadReport = async (): Promise<Blob> => {
  try {
    const response = await apiClient.get("/generate-report", {
      headers: getAuthHeaders(),
      responseType: "blob",
    });
    return response.data;
  } catch (error: any) {
    const message = extractErrorMessage(error, "Не вдалося сформувати звіт");
    throw new Error(message);
  }
};

export const uploadExcelFile = async (
  formData: FormData
): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post("/upload-excel", formData, {
      headers: {},
    });
    return response.data;
  } catch (error: any) {
    const message = extractErrorMessage(
      error,
      "Не вдалося завантажити Excel файл"
    );
    throw new Error(message);
  }
};
