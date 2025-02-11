"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductImageGallery } from "./ProductImageGallery";
import { ProductDetails } from "./ProductDetails";
import { CommentsSection } from "./CommentsSection";
import { fetchProductByArticle } from "@/lib/product-service";
import { fetchBrandById } from "@/lib/brands-service";
import { Brand, Product } from "@/utils/api";
import { Loader2 } from "lucide-react";

export const ProductPage: React.FC = () => {
  const { articleNumber } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [brandName, setBrandName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!articleNumber) return;

    const loadProduct = async () => {
      setLoading(true);
      try {
        const data = await fetchProductByArticle(articleNumber as string);
        setProduct(data);
        if (data.brandId) {
          const brand: Brand | null = await fetchBrandById(data.brandId);
          setBrandName(brand?.name || "Невідомий бренд");
        }
      } catch (err) {
        setError("Не вдалося завантажити товар");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [articleNumber]);

  const handleAddToCart = () => alert("Товар додано до кошика!");
  const handleAddToWishlist = () => alert("Товар додано в обране!");

  if (loading)
    return (
      <p className="text-center py-10">
        <Loader2 className="animate-spin h-8 w-8 mx-auto" />
      </p>
    );
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;
  if (!product) return <p className="text-center py-10">Товар не знайдено</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProductImageGallery images={product.imageUrls} />
        <ProductDetails
          title={product.name}
          brand={brandName!}
          description={product.description}
          price={product.price}
          discount={product.discount}
          sizes={product.sizes?.map((s) => s.size) || []}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
        />
      </div>
      <CommentsSection />
    </div>
  );
};

export default ProductPage;
