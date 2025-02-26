"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { useEffect, useState } from "react";
import { fetchFavorites } from "@/lib/api/favorites-service";

const actionLinks = [
  { name: "Головна", href: "/", icon: Home },
  { name: "Товари", href: "/products", icon: ShoppingBag },
  { name: "Контакти", href: "/contact", icon: Phone },
  { name: "Обране", href: "/favorite", icon: Heart },
  { name: "Кошик", href: "/cart", icon: ShoppingCart },
];

export const Actions = () => {
  const isWide = useMedia({ minWidth: "1320px" });
  const [favoriteCount, setFavoriteCount] = useState<number>(0);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favorites = await fetchFavorites();
        setFavoriteCount(favorites.length);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };
    loadFavorites();
  }, []);

  return (
    <>
      {isWide && (
        <ul className="flex items-center gap-5 pr-5 -ml-20 text-neutral-700">
          {actionLinks.map((link, index) => (
            <li key={index} className="relative">
              <Link href={link.href} className="flex items-center gap-2">
                <link.icon className="w-5 h-5" />
                {link.name === "Обране" && favoriteCount > 0 && (
                  <span className="absolute -top-1 left-3 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {favoriteCount}
                  </span>
                )}
                <span>{link.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {!isWide && (
        <div className="flex items-center px-5 gap-5">
          <Sheet>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>
                  <div className="-mt-2">Меню</div>
                </SheetTitle>
              </SheetHeader>
              <SheetDescription asChild>
                <ul className="flex flex-col pt-5 gap-6 items-start text-xl text-neutral-700">
                  {actionLinks.map((link, index) => (
                    <li key={index} className="relative">
                      <Link
                        href={link.href}
                        className="flex items-center gap-2"
                      >
                        <link.icon className="w-5 h-5" />
                        {link.name === "Обране" && favoriteCount > 0 && (
                          <span className="absolute -top-1 left-3 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                            {favoriteCount}
                          </span>
                        )}
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </SheetDescription>
            </SheetContent>
            <SheetTrigger>
              <Menu />
            </SheetTrigger>
          </Sheet>
          <Link href="/favorite" className="flex items-center gap-2 relative">
            <Heart className="w-5 h-5" />
            {favoriteCount > 0 && (
              <span className="absolute -top-1 left-3 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {favoriteCount}
              </span>
            )}
          </Link>
          <Link href="/cart" className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
          </Link>
        </div>
      )}
    </>
  );
};
