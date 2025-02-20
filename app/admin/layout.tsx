"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCheckRole } from "@/lib/api/user-service";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./_components/AdminSidebar";
import { Loader2 } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
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
}
