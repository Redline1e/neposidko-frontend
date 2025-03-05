import { z } from "zod";

// Схема для ролей (таблиця roles)
export const RoleSchema = z.object({
  roleId: z.number().default(0),
  name: z.string().default(""),
});
export type Role = z.infer<typeof RoleSchema>;

// Схема для користувача (таблиця users)
export const UserSchema = z.object({
  userId: z.number().default(0),
  roleId: z.number().default(0), // БД: notNull, тому дефолт – 0
  name: z.string().default(""),
  email: z.string().email().default(""),
  password: z.string().default(""),
  telephone: z.preprocess(
    (val) => (val === null || val === undefined ? "" : val),
    z.string().default("")
  ),
  deliveryAddress: z.preprocess(
    (val) => (val === null || val === undefined ? "" : val),
    z.string().default("")
  ),
});
export type User = z.infer<typeof UserSchema>;

// Схема для бренду (таблиця brands)
export const BrandSchema = z.object({
  brandId: z.number().default(0),
  name: z.string().default(""),
});
export type Brand = z.infer<typeof BrandSchema>;

// Схема для категорії (таблиця categories)
export const CategorySchema = z.object({
  categoryId: z.number().default(0),
  name: z.string().default(""),
  imageUrl: z.string().default(""),
});
export type Category = z.infer<typeof CategorySchema>;

// Схема для товару (таблиця products)
export const ProductSchema = z.object({
  articleNumber: z.string().default(""),
  brandId: z.number().nullable().default(null), // якщо немає – null
  price: z.number().default(0),
  discount: z.number().default(0),
  name: z.string().default(""),
  description: z.string().default(""),
  imageUrls: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  sizes: z.array(z.string()).default([]),
});
export type Product = z.infer<typeof ProductSchema>;

// Схема для розмірів товарів (таблиця productSizes)
export const ProductSizeSchema = z.object({
  sizeId: z.number().default(0),
  articleNumber: z.string().default(""),
  size: z.string().default(""),
  stock: z.number().default(0),
});
export type ProductSize = z.infer<typeof ProductSizeSchema>;

// Схема для відгуків (таблиця reviews)
export const ReviewSchema = z.object({
  reviewId: z.number().default(0),
  userId: z.number().default(0),
  articleNumber: z.string().default(""),
  rating: z.number().default(0),
  comment: z.string().default(""),
  reviewDate: z.string().default(""),
});
export type Review = z.infer<typeof ReviewSchema>;

// Схема для статусу замовлення (таблиця orderStatus)
export const OrderStatusSchema = z.object({
  orderStatusId: z.number().default(0),
  name: z.string().default(""),
});
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

// Схема для замовлення (таблиця orders)
export const OrderSchema = z.object({
  orderId: z.number().default(0),
  userId: z.number().default(0),
  orderStatusId: z.number().nullable().default(null),
  orderDate: z.string().default(""),
});
export type Order = z.infer<typeof OrderSchema>;

// Схема для позиції у замовленні (таблиця orderItems)
export const OrderItemSchema = z.object({
  productOrderId: z.number().default(0),
  orderId: z.number().default(0),
  articleNumber: z.string().default(""),
  size: z.string().default(""),
  quantity: z.number().default(0),
});
export type OrderItem = z.infer<typeof OrderItemSchema>;

// Схема для фаворитів (таблиця favorites)
export const FavoriteSchema = z.object({
  favoriteId: z.number().default(0),
  userId: z.number().default(0),
  articleNumber: z.string().default(""),
});
export type Favorite = z.infer<typeof FavoriteSchema>;

// Схема для категорій товарів (таблиця productCategories)
export const ProductCategorySchema = z.object({
  productCategoryId: z.number().default(0),
  articleNumber: z.string().default(""),
  categoryId: z.number().default(0),
  imageUrl: z.string().default(""),
});
export type ProductCategory = z.infer<typeof ProductCategorySchema>;

// Схема для даних замовлення
export const OrderDataSchema = z.object({
  orderId: z.number().default(0),
  userId: z.number().default(0),
  orderStatusId: z.number().default(0),
  items: z.array(OrderItemSchema).default([]),
});
export type OrderData = z.infer<typeof OrderDataSchema>;

// Схема для даних позиції замовлення
export const OrderItemDataSchema = z.object({
  productOrderId: z.number().default(0),
  orderId: z.number().default(0),
  articleNumber: z.string().default(""),
  size: z.string().default(""),
  quantity: z.number().default(0),
  price: z.number().default(0),
  discount: z.number().default(0),
  name: z.string().default(""),
  imageUrls: z.array(z.string()).default([]),
  sizes: z
    .array(
      z.object({
        size: z.string().default(""),
        stock: z.number().default(0),
      })
    )
    .default([]),
});
export type OrderItemData = z.infer<typeof OrderItemDataSchema>;

// Схема для розмірів (таблиця productSizes)
export const SizesSchema = z.object({
  sizeId: z.number().default(0),
  articleNumber: z.string().default(""),
  size: z.string().default(""),
  stock: z.number().default(0),
});
export type Sizes = z.infer<typeof SizesSchema>;
