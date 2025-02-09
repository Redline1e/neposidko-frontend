import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function AdminSidebar() {
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "";

  return (
    <Sidebar>
      <SidebarHeader className="p-4 text-xl font-semibold text-neutral-950 text-center">
        Адмін Панель
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup className="space-y-2">
          <Button variant="outline" className="w-full">
            <Link href="/admin/addproduct" className="block w-full">
              <p
                className={cn(
                  "text-neutral-900",
                  currentPath === "/admin/addproduct" ? "font-bold" : ""
                )}
              >
                Додати товар
              </p>
            </Link>
          </Button>
          <Button variant="outline" className="w-full">
            <Link href="/admin/addcategory" className="block w-full">
              <p
                className={cn(
                  "text-neutral-900",
                  currentPath === "/admin/addcategory" ? "font-bold" : ""
                )}
              >
                Додати категорію
              </p>
            </Link>
          </Button>
          <Button variant="outline" className="w-full">
            <Link href="/admin/manageproducts" className="block w-full">
              <p
                className={cn(
                  "text-neutral-900",
                  currentPath === "/admin/manageproducts" ? "font-bold" : ""
                )}
              >
                Управління товарами
              </p>
            </Link>
          </Button>
          <Button variant="outline" className="w-full">
            <Link href="/admin/manageusers" className="block w-full">
              <p
                className={cn(
                  "text-neutral-900",
                  currentPath === "/admin/manageusers" ? "font-bold" : ""
                )}
              >
                Управління користувачами
              </p>
            </Link>
          </Button>
          <Button variant="outline" className="w-full">
            <Link href="/admin/orders" className="block w-full">
              <p
                className={cn(
                  "text-neutral-900",
                  currentPath === "/admin/orders" ? "font-bold" : ""
                )}
              >
                Перегляд замовлень
              </p>
            </Link>
          </Button>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button className="text-center" variant="destructive">
          <Link href="/">Вийти з Адмін Панелі</Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
