import React, { useState } from "react";

interface ProductImageGalleryProps {
  images: string[];
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images }) => {
  if (!images || images.length === 0) {
    return <div className="text-center text-gray-500">Зображення відсутні</div>;
  }

  const [selectedImage, setSelectedImage] = useState<string>(images[0]);

  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 mr-2 md:mr-0 md:mb-4">
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
        <div className="w-full max-w-[560px] mx-auto">
          <div className="relative" style={{ paddingBottom: "135.7%" }}>
            <img
              src={selectedImage}
              alt="Вибране зображення"
              className="absolute top-0 left-0 w-full h-full object-cover rounded shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
