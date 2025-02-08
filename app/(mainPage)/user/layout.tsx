import { Sidebar } from "./_components/sidebar";

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
        <Sidebar />
        {children}
        
    </div>
  );
}
