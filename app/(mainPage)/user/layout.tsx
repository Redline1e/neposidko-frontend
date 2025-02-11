"use client";
import { UserSidebar } from "./_components/sidebar";
import { AuthCheck } from "./_components/AuthCheck";

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <AuthCheck>
      <div className="flex flex-1">
        <UserSidebar />
        <div className="flex-1 p-4 h-full">
          {children}
        </div>
      </div>
    </AuthCheck>
  );
}
