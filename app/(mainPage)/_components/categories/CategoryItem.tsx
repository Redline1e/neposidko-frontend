import { Category } from "@/utils/api";
import Image from "next/image";

interface CategoriesItemProps {
  category: Category;
}

export const CategoriesItem: React.FC<CategoriesItemProps> = ({ category }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden transform transition duration-300 hover:scale-105">
      <Image
        src={category.imageUrl}
        alt={category.name}
        width={300}
        height={300}
        className="w-full h-56 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800">{category.name}</h2>
      </div>
    </div>
  );
};
