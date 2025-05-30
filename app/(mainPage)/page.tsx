import React from "react";
import { CategoriesDisplay } from "./_components/categories/CategoriesDisplay";
import { Slider } from "./_components/slider/Slider";
import Head from "next/head";

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>Непосидько - Інтернет-магазин дитячого взуття</title>
        <meta
          name="description"
          content="Ласкаво просимо до Непосидько! Перегляньте наші популярні категорії та новинки дитячого взуття."
        />
        <meta
          name="keywords"
          content="дитяче взуття, інтернет-магазин, Непосидько, купити взуття для дітей"
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Головна сторінка",
            description:
              "Ласкаво просимо до Непосидько! Перегляньте наші популярні категорії та новинки дитячого взуття.",
          })}
        </script>
      </Head>
      <div className="flex w-full flex-col justify-center space-y-6">
        <CategoriesDisplay />
        <Slider />
      </div>
    </>
  );
};

export default Home;
