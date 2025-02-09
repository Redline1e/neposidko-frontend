
export interface Product {
  productId: number;
  brandId: number;
  price: number;
  discount: number;
  description: string;
  imageUrl: string;
  sizes: string[];
}

export interface Category {
  name: string;
  imageUrl: string;
}

