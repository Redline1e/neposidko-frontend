export interface Product {
  productId?: number;
  brandId: number;
  price: number;
  discount?: number;
  description: string;
  imageUrl: string;
}

export const fetchProducts = async (): Promise<Product[]> => {
  const res = await fetch("http://localhost:5000/products"); // Переконайся, що бекенд працює
  if (!res.ok) throw new Error("Помилка при завантаженні товарів");
  return res.json();
};

export const addProduct = async (product: Product): Promise<void> => {
  await fetch("http://localhost:5000/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
};
