"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

const images = [
  "/slide_1.jpg",
  "/slide_2.jpg",
  "/slide_3.jpg",
];

export default function ProductCarousel() {
  return (
    <Carousel className="w-full max-w-lg mx-auto">
      <CarouselContent>
        {images.map((src, index) => (
          <CarouselItem key={index} className="flex justify-center">
            <Image
              src={src}
              alt={`Product ${index + 1}`}
              width={400}
              height={300}
              className="rounded-xl object-cover"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
