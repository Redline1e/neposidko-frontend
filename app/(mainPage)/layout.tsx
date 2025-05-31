import React from "react";

import { Footer } from "./_components/footer/Footer";
import { Toaster } from "sonner";
import { Navbar } from "./_components/navbar/Navbar";

interface BrowseLayoutProps {
  children: React.ReactNode;
}

const BrowseLayout: React.FC<BrowseLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Toaster />
      <Navbar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default BrowseLayout;
