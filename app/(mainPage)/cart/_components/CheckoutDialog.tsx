"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Оновлена схема валідації з варіантами оплати: Повна оплата та Передоплата (200 грн)
const checkoutSchema = z.object({
  deliveryAddress: z.string().min(1, "Місце доставки є обов'язковим"),
  telephone: z
    .string()
    .min(1, "Телефон є обов'язковим")
    .refine(
      (val) => /^[0-9+\s()-]+$/.test(val),
      "Введіть коректний номер телефону"
    ),
  paymentMethod: z.enum(["full", "prepaid"]),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutDialogProps {
  orderId: number; // передається як число
  onCheckoutSuccess: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CheckoutDialog: React.FC<CheckoutDialogProps> = ({
  orderId,
  onCheckoutSuccess,
  isOpen: controlledOpen,
  onOpenChange,
}) => {
  // Використовуємо керований стан, якщо пропси передані, інакше – внутрішній стан
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryAddress: "",
      telephone: "",
      paymentMethod: "full", // за замовчуванням – Повна оплата
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (!orderId || isNaN(Number(orderId))) {
      console.error("orderId is missing or not a number:", orderId);
      toast.error("Помилка: orderId відсутній або не є числом");
      return;
    }
    console.log("orderId:", orderId, "form data:", data);
    try {
      const response = await fetch("http://localhost:5000/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: Number(orderId), ...data }), // Явно перетворюємо в число
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Не вдалося оформити замовлення");
      }
      const result = await response.json();
      toast.success(result.message || "Замовлення оформлено успішно");
      setOpen(false);
      reset();
      onCheckoutSuccess();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Помилка оформлення замовлення");
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Оформлення замовлення</DialogTitle>
          <DialogDescription>
            Введіть свої дані для доставки та оберіть спосіб оплати.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium">Місце доставки</label>
            <Input {...register("deliveryAddress")} placeholder="Ваша адреса" />
            {errors.deliveryAddress && (
              <p className="text-red-500 text-xs">
                {errors.deliveryAddress.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Телефон</label>
            <Input {...register("telephone")} placeholder="Ваш телефон" />
            {errors.telephone && (
              <p className="text-red-500 text-xs">{errors.telephone.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Спосіб оплати</label>
            <select
              {...register("paymentMethod")}
              className="border p-2 rounded-md w-full"
            >
              <option value="full">Повна оплата</option>
              <option value="prepaid">Передоплата (200 грн)</option>
            </select>
            {errors.paymentMethod && (
              <p className="text-red-500 text-xs">
                {errors.paymentMethod.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full">
            Підтвердити замовлення
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
