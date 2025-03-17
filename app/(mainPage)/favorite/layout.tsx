import React from "react";

interface BrowseLayoutProps {
  children: React.ReactNode;
}

const BrowseLayout: React.FC<BrowseLayoutProps> = ({ children }) => {
  return (
    <main className="flex-1 flex justify-center bg-gray-50">{children}</main>
  );
};

export default BrowseLayout;
