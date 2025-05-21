import axios from "axios";
import { getToken } from "@/lib/hooks/getToken";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

export const getAuthHeaders = (): Record<string, string> => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const extractErrorMessage = (error: any, defaultMsg: string): string =>
  error?.response?.data?.error || defaultMsg;
