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
        {category.imageUrl && (
          <Image
            src={category.imageUrl}
            alt={category.name}
            width={300}
            height={300}
            className="w-full h-56 object-cover"
          />
        )}
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {category.name}
          </h2>
        </div>
      </div>
    </Link>
  );
};
