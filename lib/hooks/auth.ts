import { useState, useEffect } from "react";
import { apiClient } from "@/utils/apiClient";
import { User, UserSchema } from "@/utils/types";


export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      try {
        const response = await apiClient.get("/protected", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setIsAuthenticated(true);
          setUser(UserSchema.parse(response.data));
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Помилка під час перевірки автентифікації:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  return { isAuthenticated, loading, user };
};

export const useCheckRole = () => {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setHasAccess(false);
        setLoading(false);
        return;
      }
      try {
        const response = await apiClient.get("/getUserRole", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHasAccess(response.data.roleId === 1);
      } catch (error) {
        console.error("Помилка перевірки ролі користувача:", error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };
    checkUserRole();
  }, []);

  return { hasAccess, loading };
};
