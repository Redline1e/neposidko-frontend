import { z } from "zod";

// Схема для ролей (таблиця roles)
export const RoleSchema = z.object({
  roleId: z.number().optional().default(0),
  name: z.string().optional().default(""),
});
export type Role = z.infer<typeof RoleSchema>;

// Схема для користувача (таблиця users)
export const UserSchema = z.object({
  userId: z.number().optional().default(0),
  roleId: z.number().optional().default(0),
  name: z.string().optional().default(""),
  email: z.string().email().optional().default(""),
  password: z.string().optional().default(""),
  telephone: z.preprocess(
    (val) => (val === null || val === undefined ? "" : val),
    z.string().optional().default("")
  ),
  deliveryAddress: z.preprocess(
    (val) => (val === null || val === undefined ? "" : val),
    z.string().optional().default("")
  ),
});
export type User = z.infer<typeof UserSchema>;

// Схема для бренду (таблиця brands)
export const BrandSchema = z.object({
  brandId: z.number().optional().default(0),
  name: z.string().optional().default(""),
});
export type Brand = z.infer<typeof BrandSchema>;

// Схема для категорії (таблиця categories)
export const CategorySchema = z.object({
  categoryId: z.number().optional().default(0),
  name: z.string().optional().default(""),
  imageUrl: z.string().optional().default(""),
});
export type Category = z.infer<typeof CategorySchema>;

// Схема для товару (таблиця products)
export const ProductSchema = z.object({
  articleNumber: z.string().optional().default(""),
  brandId: z.number().nullable().optional().default(null),
  categoryId: z.number().optional().default(1), // додано
  price: z.number().optional().default(0),
  discount: z.number().optional().default(0),
  name: z.string().optional().default(""),
  description: z.string().optional().default(""),
  imageUrls: z.array(z.string()).optional().default([]),
  isActive: z.boolean().optional().default(true),
  sizes: z
    .array(
      z.object({
        size: z.string(),
        stock: z.number(),
      })
    )
    .optional()
    .default([]), // додано
});

export type Product = z.infer<typeof ProductSchema>;

// Схема для розмірів товарів (таблиця productSizes)
export const ProductSizeSchema = z.object({
  sizeId: z.number().optional().default(0),
  articleNumber: z.string().optional().default(""),
  size: z.string().optional().default(""),
  stock: z.number().optional().default(0),
});
export type ProductSize = z.infer<typeof ProductSizeSchema>;

// Схема для відгуків (таблиця reviews)
export const ReviewSchema = z.object({
  reviewId: z.number().optional().default(0),
  userId: z.number().optional().default(0),
  articleNumber: z.string().optional().default(""),
  rating: z.number().optional().default(0),
  comment: z.string().optional().default(""),
  reviewDate: z.string().optional().default(""),
});
export type Review = z.infer<typeof ReviewSchema>;

// Схема для статусу замовлення (таблиця orderStatus)
export const OrderStatusSchema = z.object({
  orderStatusId: z.number().optional().default(0),
  name: z.string().optional().default(""),
});
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

// Схема для замовлення (таблиця orders)
export const OrderSchema = z.object({
  orderId: z.number().optional().default(0),
  userId: z.number().optional().default(0),
  orderStatusId: z.number().nullable().optional().default(null),
  orderDate: z.string().optional().default(""),
});
export type Order = z.infer<typeof OrderSchema>;

// Схема для позиції у замовленні (таблиця orderItems)
export const OrderItemSchema = z.object({
  productOrderId: z.number().optional().default(0),
  orderId: z.number().optional().default(0),
  articleNumber: z.string().optional().default(""),
  size: z.string().optional().default(""),
  quantity: z.number().optional().default(0),
});
export type OrderItem = z.infer<typeof OrderItemSchema>;

// Схема для фаворитів (таблиця favorites)
export const FavoriteSchema = z.object({
  favoriteId: z.number().optional().default(0),
  userId: z.number().optional().default(0),
  articleNumber: z.string().optional().default(""),
});
export type Favorite = z.infer<typeof FavoriteSchema>;

// Схема для категорій товарів (таблиця productCategories)
export const ProductCategorySchema = z.object({
  productCategoryId: z.number().optional().default(0),
  articleNumber: z.string().nullable().optional().default(""),
  categoryId: z.number().nullable().optional().default(null),
  imageUrl: z.string().optional().default(""),
});
export type ProductCategory = z.infer<typeof ProductCategorySchema>;

// Схема для даних замовлення
export const OrderDataSchema = z.object({
  orderId: z.number().optional().default(0),
  userId: z.number().optional().default(0),
  orderStatusId: z.number().optional().default(0),
  items: z.array(OrderItemSchema).optional().default([]),
});
export type OrderData = z.infer<typeof OrderDataSchema>;

// Схема для даних позиції замовлення
export const OrderItemDataSchema = z.object({
  productOrderId: z.number().optional().default(0),
  orderId: z.number().optional().default(0),
  articleNumber: z.string().optional().default(""),
  size: z.string().optional().default(""),
  quantity: z.number().optional().default(0),
  price: z.number().optional().default(0),
  discount: z.number().optional().default(0),
  name: z.string().optional().default(""),
  imageUrls: z.array(z.string()).optional().default([]),
  sizes: z
    .array(
      z.object({
        size: z.string().optional().default(""),
        stock: z.number().optional().default(0),
      })
    )
    .optional()
    .default([]),
});
export type OrderItemData = z.infer<typeof OrderItemDataSchema>;

// Схема для розмірів (таблиця productSizes)
export const SizesSchema = z.object({
  sizeId: z.number().optional().default(0),
  articleNumber: z.string().optional().default(""),
  size: z.string().optional().default(""),
  stock: z.number().optional().default(0),
});
export type Sizes = z.infer<typeof SizesSchema>;
