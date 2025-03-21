"use client";

import React, { useMemo, useState } from "react";
import CheckoutDialog from "./CheckoutDialog";
import { OrderItemData } from "@/utils/types";
import { Button } from "@/components/ui/button";

interface OrderTotalProps {
  orderItems: OrderItemData[];
  orderId: number;
  onCheckoutSuccess: () => void;
}

const OrderTotal: React.FC<OrderTotalProps> = ({
  orderItems,
  orderId,
  onCheckoutSuccess,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { totalOriginalPrice, totalPrice, totalDiscount } = useMemo(() => {
    const totalOriginalPrice = orderItems.reduce((sum, item) => {
      const salePrice = item.price;
      const discountPercent = item.discount;
      const originalPrice =
        discountPercent > 0
          ? salePrice / (1 - discountPercent / 100)
          : salePrice;
      return sum + originalPrice * item.quantity;
    }, 0);

    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return {
      totalOriginalPrice,
      totalPrice,
      totalDiscount: totalOriginalPrice - totalPrice,
    };
  }, [orderItems]);

  return (
    <div className="bg-blue-50 p-6 rounded-lg w-full md:w-80 h-48">
      <p className="flex justify-between text-gray-700">
        <span>Сума замовлення:</span>
        <span>{totalOriginalPrice.toFixed(0)} грн.</span>
      </p>
      <p className="flex justify-between text-destructive">
        <span>Знижка:</span>
        <span>-{totalDiscount.toFixed(0)} грн.</span>
      </p>
      <hr className="my-2" />
      <p className="flex justify-between text-lg font-semibold">
        <span>Разом:</span>
        <span>{totalPrice.toFixed(0)} грн.</span>
      </p>
      <Button
        onClick={() => setDialogOpen(true)}
        className="w-full mt-4 bg-green-500 text-white"
      >
        ОФОРМИТИ ЗАМОВЛЕННЯ
      </Button>
      <CheckoutDialog
        orderId={orderId}
        onCheckoutSuccess={() => {
          onCheckoutSuccess();
          setDialogOpen(false);
        }}
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default OrderTotal;
