import { useState, useEffect } from "react";
import axios from "axios";
import { User } from "@/utils/api";

const BASE_URL = "http://localhost:5000";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        setIsAuthenticated(false);
        return;
      }
      try {
        const response = await axios.get(`${BASE_URL}/protected`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setIsAuthenticated(true);
          setUser(response.data);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error during auth check:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, loading, user };
};
