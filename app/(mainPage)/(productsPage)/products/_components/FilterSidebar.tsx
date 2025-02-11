import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export function FilterSidebar() {
  return (
    <Sidebar className="mt-[80px] ">
      <SidebarHeader className="p-4 text-xl font-semibold text-neutral-950 text-center">
        Фільтри
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup className="space-y-4">
          <div>
            <p className="font-medium text-neutral-900">Категорії</p>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <Checkbox />
                <span>Кросівки</span>
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox />
                <span>Ботинки</span>
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox />
                <span>Сандалі</span>
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox />
                <span>Туфлі</span>
              </label>
            </div>
          </div>
          <div>
            <p className="font-medium text-neutral-900">Розмір</p>
            <div className="space-y-2">
              {[36, 37, 38, 39, 40, 41, 42, 43].map((size) => (
                <label key={size} className="flex items-center space-x-2">
                  <Checkbox />
                  <span>{size}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="font-medium text-neutral-900">Ціна</p>
            <div className="space-y-2">
              {[
                "До 1000 грн",
                "1000 - 3000 грн",
                "3000 - 5000 грн",
                "5000+ грн",
              ].map((price) => (
                <label key={price} className="flex items-center space-x-2">
                  <Checkbox />
                  <span>{price}</span>
                </label>
              ))}
            </div>
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button className="w-full" variant="default">
          Застосувати фільтри
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
