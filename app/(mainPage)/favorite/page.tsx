import Head from "next/head";
import { FavoriteDisplay } from "./_components/FavoritesDisplay";

const FavoritesPage = () => {
  return (
    <>
      <Head>
        <title>Улюблені товари - Непосидько</title>
        <meta name="robots" content="noindex, follow" />
        <meta
          name="description"
          content="Перегляньте ваші улюблені товари в інтернет-магазині Непосидько."
        />
      </Head>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Улюблені товари</h1>
        <FavoriteDisplay />
      </div>
    </>
  );
};

export default FavoritesPage;