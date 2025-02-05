import { Navbar } from "./_components/navbar";
import { Footer } from "./_components/footer";

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Add padding-top to main to make space for the navbar */}
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
    </div>
  );
}
