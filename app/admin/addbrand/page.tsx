"use client";
import React from "react";
import AddBrand from "./_components/AddBrand";
import { BrandsDisplay } from "./_components/BrandsDisplay";
import Head from "next/head";

const BrandsHome: React.FC = () => {
  return (
    <div className="mt-5 flex flex-col gap-4">
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
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
