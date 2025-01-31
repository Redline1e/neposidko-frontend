import { pgTable, serial, text, integer, primaryKey, foreignKey } from "drizzle-orm/pg-core";

// Roles table
export const roles = pgTable('roles', {
  roleId: serial('roleId').primaryKey(),
  name: text('name'),
});

// Users table
export const users = pgTable('users', {
  userId: serial('userId').primaryKey(),
  roleId: integer('roleId').references(() => roles.roleId),
  name: text('name'),
  email: text('email'),
  password: text('password'),
});

// Products table
export const products = pgTable('products', {
  productId: serial('productId').primaryKey(),
  brandId: integer('brandId'),
  categoryId: integer('categoryId'),
  price: integer('price'),
  discount: integer('discount'),
  description: text('description'),
  imageUrl: text('imageUrl'),
});

// Reviews table
export const reviews = pgTable('reviews', {
  reviewId: serial('reviewId').primaryKey(),
  userId: integer('userId').references(() => users.userId),
  productId: integer('productId').references(() => products.productId),
  rating: integer('rating'),
  comment: text('comment'),
  reviewDate: text('reviewDate'),
});

// Categories table
export const categories = pgTable('categories', {
  categoryId: serial('categoryId').primaryKey(),
  name: text('name'),
});

// Brands table
export const brands = pgTable('brands', {
  brandId: serial('brandId').primaryKey(),
  name: text('name'),
});

// ProductOrder table
export const productOrder = pgTable('productOrder', {
  productOrderId: serial('productOrderId').primaryKey(),
  cartId: integer('cartId'),
  productId: integer('productId').references(() => products.productId),
  quantity: integer('quantity'),
});

// Orders table
export const orders = pgTable('orders', {
  cartId: serial('cartId').primaryKey(),
  userId: integer('userId').references(() => users.userId),
  cartData: text('cartData'),
  cartStatus: text('cartStatus'),
});

// ProductCategory table
export const productCategory = pgTable('productCategory', {
  productCategoryId: serial('productCategoryId').primaryKey(),
  name: text('name'),
  productId: integer('productId').references(() => products.productId),
  brandId: integer('brandId'),
  categoryId: integer('categoryId').references(() => categories.categoryId),
});
