"use client";

import React, { useEffect, useState } from "react";
import { Product } from "@/utils/types";
import AddProduct from "./_components/AddProduct";
import { ProductDisplay } from "./_components/ProductDisplay";
import { fetchProducts } from "@/lib/api/product-service";

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  return (
    <div className="mt-5 flex flex-col gap-4">
      <div className="flex justify-center">
        <AddProduct />
      </div>
      <div className="w-full">
        <ProductDisplay />
      </div>
    </div>
  );
};

export default Home;
