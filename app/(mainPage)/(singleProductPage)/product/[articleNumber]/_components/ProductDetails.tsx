import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { parseProductDescription } from "@/utils/parseProductDescription";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useState } from "react";
import { toast } from "sonner"; // Assuming you're using sonner for notifications

interface ProductDetailsProps {
  title: string;
  description: string;
  price: number;
  discount: number;
  sizes: string[];
  onAddToCart: () => void;
  onAddToWishlist: () => void; // Function to add product to wishlist
  onSizeSelect: (size: string) => void; // Function to handle size selection
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  title,
  description,
  price,
  discount,
  sizes,
  onAddToCart,
  onAddToWishlist,
  onSizeSelect, // Handle size select function
}) => {
  const product = parseProductDescription(description);
  const discountedPrice = discount ? price - (price * discount) / 100 : price;

  const [selectedSize, setSelectedSize] = useState<string | null>(null); // To track the selected size

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size); // Update the selected size
    onSizeSelect(size); // Pass selected size back to parent component
  };

  const handleAddToCartClick = () => {
    if (!selectedSize) {
      toast.error("Будь ласка, виберіть розмір перед додаванням в кошик!"); // Show error if no size is selected
      return;
    }
    onAddToCart(); // Proceed with adding to cart if a size is selected
  };

  return (
    <div className="flex flex-col">
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
        <div className="absolute top-4 left-20 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          -{discount}%
        </div>
      </div>
      <div className="mb-5">
        <span className="font-semibold">Розміри: </span>
        <div className="flex flex-wrap gap-2 mt-2">
          {sizes.length > 0 ? (
            sizes.map((size, index) => (
              <span
                key={index}
                onClick={() => handleSizeSelect(size)} // Handle size selection
                className={`px-4 py-2 border rounded text-sm font-medium cursor-pointer transition duration-200 ${
                  selectedSize === size
                    ? "bg-neutral-400" // Neutral color for selected size
                    : "hover:bg-gray-100"
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
          onClick={onAddToWishlist}
          className="flex items-center"
          aria-label="Додати в обране"
        >
          <Heart className="sm:mr-2 md:mr-2 lg:mr-2 h-5 w-5" />
          <p className="hidden sm:block md:block lg:block">Додати в обране</p>
        </Button>
      </div>

      {/* Accordion for product details */}
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

        {/* Materials */}
        <AccordionItem value="2">
          <AccordionTrigger>Матеріали</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="font-semibold">Матеріал верху:</div>
                <div>{product.upperMaterial}</div>
              </div>
              <div className="flex justify-between">
                <div className="font-semibold ">Матеріал підкладки:</div>
                <div className="text-end">{product.liningMaterial}</div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Delivery and payment */}
        <AccordionItem value="3">
          <AccordionTrigger>Доставка та оплата</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 font-semibold">
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
