"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteUser } from "@/lib/user-service";
import { LogOut, Trash2 } from "lucide-react"; // Додаємо іконки

export const UserSidebar = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Ви впевнені, що хочете видалити акаунт? Цю дію неможливо скасувати!"
      )
    ) {
      return;
    }

    try {
      await deleteUser(localStorage.getItem("token")!);
      toast.success("Акаунт видалено!");
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch {
      toast.error("Не вдалося видалити акаунт");
    }
  };

  return (
    <aside className="w-full sm:w-64 bg-neutral-800 text-white p-6 flex flex-col h-full shadow-lg">
      <h2 className="text-xl font-semibold mb-6 text-center">
        Меню Користувача
      </h2>

      <nav className="flex flex-col gap-4">
        {/* Тут можна додати посилання, якщо потрібно */}
      </nav>

      <div className="flex flex-col mt-auto space-y-4">
        <Button
          variant="secondary"
          className="flex items-center justify-center gap-2 transition-all hover:bg-neutral-700/90"
          onClick={handleLogout}
        >
          <LogOut className="size-5" /> Вийти
        </Button>

        <Button
          variant="destructive"
          className="flex items-center justify-center gap-2 transition-all hover:bg-red-700/90"
          onClick={handleDeleteAccount}
        >
          <Trash2 className="size-5" /> Видалити акаунт
        </Button>
      </div>
    </aside>
  );
};
