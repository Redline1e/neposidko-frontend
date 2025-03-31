"use client";

import React, { useEffect, useState } from "react";
import {
  Menu,
  Home,
  ShoppingBag,
  Phone,
  ShoppingCart,
  Heart,
} from "lucide-react";
import Link from "next/link";
import useMedia from "use-media";
import { fetchFavoritesCount } from "@/lib/api/favorites-service";
import { fetchCartCount } from "@/lib/api/order-items-service";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DialogTitle } from "@radix-ui/react-dialog";

interface ActionLink {
  name: string;
  href: string;
  icon: React.ElementType;
}

const actionLinks: ActionLink[] = [
  { name: "Головна", href: "/", icon: Home },
  { name: "Товари", href: "/products", icon: ShoppingBag },
  { name: "Контакти", href: "/contact", icon: Phone },
  { name: "Обране", href: "/favorite", icon: Heart },
  { name: "Кошик", href: "/cart", icon: ShoppingCart },
];

export const Actions = () => {
  const isWide = useMedia({ minWidth: "1150px" });
  const [favoriteCount, setFavoriteCount] = useState<number>(0);
  const [orderItemsCount, setOrderItemsCount] = useState<number>(0);

  // Функція для оновлення лічильників
  const updateCounts = async () => {
    try {
      const favCount = await fetchFavoritesCount();
      const cartCount = await fetchCartCount();
      setFavoriteCount(favCount);
      setOrderItemsCount(cartCount);
    } catch (error) {
      console.error("Помилка оновлення лічильників:", error);
    }
  };

  // Завантаження початкових значень
  useEffect(() => {
    updateCounts();
  }, []);

  // Обробник глобальних подій для оновлення лічильників
  useEffect(() => {
    const handleUpdate = () => updateCounts();
    window.addEventListener("favoritesUpdated", handleUpdate);
    window.addEventListener("cartUpdated", handleUpdate);
    return () => {
      window.removeEventListener("favoritesUpdated", handleUpdate);
      window.removeEventListener("cartUpdated", handleUpdate);
    };
  }, []);

  return (
    <>
      {isWide ? (
        <ul className="flex items-center gap-6 text-neutral-700 font-open-sans mr-4">
          {actionLinks.map((link, index) => (
            <li key={index} className="relative">
              <Link
                href={link.href}
                className="flex items-center gap-2 hover:text-neutral-500 transition-colors duration-200"
              >
                <link.icon className="w-6 h-6" />
                {link.name === "Обране" && favoriteCount > 0 && (
                  <span className="absolute -top-1 left-4 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {favoriteCount}
                  </span>
                )}
                {link.name === "Кошик" && orderItemsCount > 0 && (
                  <span className="absolute -top-1 left-4 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {orderItemsCount}
                  </span>
                )}
                <span className="text-base">{link.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex items-center gap-4 px-4 -mr-2">
          {/* Обране */}
          <Link href="/favorite" className="relative" aria-label="Обране">
            <Heart className="w-6 h-6 text-neutral-700 hover:text-neutral-500 transition-colors duration-200" />
            {favoriteCount > 0 && (
              <span className="absolute -top-1 left-4 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {favoriteCount}
              </span>
            )}
          </Link>

          {/* Кошик */}
          <Link href="/cart" className="relative" aria-label="Кошик">
            <ShoppingCart className="w-6 h-6 text-neutral-700 hover:text-neutral-500 transition-colors duration-200" />
            {orderItemsCount > 0 && (
              <span className="absolute -top-1 left-4 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {orderItemsCount}
              </span>
            )}
          </Link>

          {/* Бургер-меню */}
          <Sheet>
            <SheetTrigger className="p-2 rounded-md border-none focus:outline-none">
              <Menu className="w-6 h-6 text-neutral-700 hover:text-neutral-500 transition-colors duration-200" />
            </SheetTrigger>
            <SheetContent side="right" className="w-64 bg-white">
              <DialogTitle className="sr-only">Sidebar Menu</DialogTitle>
              <ul className="flex flex-col gap-4 mt-6">
                {actionLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-3 text-lg font-medium text-neutral-700 hover:text-neutral-500 transition-colors duration-200 font-open-sans"
                    >
                      <link.icon className="w-6 h-6" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </>
  );
};
