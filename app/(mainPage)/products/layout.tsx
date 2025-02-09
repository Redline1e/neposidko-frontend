import { SidebarProvider } from "@/components/ui/sidebar";
import { FilterSidebar } from "./_components/FilterSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <FilterSidebar />
        <main className="">
          <div className="">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
