import React from "react";
import { CategoriesDisplay } from "./_components/categories/CategoriesDisplay";
import { Slider } from "./_components/slider/Slider";

const Home: React.FC = () => {
  return (
    <div className="flex w-full flex-col justify-center space-y-6">
      <CategoriesDisplay />
      <Slider />
    </div>
  );
};

export default Home;
