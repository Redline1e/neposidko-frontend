"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { toast } from "sonner";

export const Sidebar = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
      const res = await fetch(`${API_URL}/api/user`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Помилка видалення акаунта");

      toast.success("Акаунт видалено!");
      localStorage.removeItem("token");
      // router.push("/register");
    } catch (error) {
      toast.error("Не вдалося видалити акаунт");
    }
  };

  return (
    <aside className="w-full sm:w-64 bg-gray-800 text-white h-screen p-4 flex flex-col">
      <h2 className="text-lg font-semibold mb-6">Меню</h2>
      <Button variant="secondary" className="mb-4" onClick={handleLogout}>
        Вийти
      </Button>
      <Button variant="destructive" onClick={handleDeleteAccount}>
        Видалити акаунт
      </Button>
    </aside>
  );
};
