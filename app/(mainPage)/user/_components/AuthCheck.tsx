// AuthCheck.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchUser } from "@/lib/api/user-service";

interface AuthCheckProps {
  children: React.ReactNode;
}

const AuthCheck: React.FC<AuthCheckProps> = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuth, setIsAuth] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    const validateToken = async () => {
      try {
        await fetchUser();
        setIsAuth(true);
      } catch (error) {
        console.error("Помилка авторизації:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    validateToken();
  }, [router]);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }
  if (!isAuth) {
    return null;
  }
  return <>{children}</>;
};

export default AuthCheck;
