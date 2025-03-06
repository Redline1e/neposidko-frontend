import React, { useMemo } from "react";
import { OrderItemData } from "@/utils/types";

interface OrderTotalProps {
  orderItems: OrderItemData[];
}

const OrderTotal: React.FC<OrderTotalProps> = ({ orderItems }) => {
  const { totalOriginalPrice, totalPrice, totalDiscount } = useMemo(() => {
    const totalOriginalPrice = orderItems.reduce(
      (sum, item) => sum + (item.price + item.discount) * item.quantity,
      0
    );
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
    <div className="bg-blue-50 p-6 rounded-lg w-full md:w-80 h-[200px]">
      <p className="flex justify-between text-gray-700">
        <span>Сума замовлення:</span>
        <span>{totalOriginalPrice} грн.</span>
      </p>
      <p className="flex justify-between text-red-500">
        <span>Знижка:</span>
        <span>-{totalDiscount} грн.</span>
      </p>
      <hr className="my-2" />
      <p className="flex justify-between text-lg font-semibold">
        <span>Разом:</span>
        <span>{totalPrice} грн.</span>
      </p>
      <button className="w-full mt-4 bg-green-500 text-white py-2 rounded-lg">
        ОФОРМИТИ ЗАМОВЛЕННЯ
      </button>
    </div>
  );
};

export default OrderTotal;
