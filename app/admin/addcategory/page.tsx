"use client";
import React from "react";
import AddCategory from "./_components/AddCategory";
import { CategoriesDisplay } from "./_components/CategoriesDisplay";
import Head from "next/head";

const CategoriesHome: React.FC = () => {
  return (
    <div className="mt-5 flex flex-col gap-4">
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
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
