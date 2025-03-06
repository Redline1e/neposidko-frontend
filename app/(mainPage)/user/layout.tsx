"use client";

import React from "react";
import { useMedia } from "use-media";
import { UserSidebar } from "./_components/UserSidebar";
import AuthCheck from "./_components/AuthCheck";

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const isMobile = useMedia({ maxWidth: "1000px" });

  return (
    <AuthCheck>
      <div className={`flex flex-1 ${isMobile ? "flex-col" : "flex-row"}`}>
        <UserSidebar isMobile={isMobile} />
        <div className="flex-1 p-4 h-full">{children}</div>
      </div>
    </AuthCheck>
  );
};

export default UserLayout;
