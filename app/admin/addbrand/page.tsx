"use client";
import React from "react";
import AddBrand from "./_components/AddBrand";
import { BrandsDisplay } from "./_components/BrandsDisplay";

const BrandsHome: React.FC = () => {
  return (
    <div className="mt-5 flex flex-col gap-4">
      <div className="flex justify-center">
        <AddBrand />
      </div>
      <div className="w-full">
        <BrandsDisplay />
      </div>
    </div>
  );
};

export default BrandsHome;
