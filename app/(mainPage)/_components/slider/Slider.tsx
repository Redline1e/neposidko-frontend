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
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination
          loop={true}
        >
          <SwiperSlide className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
            <Image src="/slide1.jpg" alt="Slide 1" width={629} height={224} />
          </SwiperSlide>
          <SwiperSlide className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
            <Image src="/slide2.jpg" alt="Slide 2" width={629} height={224} />
          </SwiperSlide>
          <SwiperSlide className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
            <Image src="/slide3.jpg" alt="Slide 3" width={629} height={224} />
          </SwiperSlide>
        </Swiper>
      </div>

      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: #8d8d8d; 
          transition-property: color, background-color, border-color, fill,
            stroke;
          transition-duration: 200ms;
        }
        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          color: #3a3b3c;
        }
        .swiper-pagination-bullet {
          background-color: #323333; 
          opacity: 0.5;
          transition-property: opacity;
          transition-duration: 300ms;
        }
        .swiper-pagination-bullet-active {
          opacity: 1;
        }
      `}</style>
    </>
  );
};
