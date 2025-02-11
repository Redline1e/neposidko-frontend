import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";

interface ProductDetailsProps {
  title: string;
  description: string;
  price: number;
  discount: number;
  brand: string;
  sizes: string[];
  onAddToCart: () => void;
  onAddToWishlist: () => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  title,
  description,
  price,
  discount,
  sizes,
  brand,
  onAddToCart,
  onAddToWishlist,
}) => {
  const discountedPrice = discount ? price - (price * discount) / 100 : price;

  return (
    <div className="flex flex-col relative">
      {discount > 0 && (
        <div className="absolute top-16 left-20 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          -{discount}%
        </div>
      )}
      <h2 className="text-3xl font-bold mb-2">{brand}</h2>
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <div className="mb-4 flex flex-col-reverse">
        <span className="text-2xl font-semibold text-red-600 mr-2">
          {discountedPrice.toFixed(0)}$
        </span>
        {discount > 0 && (
          <span className="line-through text-gray-500 text-md">
            {price.toFixed(0)}
          </span>
        )}
      </div>
      <div className="mb-4">
        <div className="mb-5">
          <span className="font-semibold ">Розміри: </span>
          <div className="flex flex-wrap gap-2 mt-2">
            {sizes.length > 0 ? (
              sizes.map((size, index) => (
                <span key={index} className="px-3 py-1 border rounded text-sm">
                  {size}
                </span>
              ))
            ) : (
              <span className="text-gray-500">Немає доступних розмірів</span>
            )}
          </div>
        </div>
        <div className="flex space-x-4 mt-auto">
          <Button
            onClick={onAddToCart}
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
            <Heart className="mr-2 h-5 w-5" />
            Додати в обране
          </Button>
        </div>
      </div>
      <h1 className="text-md mb-2">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sequi
        consequatur incidunt reiciendis facere illum ducimus blanditiis rerum
        ipsa autem error dolores beatae voluptatum ipsum, recusandae fugit
        maiores iste! Doloribus, odit.
        
      </h1>
    </div>
  );
};
