import { CategoriesDisplay } from "./_components/categories/CategoriesDisplay";
import { CategoriesSlider } from "./_components/categories/CategoriesSlider";
import { Slider } from "./_components/slider/Slider";

export default function Home() {
  return (
    <div className="flex w-full flex-col justify-center">
      <CategoriesDisplay />
      <Slider />
    </div>
  );
}
