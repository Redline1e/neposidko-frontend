import {
  apiClient,
  extractErrorMessage,
  getAuthHeaders,
} from "@/utils/apiClient";

export const downloadReport = async (): Promise<Blob> => {
  try {
    const response = await apiClient.get("/admin/generate-report", {
      headers: getAuthHeaders(),
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    const message = extractErrorMessage(error, "Не вдалося сформувати звіт");
    throw new Error(message);
  }
};

// Завантаження Excel-файлу
export const uploadExcelFile = async (
  formData: FormData
): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post("/admin/upload-excel", formData, {
      headers: {
        // Нехай axios сам побудує multipart/form-data з boundary
        "Content-Type": "multipart/form-data",
        ...getAuthHeaders(),
      },
    });
    return response.data;
  } catch (error) {
    const message = extractErrorMessage(
      error,
      "Не вдалося завантажити Excel файл"
    );
    throw new Error(message);
  }
};
