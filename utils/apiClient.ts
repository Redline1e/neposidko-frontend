import axios from "axios";
import { getToken } from "@/lib/hooks/getToken";

export const apiClient = axios.create({
  baseURL: "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

export const getAuthHeaders = (): Record<string, string> => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const extractErrorMessage = (error: any, defaultMsg: string): string =>
  error?.response?.data?.error || defaultMsg;
