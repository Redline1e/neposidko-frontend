import "reflect-metadata";
import { createConnection, getConnectionManager } from "typeorm";
import { Users } from "./entities/Users";
import { Roles } from "./entities/Roles";
import { Categories } from "./entities/Categories";
import { Orders } from "./entities/Orders";
import { Products } from "./entities/Products";
import { ProductsCategory } from "./entities/ProductsCategory";
import { ProductsOrder } from "./entities/ProductsOrder";
import { Review } from "./entities/Reviews";
import { Brands } from "./entities/Brands";

export async function startApp() {
  const connectionManager = getConnectionManager();

  if (connectionManager.has("default") && connectionManager.get("default").isConnected) {
    return connectionManager.get("default");
  }

  return createConnection({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
      Users,
      Roles,
      Categories,
      Orders,
      Products,
      ProductsCategory,
      ProductsOrder,
      Review,
      Brands,
    ],
    synchronize: true,
    logging: true,
  })
    .then(() => console.log("База даних підключена!"))
    .catch((error) => console.error("Помилка підключення до БД:", error));
}
