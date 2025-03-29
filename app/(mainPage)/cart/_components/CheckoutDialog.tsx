"use client";

import React, { useState, useEffect } from "react";
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
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/hooks/getToken";
import { apiClient } from "@/utils/apiClient";
import { useAuth } from "@/lib/hooks/auth";
import { Check } from "lucide-react"; // імпортуємо іконку галочки

// Схема валідації
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
  orderId?: number;
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
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  const router = useRouter();

  // Використовуємо наш хук для визначення автентифікації
  const { isAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryAddress: "",
      telephone: "",
      paymentMethod: "full",
    },
  });

  // Відновлення даних форми
  useEffect(() => {
    const savedData = localStorage.getItem("checkoutFormData");
    if (savedData) {
      const formData = JSON.parse(savedData);
      setValue("deliveryAddress", formData.deliveryAddress);
      setValue("telephone", formData.telephone);
      setValue("paymentMethod", formData.paymentMethod);
    }
  }, [setValue]);

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      const token = getToken();
      const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");

      if (token) {
        // Для авторизованих користувачів
        const response = await apiClient.post(
          "/orders/checkout",
          { ...data },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(response.data.message || "Замовлення оформлено успішно");
      } else {
        // Для гостей
        if (!cartItems.length) {
          toast.error("Кошик порожній");
          return;
        }
        const response = await apiClient.post("/orders/guest-checkout", {
          ...data,
          cartItems,
        });
        localStorage.removeItem("cart");
        toast.success(response.data.message || "Замовлення оформлено успішно");
      }

      localStorage.removeItem("checkoutFormData");
      setOpen(false);
      reset();
      onCheckoutSuccess();
    } catch (error: any) {
      toast.error(error.message || "Помилка оформлення замовлення");
    }
  };

  const handleRegister = () => {
    const formData = {
      deliveryAddress:
        (document.getElementById("deliveryAddress") as HTMLInputElement)
          ?.value || "",
      telephone:
        (document.getElementById("telephone") as HTMLInputElement)?.value || "",
      paymentMethod:
        (document.getElementById("paymentMethod") as HTMLSelectElement)
          ?.value || "full",
    };
    localStorage.setItem("checkoutFormData", JSON.stringify(formData));
    localStorage.setItem("returnToCheckout", "true");
    router.push("/register");
  };

  const handleLogin = () => {
    const formData = {
      deliveryAddress:
        (document.getElementById("deliveryAddress") as HTMLInputElement)
          ?.value || "",
      telephone:
        (document.getElementById("telephone") as HTMLInputElement)?.value || "",
      paymentMethod:
        (document.getElementById("paymentMethod") as HTMLSelectElement)
          ?.value || "full",
    };
    localStorage.setItem("checkoutFormData", JSON.stringify(formData));
    localStorage.setItem("returnToCheckout", "true");
    router.push("/login");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-md p-6 shadow-lg rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Оформлення замовлення
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Введіть свої дані для доставки та оберіть спосіб оплати.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Місце доставки
            </label>
            <Input
              id="deliveryAddress"
              {...register("deliveryAddress")}
              placeholder="Ваша адреса"
            />
            {errors.deliveryAddress && (
              <p className="mt-1 text-destructive text-sm">
                {errors.deliveryAddress.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Телефон
            </label>
            <Input
              id="telephone"
              {...register("telephone")}
              placeholder="Ваш телефон"
            />
            {errors.telephone && (
              <p className="mt-1 text-destructive text-sm">
                {errors.telephone.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Спосіб оплати
            </label>
            <select
              id="paymentMethod"
              {...register("paymentMethod")}
              className="border p-2 rounded-md w-full"
            >
              <option value="full">Повна оплата</option>
              <option value="prepaid">Передоплата (200 грн)</option>
            </select>
            {errors.paymentMethod && (
              <p className="mt-1 text-destructive text-sm">
                {errors.paymentMethod.message}
              </p>
            )}
          </div>
          {/* Блок авторизації */}
          {!isAuthenticated ? (
            <div className="mt-4 p-4 border rounded-md bg-gray-100 flex flex-col space-y-2">
              <p className="text-sm text-gray-700">
                Зареєструйтесь або увійдіть, щоб відстежувати статус вашого
                замовлення у особистому кабінеті.
              </p>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRegister}
                >
                  Зареєструватися
                </Button>
                <Button type="button" variant="outline" onClick={handleLogin}>
                  Увійти
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-4 border rounded-md bg-green-100 flex items-center space-x-2">
              <Check size={24} className="text-green-600" />
              <p className="text-sm text-green-700">Ви авторизовані</p>
            </div>
          )}
          <Button type="submit" className="w-full mt-2">
            Підтвердити замовлення
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
