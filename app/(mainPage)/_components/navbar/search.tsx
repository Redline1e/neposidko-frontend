"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { X, Frown } from "lucide-react";
import { searchProducts } from "@/lib/product-service";
import { Product } from "@/utils/api";

export const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Закриття випадаючого списку при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce для автоматичного пошуку
  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await searchProducts(query);
        setResults(res);
        setShowDropdown(true);
      } catch (error) {
        console.error("Помилка пошуку:", error);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setShowDropdown(false);
  };

  return (
    <div className="relative z-50" ref={containerRef}>
      <form onSubmit={(e) => e.preventDefault()} className="flex">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Пошук..."
          aria-label="Пошук"
          className="rounded-l border border-gray-300 pr-8"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="px-2 absolute right-0 top-2"
            aria-label="Очистити пошук"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </form>

      {showDropdown && (
        <div className="absolute left-0 right-0 bg-white border mt-1 z-10 max-h-60 overflow-y-auto">
          {results.length > 0 ? (
            <ul>
              {results.map((product) => (
                <li
                  key={product.articleNumber}
                  className="p-2 hover:bg-gray-100 border-b last:border-b-0 flex items-center"
                >
                  <Link
                    href={`/product/${product.articleNumber}`}
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center w-full"
                  >
                    <img
                      src={
                        Array.isArray(product.imageUrls)
                          ? product.imageUrls[0]
                          : product.imageUrls
                      }
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <span className="ml-2 truncate">{product.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 flex items-center justify-center">
              <div className="flex gap-2 text-gray-500">
                <Frown className="h-5 w-5 mt-0.5" />
                Нічого не знайдено
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
