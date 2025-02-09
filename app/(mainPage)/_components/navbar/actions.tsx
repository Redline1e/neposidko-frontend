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

const actionLinks = [
  { name: "Головна", href: "/", icon: Home },
  { name: "Товари", href: "/products", icon: ShoppingBag },
  { name: "Контакти", href: "/contact", icon: Phone },
  { name: "Обране", href: "/favorite", icon: Heart },
  { name: "Кошик", href: "/cart", icon: ShoppingCart },
];

export const Actions = () => {
  const isWide = useMedia({ minWidth: "1320px" });

  return (
    <>
      {isWide && (
        <ul className="flex items-center gap-5 pr-5 -ml-20 text-neutral-700">
          {actionLinks.map((link, index) => (
            <li key={index}>
              <Link href={link.href} className="flex items-center gap-2">
                <link.icon className="w-5 h-5" />
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
                  <div className="-mt-2 ">Меню</div>
                </SheetTitle>
              </SheetHeader>
              <SheetDescription>
                <ul className="flex flex-col pt-5 gap-6 items-start text-xl text-neutral-700">
                  {actionLinks.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-2"
                      >
                        <link.icon className="w-5 h-5" />
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
          <Link href="/favorite" className="flex items-center gap-2">
            <Heart className="w-5 h-5 " />
          </Link>
          <Link href="/cart" className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
          </Link>
        </div>
      )}
    </>
  );
};
// export const ActionSkeleton = () => {
//   return (
//     <div className="flex flex-col gap-4">
//       <Skeleton className="w-32 h-6 mb-3" />
//       <Skeleton className="w-32 h-6 mb-3" />
//       <Skeleton className="w-32 h-6 mb-3" />
//     </div>
//   );
// };
