"use client";

import React, { useState, useMemo } from "react";
import { OrderItemData } from "@/utils/types";
import CheckoutDialog from "./CheckoutDialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/auth";
import ReCAPTCHA from "react-google-recaptcha";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCaptchaOpen, setIsCaptchaOpen] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const { isAuthenticated } = useAuth();

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

  const handleCheckoutClick = () => {
    if (isAuthenticated) {
      // Для авторизованих користувачів одразу відкриваємо діалог
      setIsDialogOpen(true);
    } else {
      // Для неавторизованих показуємо CAPTCHA
      setIsCaptchaOpen(true);
    }
  };

  const handleCaptchaSuccess = (token: string | null) => {
    setCaptchaToken(token);
    setIsCaptchaOpen(false);
    setIsDialogOpen(true); // Відкриваємо діалог після успішного CAPTCHA
  };

  const handleCaptchaExpired = () => {
    setCaptchaToken(null);
  };

  // Перевірка наявності ключа reCAPTCHA
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!siteKey) {
    throw new Error("NEXT_PUBLIC_RECAPTCHA_TOKEN is not defined");
  }

  return (
    <div className="bg-blue-50 p-6 rounded-lg w-full md:w-80 h-auto">
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
        onClick={handleCheckoutClick}
        className="w-full mt-4 bg-green-500 text-white"
      >
        ОФОРМИТИ ЗАМОВЛЕННЯ
      </Button>

      {/* CAPTCHA для неавторизованих користувачів */}
      {isCaptchaOpen && !isAuthenticated && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              Будь ласка, пройдіть перевірку
            </h3>
            <ReCAPTCHA
              sitekey={siteKey}
              onChange={handleCaptchaSuccess}
              onExpired={handleCaptchaExpired}
            />
            <Button
              onClick={() => setIsCaptchaOpen(false)}
              className="mt-4 w-full"
              variant="outline"
            >
              Відмінити
            </Button>
          </div>
        </div>
      )}

      <CheckoutDialog
        orderId={orderId}
        onCheckoutSuccess={() => {
          onCheckoutSuccess();
          setIsDialogOpen(false);
        }}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        captchaToken={captchaToken} 
      />
    </div>
  );
};

export default OrderTotal;
