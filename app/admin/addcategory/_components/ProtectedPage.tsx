"use client";
import React, { useRef } from "react";
import { useCheckRole } from "@/lib/hooks/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { hasAccess, loading } = useCheckRole();

  if (loading) {
    return <div>Перевірка доступу...</div>;
  }
  if (!hasAccess) {
    return <div>Доступ заборонено. Будь ласка, увійдіть як адміністратор.</div>;
  }
  return <div ref={containerRef}>{children}</div>;
};

export default ProtectedRoute;
