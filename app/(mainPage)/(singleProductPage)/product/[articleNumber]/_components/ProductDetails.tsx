import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { parseProductDescription } from "@/utils/parseProductDescription";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { toast } from "sonner";

// Фіксований порядок для текстових розмірів
const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL"];

// Функція для визначення значення розміру
const getSizeValue = (size: string) => {
  if (!isNaN(Number(size))) {
    return Number(size); // Якщо це число, повертаємо його
  }
  return sizeOrder.indexOf(size); // Якщо текст, повертаємо індекс із sizeOrder
};

interface ProductDetailsProps {
  title: string;
  description: string;
  price: number;
  discount: number;
  sizes: { size: string; stock: number }[];
  onAddToCart: () => void;
  onToggleWishlist: () => void;
  onSizeSelect: (size: string) => void;
  isFavorite: boolean;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  title,
  description,
  price,
  discount,
  sizes,
  onAddToCart,
  onToggleWishlist,
  onSizeSelect,
  isFavorite,
}) => {
  const product = parseProductDescription(description);
  const discountedPrice = discount ? price - (price * discount) / 100 : price;
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    onSizeSelect(size);
  };

  const handleAddToCartClick = () => {
    if (!selectedSize) {
      toast.error("Будь ласка, виберіть розмір перед додаванням в кошик!");
      return;
    }
    onAddToCart();
  };

  // Сортування розмірів
  const sortedSizes = sizes.sort((a, b) => {
    const aValue = getSizeValue(a.size);
    const bValue = getSizeValue(b.size);
    return aValue - bValue;
  });

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <div className="mb-5 relative">
        <div className="flex items-baseline gap-2">
          {discount > 0 && (
            <span className="line-through text-gray-500 text-lg self-start">
              {price.toFixed(0)}$
            </span>
          )}
          <span className="text-2xl font-semibold text-red-600">
            {discountedPrice.toFixed(0)}$
          </span>
        </div>
      </div>
      <div className="mb-5">
        <span className="font-semibold">Розміри: </span>
        <div className="flex flex-wrap gap-2 mt-2">
          {sortedSizes.length > 0 ? (
            sortedSizes.map((sizeObj, index) => {
              const { size, stock } = sizeObj;
              const isAvailable = stock > 0;
              return (
                <span
                  key={index}
                  onClick={() => isAvailable && handleSizeSelect(size)}
                  className={`px-3 py-1 border rounded transition-colors duration-200 ${
                    isAvailable
                      ? selectedSize === size
                        ? "bg-neutral-400 text-white border-neutral-400 cursor-pointer"
                        : "hover:bg-gray-100 cursor-pointer"
                      : "line-through text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {size}
                </span>
              );
            })
          ) : (
            <span className="text-gray-500">Немає доступних розмірів</span>
          )}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Button
          onClick={handleAddToCartClick}
          className="flex items-center justify-center"
          aria-label="Додати в кошик"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Додати в кошик
        </Button>
        <Button
          variant="outline"
          onClick={onToggleWishlist}
          className="flex items-center justify-center"
          aria-label={isFavorite ? "Видалити з обраного" : "Додати в обране"}
        >
          <Heart
            className={`mr-2 h-5 w-5 ${
              isFavorite ? "text-red-500" : "text-gray-500"
            }`}
          />
          <span className="hidden sm:inline">
            {isFavorite ? "В обраному" : "Додати в обране"}
          </span>
        </Button>
      </div>
      <Accordion type="single" collapsible className="mt-4">
        <AccordionItem value="1">
          <AccordionTrigger>Детально про товар</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold">Категорія:</span>
                <span>{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Бренд:</span>
                <span>{product.brand}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Колір:</span>
                <span>{product.color}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Сезон:</span>
                <span>{product.season}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Країна виробник:</span>
                <span>{product.country}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="2">
          <AccordionTrigger>Матеріали</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold">Матеріал верху:</span>
                <span>{product.upperMaterial}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Матеріал підкладки:</span>
                <span>{product.liningMaterial}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="3">
          <AccordionTrigger>Доставка та оплата</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <p>- Самовивіз</p>
              <p>- Нова Пошта</p>
              <p>- Укр Пошта</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
