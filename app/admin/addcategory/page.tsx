"use client";
import React from "react";
import AddCategory from "./_components/AddCategory";
import { CategoriesDisplay } from "./_components/CategoriesDisplay";

const CategoriesHome: React.FC = () => {
  return (
    <div className="mt-5 flex flex-col gap-4">
      <div className="flex justify-center">
        <AddCategory />
      </div>
      <div className="w-full">
        <CategoriesDisplay />
      </div>
    </div>
  );
};

export default CategoriesHome;
