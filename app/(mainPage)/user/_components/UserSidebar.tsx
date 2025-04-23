"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteUser } from "@/lib/api/user-service";
import { History, LogOut, Pen, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMedia } from "use-media";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UserSidebarProps {
  isMobile?: boolean;
}

export const UserSidebar: React.FC<UserSidebarProps> = ({ isMobile }) => {
  const isSmallScreen = useMedia({ maxWidth: "415px" });

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUser();
      toast.success("Акаунт видалено!");
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch {
      toast.error("Не вдалося видалити акаунт");
    }
  };

  return (
    <aside
      className={`${
        isMobile ? "w-full" : "w-64"
      } bg-neutral-800 text-white p-6 flex flex-col ${
        isMobile ? "h-auto" : "min-h-screen pb-24"
      } shadow-lg `}
    >
      {!isMobile && (
        <h2 className="text-xl font-semibold mb-6 text-center">
          Меню Користувача
        </h2>
      )}

      <nav
        className={isMobile ? "grid grid-cols-2 gap-4" : "flex flex-col gap-4"}
      >
        <Link href="/user/user-edit">
          <Button
            variant="secondary"
            className={
              isMobile
                ? isSmallScreen
                  ? "py-1 px-1 text-xs flex items-center justify-center gap-1"
                  : "py-2 px-2 text-sm flex items-center justify-center gap-1"
                : "w-full flex items-center justify-center gap-2"
            }
          >
            <Pen
              className={
                isMobile ? (isSmallScreen ? "w-3 h-3" : "w-4 h-4") : "w-5 h-5"
              }
            />
            Змінити інформацію
          </Button>
        </Link>
        <Link href="/user/order-history">
          <Button
            variant="secondary"
            className={
              isMobile
                ? isSmallScreen
                  ? "py-1 px-1 text-xs flex items-center justify-center gap-1"
                  : "py-2 px-2 text-sm flex items-center justify-center gap-1"
                : "w-full flex items-center justify-center gap-2"
            }
          >
            <History
              className={
                isMobile ? (isSmallScreen ? "w-3 h-3" : "w-4 h-4") : "w-5 h-5"
              }
            />
            Історія замовлень
          </Button>
        </Link>
      </nav>

      <div
        className={
          isMobile
            ? "grid grid-cols-2 gap-4 mt-6"
            : "flex flex-col mt-auto space-y-4"
        }
      >
        <Button
          variant="secondary"
          className={
            isMobile
              ? isSmallScreen
                ? "py-1 px-1 text-xs flex items-center justify-center gap-1"
                : "py-2 px-2 text-sm flex items-center justify-center gap-1"
              : "flex items-center justify-center gap-2"
          }
          onClick={handleLogout}
        >
          <LogOut
            className={
              isMobile ? (isSmallScreen ? "w-3 h-3" : "w-4 h-4") : "w-5 h-5"
            }
          />
          <span>Вийти</span>
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className={
                isMobile
                  ? isSmallScreen
                    ? "py-1 px-1 text-xs flex items-center justify-center gap-1"
                    : "py-2 px-2 text-sm flex items-center justify-center gap-1"
                  : "flex items-center justify-center gap-2"
              }
            >
              <Trash2
                className={
                  isMobile ? (isSmallScreen ? "w-3 h-3" : "w-4 h-4") : "w-5 h-5"
                }
              />
              <span>Видалити акаунт</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Ви впевнені?</AlertDialogTitle>
              <AlertDialogDescription>
                Ви впевнені, що хочете видалити акаунт? Цю дію неможливо
                скасувати!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Скасувати</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete}>
                Видалити
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  );
};
