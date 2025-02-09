"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  size: string;
  availableSizes: string[];
  discount: number;
}

export default function Cart() {
  // Початкові дані для кошика
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Nike Air Max",
      price: 120,
      quantity: 2,
      imageUrl:
        "https://neposidko.com/image/cache/catalog//image/data/2tufli/25862-800x800.jpg",
      size: "42",
      availableSizes: ["40", "41", "42", "43", "44"],
      discount: 10,
    },
    {
      id: 2,
      name: "Adidas Ultraboost",
      price: 150,
      quantity: 1,
      imageUrl: "/images/adidas-ultraboost.png",
      size: "40",
      availableSizes: ["38", "39", "40", "41", "42"],
      discount: 0,
    },
  ]);

  // Обробка зміни кількості товару
  const handleQuantityChange = (id: number, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  // Обробка зміни розміру товару
  const handleSizeChange = (id: number, size: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, size } : item))
    );
  };

  // Видалення товару з кошика
  const handleRemoveItem = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Обчислення загальної суми з урахуванням знижки
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const effectivePrice = item.price * (1 - item.discount / 100);
      return total + effectivePrice * item.quantity;
    }, 0);
  };

  // Обробка переходу до оплати
  const handleCheckout = () => {
    // Реалізуйте логіку переходу до сплати або інтеграцію з платіжною системою
    alert("Продовжуємо до сплати!");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Кошик</h1>
      {cartItems.length === 0 ? (
        <p>Ваш кошик порожній</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row items-center p-4 border rounded-md"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="size-[100px] object-cover rounded"
              />
              <div className="flex-1 ml-0 md:ml-4 mt-4 md:mt-0">
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p>Ціна: ${item.price}</p>
                {item.discount > 0 && (
                  <p className="text-green-600">Знижка: {item.discount}%</p>
                )}
                <div className="flex flex-col sm:flex-row sm:items-center mt-2 space-y-2 sm:space-y-0 sm:space-x-4">
                  {/* Селект для вибору кількості */}
                  <div className="flex items-center space-x-2">
                    <label className="whitespace-nowrap">Кількість:</label>
                    <Select
                      value={String(item.quantity)}
                      onValueChange={(value) =>
                        handleQuantityChange(item.id, Number(value))
                      }
                    >
                      <SelectTrigger className="w-[100px]">
                        <span>{item.quantity}</span>
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(
                          (num) => (
                            <SelectItem key={num} value={String(num)}>
                              {num}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Селект для вибору розміру */}
                  <div className="flex items-center space-x-2">
                    <label className="whitespace-nowrap">Розмір:</label>
                    <Select
                      value={item.size}
                      onValueChange={(value) =>
                        handleSizeChange(item.id, value)
                      }
                    >
                      <SelectTrigger className="w-[100px]">
                        <span>{item.size}</span>
                      </SelectTrigger>
                      <SelectContent>
                        {item.availableSizes.map((sizeOption) => (
                          <SelectItem key={sizeOption} value={sizeOption}>
                            {sizeOption}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0 md:ml-4">
                <Button
                  variant="outline"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <Trash2 />
                  Видалити
                </Button>
              </div>
            </div>
          ))}
          <div className="flex flex-col md:flex-row justify-between items-center mt-4">
            <h2 className="text-2xl font-bold">
              Разом: ${getTotalPrice().toFixed(2)}
            </h2>
            <Button onClick={handleCheckout} className="mt-4 md:mt-0">
              Продовжити до сплати
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
