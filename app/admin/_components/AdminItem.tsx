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
    await onSave(formData);
    setIsEditOpen(false);
  };

  const handleDelete = async () => {
    await onDelete(item);
    setIsDeleteOpen(false);
  };

  const handleToggleActive = async (checked?: boolean) => {
    if (!("isActive" in formData)) return;
    const currentStatus = (formData as any).isActive;
    const newStatus = typeof checked === "boolean" ? checked : !currentStatus;
    try {
      await onToggleActive?.(formData, newStatus);
      setFormData((prev) => ({ ...prev, isActive: newStatus }));
    } catch (error) {
      console.error("Error toggling active status:", error);
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
                    (formData as any).isActive
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {(formData as any).isActive ? "Активний" : "Не активний"}
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
          {onToggleActive && (
            <ContextMenuItem
              onPointerDown={(e) => e.stopPropagation()}
              className="gap-x-2"
            >
              <Switch
                checked={(formData as any).isActive}
                onCheckedChange={handleToggleActive}
              />
              <span>
                {(formData as any).isActive ? "Активний" : "Не активний"}
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
        <DialogContent className="w-[800px] max-w-full">
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
              className="btn-secondary"
            >
              Відмінити
            </button>
            <button onClick={handleSave} className="btn-primary">
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
            <AlertDialogCancel className="btn-secondary">
              Скасувати
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="btn-danger">
              Видалити
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
