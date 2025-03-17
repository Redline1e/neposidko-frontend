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
      <div
        className={`${
          isMobile ? "h-auto flex flex-col" : "min-h-screen flex flex-row"
        }`}
      >
        <UserSidebar isMobile={isMobile} />
        <div className={`${isMobile ? "p-4" : "flex-1 p-4 overflow-y-auto"}`}>
          {children}
        </div>
      </div>
    </AuthCheck>
  );
};

export default UserLayout;
