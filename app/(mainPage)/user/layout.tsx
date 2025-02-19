"use client";

import { useMedia } from "use-media";
import { UserSidebar } from "./_components/UserSidebar";
import { AuthCheck } from "./_components/AuthCheck";

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const isMobile = useMedia({ maxWidth: "1000px" });

  return (
    <AuthCheck>
      <div className={`flex flex-1 ${isMobile ? "flex-col" : "flex-row"}`}>
        <UserSidebar isMobile={isMobile} />
        <div className="flex-1 p-4 h-full">{children}</div>
      </div>
    </AuthCheck>
  );
}
