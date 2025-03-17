import React, { useState } from "react";

interface ProductImageGalleryProps {
  images: string[];
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
}) => {
  if (!images || images.length === 0) {
    return <div className="text-center text-gray-500">Зображення відсутні</div>;
  }

  const [selectedImage, setSelectedImage] = useState<string>(images[0]);

  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex md:flex-col gap-2 mb-4 md:mb-0 md:mr-4">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Мініатюра ${index + 1}`}
            className={`w-20 h-20 object-cover rounded cursor-pointer transition-transform duration-150 hover:scale-105 ${
              selectedImage === img
                ? "border-2 border-neutral-500"
                : "border border-gray-300"
            }`}
            onClick={() => setSelectedImage(img)}
          />
        ))}
      </div>
      <div className="flex-1">
        <div className="relative" style={{ paddingBottom: "100%" }}>
          <img
            src={selectedImage}
            alt="Вибране зображення"
            className="absolute top-0 left-0 w-full h-full object-cover rounded shadow-md"
          />
        </div>
      </div>
    </div>
  );
};
