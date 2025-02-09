// components/ProtectedRoute.tsx
"use client";
import { useEffect } from "react";
import { useCheckRole } from "@/lib/user-service";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { hasAccess, loading } = useCheckRole();

  useEffect(() => {
    if (!loading && !hasAccess) {
      // Редірект, якщо доступ заборонено
      window.location.href = "/";
    }
  }, [hasAccess, loading]);

  if (loading) {
    // Поки завантаження — показуємо лоадер
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
