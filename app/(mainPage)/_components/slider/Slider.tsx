"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "@/app/globals.css";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";

export const Slider = () => {
  return (
    <>
      <div className="container mx-auto p-5">
        <Swiper modules={[Navigation, Pagination]} navigation pagination loop>
          <SwiperSlide className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src="/slide1.jpg"
              alt="Акція на дитяче взуття"
              width={629}
              height={224}
            />
          </SwiperSlide>
          <SwiperSlide className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src="/slide2.jpg"
              alt="Нова колекція дитячого взуття"
              width={629}
              height={224}
            />
          </SwiperSlide>
          <SwiperSlide className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src="/slide3.jpg"
              alt="Знижки на дитяче взуття"
              width={629}
              height={224}
            />
          </SwiperSlide>
        </Swiper>
      </div>

      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: #8d8d8d;
          transition: color 200ms, background-color 200ms, border-color 200ms,
            fill 200ms, stroke 200ms;
        }
        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          color: #3a3b3c;
        }
        .swiper-pagination-bullet {
          background-color: #323333;
          opacity: 0.5;
          transition: opacity 300ms;
        }
        .swiper-pagination-bullet-active {
          opacity: 1;
        }
      `}</style>
    </>
  );
};
