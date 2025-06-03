// File: app/(mainPage)/(singleProductPage)/product/[articleNumber]/_components/ProductImageGallery.tsx
import React, { useState } from "react";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";

interface ProductImageGalleryProps {
  images: string[];
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
}) => {
  // Если массив пустой, инициализируем selectedImage пустой строкой
  const [selectedImage, setSelectedImage] = useState<string>(images[0] || "");

  const handleSwipe = (direction: "left" | "right") => {
    const currentIndex = images.indexOf(selectedImage);
    let newIndex;

    if (direction === "left") {
      newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    } else {
      newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    }

    setSelectedImage(images[newIndex]);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("left"),
    onSwipedRight: () => handleSwipe("right"),
    trackMouse: true,
  });

  if (!images || images.length === 0) {
    return <div className="text-center text-gray-500">Зображення відсутні</div>;
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex md:flex-col gap-2 mb-4 md:mb-0 md:mr-4">
        {images.map((img, index) => (
          <Image
            key={index}
            src={img}
            alt={`Мініатюра ${index + 1}`}
            width={80}
            height={80}
            className={`w-20 h-20 object-cover rounded cursor-pointer transition-transform duration-150 hover:scale-105 ${
              selectedImage === img
                ? "border-2 border-neutral-500"
                : "border border-gray-300"
            }`}
            onClick={() => setSelectedImage(img)}
          />
        ))}
      </div>
      <div className="flex-1" {...handlers}>
        <div className="relative" style={{ paddingBottom: "100%" }}>
          <Image
            src={selectedImage}
            alt="Вибране зображення"
            fill
            className="absolute top-0 left-0 w-full h-full object-cover rounded shadow-md"
          />
        </div>
      </div>
    </div>
  );
};
