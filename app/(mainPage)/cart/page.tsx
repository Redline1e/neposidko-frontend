import { OrderDisplay } from "./_components/OrderDisplay";

export default function OrdersPage() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Кошик</h1>
      <OrderDisplay />
    </div>
  );
}
