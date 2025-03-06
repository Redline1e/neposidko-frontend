"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCheckRole } from "@/lib/hooks/auth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./_components/AdminSidebar";
import { Loader2 } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
  const { hasAccess, loading } = useCheckRole();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !hasAccess) {
      router.push("/");
    }
  }, [hasAccess, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center animate-spin">
        <Loader2 />
      </div>
    );
  }
  if (!hasAccess) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <main className="flex-1">
          <SidebarTrigger />
          <div>{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
