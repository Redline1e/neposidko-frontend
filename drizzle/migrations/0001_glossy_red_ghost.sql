CREATE TABLE "brands" (
	"brandId" serial PRIMARY KEY NOT NULL,
	"name" text
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"categoryId" serial PRIMARY KEY NOT NULL,
	"name" text
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"cartId" serial PRIMARY KEY NOT NULL,
	"userId" integer,
	"cartData" text,
	"cartStatus" text
);
--> statement-breakpoint
CREATE TABLE "productCategory" (
	"productCategoryId" serial PRIMARY KEY NOT NULL,
	"name" text,
	"productId" integer,
	"brandId" integer,
	"categoryId" integer
);
--> statement-breakpoint
CREATE TABLE "productOrder" (
	"productOrderId" serial PRIMARY KEY NOT NULL,
	"cartId" integer,
	"productId" integer,
	"quantity" integer
);
--> statement-breakpoint
CREATE TABLE "products" (
	"productId" serial PRIMARY KEY NOT NULL,
	"brandId" integer,
	"categoryId" integer,
	"price" integer,
	"discount" integer,
	"description" text,
	"imageUrl" text
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"reviewId" serial PRIMARY KEY NOT NULL,
	"userId" integer,
	"productId" integer,
	"rating" integer,
	"comment" text,
	"reviewDate" text
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"roleId" serial PRIMARY KEY NOT NULL,
	"name" text
);
--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "id" TO "userId";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "roleId" integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password" text;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_users_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("userId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productCategory" ADD CONSTRAINT "productCategory_productId_products_productId_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("productId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productCategory" ADD CONSTRAINT "productCategory_categoryId_categories_categoryId_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("categoryId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productOrder" ADD CONSTRAINT "productOrder_productId_products_productId_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("productId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_users_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("userId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_productId_products_productId_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("productId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_roles_roleId_fk" FOREIGN KEY ("roleId") REFERENCES "public"."roles"("roleId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "age";