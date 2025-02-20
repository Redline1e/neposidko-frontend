import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

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
        const response = await axios.get(`${BASE_URL}/getUserRole`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHasAccess(response.data.roleId === 1);
      } catch (error) {
        console.error("Error checking user role:", error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, []);

  return { hasAccess, loading };
};
