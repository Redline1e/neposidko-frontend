export interface Product {
  readonly articleNumber: string;
  readonly brandId: number;
  readonly categoryId: number; // Обов’язкове поле для прив’язки категорії
  price: number;
  discount: number;
  name: string;
  description: string;
  imageUrls: string[];
  sizes: { size: string; stock: number }[];
  isActive: boolean;
}

export interface Category {
  readonly categoryId?: number;
  name: string;
  imageUrl?: string;
}

export interface Brand {
  readonly brandId?: number;
  name: string;
}

export interface Order {
  readonly orderId?: number;
  readonly userId: number;
  orderStatusId?: number;
}

export interface OrderItem {
  readonly productOrderId?: number;
  readonly orderId: number;
  readonly articleNumber: string;
  size: string;
  quantity: number;
}

export interface OrderData {
  readonly orderId: number;
  readonly userId: number;
  readonly orderStatusId: number;
  items?: OrderItem[];
}

export interface OrderItemData {
  productOrderId: number;
  orderId: number;
  articleNumber: string;
  size: string;
  quantity: number;
  price: number;
  discount: number;
  name: string;
  imageUrls: string[];
  sizes?: { size: string; stock: number }[];
}

export interface Review {
  reviewId: number;
  userId: number;
  articleNumber: string;
  rating: number;
  comment: string;
  reviewDate: string;
}

export interface User {
  readonly userId: number;
  readonly roleId: number;
  name: string;
  email: string;
  password: string;
  telephone?: string;
  deliveryAddress?: string;
}

export interface Sizes {
  readonly sizeId: number;
  readonly articleNumber: number;
  size: string;
  stock: string;
}
