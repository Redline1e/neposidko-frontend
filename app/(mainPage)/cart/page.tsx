import Head from "next/head";
import { OrderDisplay } from "./_components/OrderDisplay";

const CartPage = () => {
  return (
    <>
      <Head>
        <title>Кошик - Непосидько</title>
        <meta name="robots" content="noindex, nofollow" />{" "}
      </Head>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Ваш кошик</h1>
        <OrderDisplay />
      </div>
    </>
  );
};

export default CartPage;
