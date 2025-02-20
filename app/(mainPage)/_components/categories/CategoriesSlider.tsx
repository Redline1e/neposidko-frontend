"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchCategories } from "@/lib/api/category-service";
import { Category } from "@/utils/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Визначаємо варіанти анімації для слайду
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

export const CategoriesSlider = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  // Додатковий стан для збереження напрямку (1 для наступного, -1 для попереднього)
  const [direction, setDirection] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error("Помилка завантаження категорій:", err);
        setError("Не вдалося завантажити категорії");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % categories.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + categories.length) % categories.length
    );
  };

  if (loading) return <div className="text-center">Завантаження...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (categories.length === 0)
    return <div className="text-center">Немає категорій</div>;

  return (
    <div className="relative w-full max-w-md mx-auto">
      <Card className="overflow-hidden">
        <div className="relative h-64">
          <AnimatePresence mode="wait">
            <motion.div
              key={categories[currentIndex].categoryId}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={categories[currentIndex].imageUrl}
                alt={categories[currentIndex].name}
                fill
                className="object-cover"
                // Розкоментуй наступне, якщо потрібно відключити оптимізацію:
                // unoptimized
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="p-4 text-center">
          <h3 className="text-xl font-semibold">
            {categories[currentIndex].name}
          </h3>
        </div>
      </Card>

      {/* Кнопки навігації з іконками з lucide-react */}
      <Button
        onClick={prevSlide}
        variant="outline"
        className="absolute top-1/2 left-0 transform -translate-y-1/2 p-2"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <Button
        onClick={nextSlide}
        variant="outline"
        className="absolute top-1/2 right-0 transform -translate-y-1/2 p-2"
      >
        <ArrowRight className="h-5 w-5" />
      </Button>

      {/* Індикатори слайдів */}
      <div className="flex justify-center mt-4">
        {categories.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 mx-1 rounded-full ${
              index === currentIndex ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
