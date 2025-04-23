"use client";

import React from "react";
import AddProduct from "./_components/AddProduct";
import { ProductDisplay } from "./_components/ProductDisplay";

const Home: React.FC = () => {
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
