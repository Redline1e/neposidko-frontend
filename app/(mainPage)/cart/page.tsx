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
        <OrderDisplay />
      </div>
    </>
  );
};

export default CartPage;
