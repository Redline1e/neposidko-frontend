"use client";
import React, { useState, useEffect } from "react";
import {
  fetchAdminUsers,
  updateAdminUser,
  deleteAdminUser,
} from "@/lib/api/user-service";
import { Button } from "@/components/ui/button";
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
import { Trash2, Edit } from "lucide-react";

// Визначення типу User
interface User {
  userId: string;
  roleId: number;
  name: string;
  email: string;
  password: string;
  telephone: string;
  deliveryAddress: string;
}

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchAdminUsers();
        setUsers(data);
      } catch (error) {
        console.error("Помилка завантаження користувачів:", error);
      }
    };
    loadUsers();
  }, []);

  const handleUpdate = async (userId: string, data: Partial<User>) => {
    try {
      await updateAdminUser(userId, data);
      setUsers(users.map((u) => (u.userId === userId ? { ...u, ...data } : u)));
    } catch (error) {
      console.error("Помилка оновлення:", error);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await deleteAdminUser(userId);
      setUsers(users.filter((u) => u.userId !== userId));
    } catch (error) {
      console.error("Помилка видалення:", error);
    }
  };

  return (
    <div className="mx-auto mt-20 max-w-7xl px-4">
      <h1 className="text-2xl font-bold mb-6">Управління користувачами</h1>
      <table className="w-full border rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Ім'я</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Телефон</th>
            <th className="px-4 py-3 text-left">Роль</th>
            <th className="px-4 py-3 text-left">Дії</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userId} className="border-t">
              <td className="px-4 py-3">{user.userId}</td>
              <td className="px-4 py-3">
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) =>
                    handleUpdate(user.userId, { name: e.target.value })
                  }
                  className="border rounded p-1 w-full"
                />
              </td>
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3">{user.telephone}</td>
              <td className="px-4 py-3">
                <select
                  value={user.roleId}
                  onChange={(e) =>
                    handleUpdate(user.userId, {
                      roleId: Number(e.target.value),
                    })
                  }
                  className="border rounded p-1"
                >
                  <option value={1}>Адміністратор</option>
                  <option value={2}>Користувач</option>
                </select>
              </td>
              <td className="px-4 py-3">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Ви впевнені?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Ця дія видалить користувача назавжди. Продовжити?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Скасувати</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(user.userId)}
                      >
                        Видалити
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsersPage;
