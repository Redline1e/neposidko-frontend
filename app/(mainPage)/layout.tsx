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
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
