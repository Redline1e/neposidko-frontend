// components/CreateProductForm.tsx
"use client";

import React from "react";
import { useCreateProduct } from "@/features/products/api/use-create-product";

const CreateProductForm = () => {
  const { mutate, isPending } = useCreateProduct();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData = {
      brandId: Number(formData.get("brandId")),
      categoryId: Number(formData.get("categoryId")),
      price: Number(formData.get("price")),
      discount: Number(formData.get("discount")),
      description: formData.get("description") as string,
      imageUrl: formData.get("imageUrl") as string,
    };
    
    console.log("Product Data:", productData);
    mutate(productData);
  };

  return (
    <form onSubmit={handleSubmit} className="text-black">
      <input type="number" name="brandId" placeholder="Brand ID" required />
      <input type="number" name="categoryId" placeholder="Category ID" required />
      <input type="number" name="price" placeholder="Price" required />
      <input type="number" name="discount" placeholder="Discount" />
      <input type="text" name="description" placeholder="Description" required />
      <input type="url" name="imageUrl" placeholder="Image URL" required />
      <button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Product"}
      </button>
    </form>
  );
};

export default CreateProductForm;