import React from "react";
import { Navbar } from "./_components/navbar";
import { Footer } from "./_components/footer";
import { Toaster } from "sonner";

interface BrowseLayoutProps {
  children: React.ReactNode;
}

const BrowseLayout: React.FC<BrowseLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Toaster />
      <Navbar />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <Footer />
    </div>
  );
};

export default BrowseLayout;
