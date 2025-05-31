"use client";

import Link from "next/link";
import Image from "next/image";
import { Category } from "@/utils/types";

interface CategoriesItemProps {
  category: Category;
}

export const CategoriesItem: React.FC<CategoriesItemProps> = ({ category }) => {
  return (
    <Link
      href={`/products?categories=${category.categoryId}`}
      className="cursor-pointer"
    >
      <div className="bg-white shadow-md rounded-xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">
        <div className="w-full aspect-square relative">
          <Image
            src={category.imageUrl}
            alt={category.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          {/* 
            Текст вирівняний ліворуч (text-left). 
            Додаємо break-words, щоб слова переносилися всередині блоку і не вилазили за межі.
          */}
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 text-left break-words">
            {category.name}
          </h2>
        </div>
      </div>
    </Link>
  );
};
