"use client";

import React, {
  useState,
  useEffect,
  useRef,
  FormEvent,
  ChangeEvent,
} from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { X, Frown } from "lucide-react";
import { searchProducts } from "@/lib/api/product-service";
import { Product } from "@/utils/types";

export const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
        console.error("Search error:", error);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setShowDropdown(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="relative z-50" ref={containerRef}>
      <form onSubmit={handleSubmit} className="flex items-center">
        <Input
          value={query}
          onChange={handleChange}
          placeholder="Пошук..."
          aria-label="Search"
          className="rounded-l border border-neutral-300 pr-8 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </form>

      {showDropdown && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-10">
          {results.length > 0 ? (
            <ul>
              {results.map((product) => (
                <li
                  key={product.articleNumber}
                  className="p-2 hover:bg-neutral-100 transition-colors duration-200"
                >
                  <Link
                    href={`/product/${product.articleNumber}`}
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center"
                  >
                    <img
                      src={
                        Array.isArray(product.imageUrls)
                          ? product.imageUrls[0]
                          : product.imageUrls
                      }
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded mr-2"
                    />
                    <span className="text-neutral-700 truncate">
                      {product.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 flex items-center justify-center text-neutral-500">
              <Frown className="h-5 w-5 mr-2" />
              Немає результатів
            </div>
          )}
        </div>
      )}
    </div>
  );
};
