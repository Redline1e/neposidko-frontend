import { Navbar } from "./_components/navbar";
import { Footer } from "./_components/footer";
import { Toaster } from "sonner";

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Toaster />
      <Navbar />
      <main className="flex-1 flex">
        {children}
      </main>
      <Footer />
    </div>
  );
}
