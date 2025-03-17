import { OrderDisplay } from "./_components/OrderDisplay";

const OrdersPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center">Кошик</h1>
      <OrderDisplay />
    </div>
  );
};

export default OrdersPage;
