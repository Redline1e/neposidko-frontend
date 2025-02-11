"use client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteUser } from "@/lib/user-service";

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
    <aside className="w-full sm:w-64 bg-gray-800 text-white p-4 flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-6 text-center">
        Меню Користувача
      </h2>
      <div className="flex flex-col mt-auto">
        <Button variant="secondary" className="mb-4" onClick={handleLogout}>
          Вийти
        </Button>
        <Button variant="destructive" onClick={handleDeleteAccount}>
          Видалити акаунт
        </Button>
      </div>
    </aside>
  );
};
