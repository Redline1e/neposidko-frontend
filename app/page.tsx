import "reflect-metadata";
import {
  createConnection,
  ConnectionOptions,
  getConnectionManager,
  getRepository,
} from "typeorm";
//------------------------------------------IMPORTS FOR DB CONNECTION TEST----------------------------------------------------------------------------------------

import { Roles } from "../db/entities/Roles";
import { Brands } from "../db/entities/Brands";
import { Categories } from "../db/entities/Categories";
import { Orders } from "../db/entities/Orders";
import { Products } from "../db/entities/Products";
import { ProductsCategory } from "../db/entities/ProductsCategory";
import { ProductsOrder } from "../db/entities/ProductsOrder";
import { Review } from "../db/entities/Reviews";
import { Users } from "../db/entities/Users";
//-------------------------------------------DB CONNECTION TEST----------------------------------------------------------------------------------------

async function startApp() {
  try {
    const connectionManager = getConnectionManager();
    const AppDataSource  = connectionManager.create({
      type: "postgres",
      host: "localhost",
      port: process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        Roles,
        Brands,
        Categories,
        Orders,
        Products,
        ProductsCategory,
        ProductsOrder,
        Review,
        Users,
      ],
      logging: true,
      synchronize: true,
    } as ConnectionOptions);

    await AppDataSource.connect();
    console.log("TypeORM connected!");

    try {
      const rolesRepo = getRepository(Roles);
      const brandsRepo = getRepository(Brands);
      const categoriesRepo = getRepository(Categories);
      const ordersRepo = getRepository(Orders);
      const productsRepo = getRepository(Products);
      const productsCategoryRepo = getRepository(ProductsCategory);
      const productsOrderRepo = getRepository(ProductsOrder);
      const reviewsRepo = getRepository(Review);
      const usersRepo = getRepository(Users);

      const roles = await rolesRepo.find();
      const brands = await brandsRepo.find();
      const categories = await categoriesRepo.find();
      const orders = await ordersRepo.find();
      const products = await productsRepo.find();
      const productCategories = await productsCategoryRepo.find();
      const productOrders = await productsOrderRepo.find();
      const reviews = await reviewsRepo.find();
      const users = await usersRepo.find();

      console.log({
        roles,
        brands,
        categories,
        orders,
        products,
        productCategories,
        productOrders,
        reviews,
        users,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
}

startApp();
//-----------------------------------------------------------------------------------------------------------------------------------------------------

export default function Home() {
  return <div>HOME PAGE</div>;
}
