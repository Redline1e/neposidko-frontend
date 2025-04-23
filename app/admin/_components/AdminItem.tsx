"use client";
import React, { useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Pen, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface AdminItemProps<T extends object> {
  item: T;
  renderCard: (item: T) => React.ReactNode;
  renderEditForm: (
    item: T,
    onChange: (changed: Partial<T>) => void
  ) => React.ReactNode;
  onSave: (item: T) => Promise<void>;
  onDelete: (item: T) => Promise<void>;
  itemLabel: string;
  onToggleActive?: (item: T, newStatus: boolean) => Promise<void>;
}

export function AdminItem<T extends object>({
  item,
  renderCard,
  renderEditForm,
  onSave,
  onDelete,
  itemLabel,
  onToggleActive,
}: AdminItemProps<T>): React.JSX.Element {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formData, setFormData] = useState<T>(item);

  const handleSave = async () => {
    try {
      await onSave(formData);
      setIsEditOpen(false);
    } catch (error) {
      console.error(`Помилка збереження ${itemLabel}:`, error);
      alert(`Не вдалося зберегти ${itemLabel}`);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(item);
      setIsDeleteOpen(false);
    } catch (error) {
      console.error(`Помилка видалення ${itemLabel}:`, error);
      alert(`Не вдалося видалити ${itemLabel}`);
    }
  };

  const handleToggleActive = async (checked: boolean) => {
    if (!onToggleActive || !("isActive" in formData)) return;
    try {
      await onToggleActive(formData, checked);
      setFormData((prev) => ({ ...prev, isActive: checked } as T));
    } catch (error) {
      console.error("Помилка зміни статусу:", error);
      alert("Не вдалося змінити статус");
    }
  };

  const handleFormChange = (changed: Partial<T>) => {
    setFormData((prev) => ({ ...prev, ...changed }));
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="relative">
            {renderCard(formData)}
            {onToggleActive && "isActive" in formData && (
              <div className="absolute top-2 right-2">
                <span
                  className={`ml-2 text-md font-semibold ${
                    (formData as { isActive?: boolean }).isActive
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {(formData as { isActive?: boolean }).isActive
                    ? "Активний"
                    : "Неактивний"}
                </span>
              </div>
            )}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            onSelect={() => setIsEditOpen(true)}
            className="gap-x-2"
          >
            <Pen size={17} /> Відредагувати {itemLabel}
          </ContextMenuItem>
          {onToggleActive && "isActive" in formData && (
            <ContextMenuItem
              onPointerDown={(e) => e.stopPropagation()}
              className="gap-x-2"
            >
              <Switch
                checked={(formData as { isActive?: boolean }).isActive}
                onCheckedChange={handleToggleActive}
              />
              <span>
                {(formData as { isActive?: boolean }).isActive
                  ? "Активний"
                  : "Неактивний"}
              </span>
            </ContextMenuItem>
          )}
          <ContextMenuItem
            onSelect={() => setIsDeleteOpen(true)}
            className="gap-x-2"
          >
            <Trash2 size={17} /> Видалити {itemLabel}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="w-[800px] max-w-full max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редагувати {itemLabel}</DialogTitle>
            <DialogDescription>
              Змініть дані {itemLabel.toLowerCase()} та збережіть зміни.
            </DialogDescription>
          </DialogHeader>
          {renderEditForm(formData, handleFormChange)}
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setIsEditOpen(false)}
              className="btn-secondary px-4 py-2 rounded"
            >
              Відмінити
            </button>
            <button
              onClick={handleSave}
              className="btn-primary px-4 py-2 rounded bg-blue-500 text-white"
            >
              Зберегти
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Підтвердіть видалення</AlertDialogTitle>
            <AlertDialogDescription>
              Ви впевнені, що хочете видалити цей {itemLabel.toLowerCase()}? Ця
              дія не може бути скасована.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <AlertDialogCancel className="btn-secondary px-4 py-2 rounded">
              Скасувати
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="btn-danger px-4 py-2 rounded bg-red-500 text-white"
            >
              Видалити
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
