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

interface ProductDetailsProps {
  articleNumber: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  sizes: string[];
  onAddToCart: () => void;
  onToggleWishlist: () => void;
  onSizeSelect: (size: string) => void;
  isFavorite: boolean;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  articleNumber,
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

  return (
    <div className="flex flex-col">
      <p className="text-md">{articleNumber}</p>
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <div className="mb-5 flex flex-col-reverse relative">
        <span className="text-2xl font-semibold text-red-600 mr-2">
          {discountedPrice.toFixed(0)}$
        </span>
        {discount > 0 && (
          <span className="line-through text-gray-500 text-md">
            {price.toFixed(0)}
          </span>
        )}
        {discount > 0 && (
          <div className="absolute top-4 left-20 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </div>
        )}
      </div>
      <div className="mb-5">
        <span className="font-semibold">Розміри: </span>
        <div className="flex flex-wrap gap-2 mt-2">
          {sizes.length > 0 ? (
            sizes.map((size, index) => (
              <span
                key={index}
                onClick={() => handleSizeSelect(size)}
                className={`px-4 py-2 border rounded text-sm font-medium cursor-pointer transition duration-200 ${
                  selectedSize === size ? "bg-neutral-400" : "hover:bg-gray-100"
                }`}
              >
                {size}
              </span>
            ))
          ) : (
            <span className="text-gray-500">Немає доступних розмірів</span>
          )}
        </div>
      </div>
      <div className="flex space-x-4 mt-3 mb-6">
        <Button
          onClick={handleAddToCartClick}
          className="flex items-center"
          aria-label="Додати в кошик"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Додати в кошик
        </Button>
        <Button
          variant="outline"
          onClick={onToggleWishlist}
          className="flex items-center"
          aria-label={isFavorite ? "Видалити з обраного" : "Додати в обране"}
        >
          <Heart
            className={`sm:mr-2 md:mr-2 lg:mr-2 h-5 w-5 ${
              isFavorite ? "text-red-500" : ""
            }`}
          />
          <p className="hidden sm:block md:block lg:block">
            {isFavorite ? "В обраному" : "Додати в обране"}
          </p>
        </Button>
      </div>

      <Accordion type="single" collapsible>
        <AccordionItem value="1">
          <AccordionTrigger>Детально про товар</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="font-semibold">Категорія:</div>
                <div>{product.category}</div>
              </div>
              <div className="flex justify-between">
                <div className="font-semibold">Бренд:</div>
                <div>{product.brand}</div>
              </div>
              <div className="flex justify-between">
                <div className="font-semibold">Колір:</div>
                <div>{product.color}</div>
              </div>
              <div className="flex justify-between">
                <div className="font-semibold">Сезон:</div>
                <div>{product.season}</div>
              </div>
              <div className="flex justify-between">
                <div className="font-semibold">Країна виробник:</div>
                <div>{product.country}</div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="2">
          <AccordionTrigger>Матеріали</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="font-semibold">Матеріал верху:</div>
                <div>{product.upperMaterial}</div>
              </div>
              <div className="flex justify-between">
                <div className="font-semibold">Матеріал підкладки:</div>
                <div className="text-end">{product.liningMaterial}</div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="3">
          <AccordionTrigger>Доставка та оплата</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <p>-Самовивіз</p>
              <p>-Нова Пошта</p>
              <p>-Укр Пошта</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
