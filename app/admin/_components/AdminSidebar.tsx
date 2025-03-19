import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { cn } from "@/lib/api/utils";
import { Button } from "@/components/ui/button";
import React from "react";

export function AdminSidebar(): React.JSX.Element {
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
            <Link href="/admin" className="block w-full">
              <p
                className={cn(
                  "text-neutral-900",
                  currentPath === "/admin" && "font-bold"
                )}
              >
                Головна(Пошук)
              </p>
            </Link>
          </Button>
          <Button variant="outline" className="w-full">
            <Link href="/admin/addproduct" className="block w-full">
              <p
                className={cn(
                  "text-neutral-900",
                  currentPath === "/admin/addproduct" && "font-bold"
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
                  currentPath === "/admin/addcategory" && "font-bold"
                )}
              >
                Додати категорію
              </p>
            </Link>
          </Button>
          <Button variant="outline" className="w-full">
            <Link href="/admin/addbrand" className="block w-full">
              <p
                className={cn(
                  "text-neutral-900",
                  currentPath === "/admin/addbrand" && "font-bold"
                )}
              >
                Додати бренд
              </p>
            </Link>
          </Button>
          <Button variant="outline" className="w-full">
            <Link href="/admin/statistics" className="block w-full">
              <p
                className={cn(
                  "text-neutral-900",
                  currentPath === "/admin/statistics" && "font-bold"
                )}
              >
                Переглянути статистику
              </p>
            </Link>
          </Button>
          <Button variant="outline" className="w-full">
            <Link href="/admin/excel" className="block w-full">
              <p
                className={cn(
                  "text-neutral-900",
                  currentPath === "/admin/excel" && "font-bold"
                )}
              >
                Excel
              </p>
            </Link>
          </Button>
          <Button variant="outline" className="w-full">
            <Link href="/admin/reviews" className="block w-full">
              <p
                className={cn(
                  "text-neutral-900",
                  currentPath === "/admin/reviews" && "font-bold"
                )}
              >
                Управління відгуками
              </p>
            </Link>
          </Button>
          <Button variant="outline" className="w-full">
            <Link href="/admin/users" className="block w-full">
              <p
                className={cn(
                  "text-neutral-900",
                  currentPath === "/admin/users" && "font-bold"
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
                  currentPath === "/admin/orders" && "font-bold"
                )}
              >
                Управління замовленнями
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
