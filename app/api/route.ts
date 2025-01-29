import "reflect-metadata";
import {
  createConnection,
  ConnectionOptions,
  getConnectionManager,
} from "typeorm";

import { Roles } from "../entities/Roles";
import { getRepository } from "typeorm";
import { Brands } from "../entities/Brands";
import { Categories } from "../entities/Categories";
import { Orders } from "../entities/Orders";
import { Products } from "../entities/Products";
import { ProductsCategory } from "../entities/ProductsCategory";
import { ProductsOrder } from "../entities/ProductsOrder";
import { Review } from "../entities/Reviews";
import { Users } from "../entities/Users";

async function startApp() {
  try {
    const connectionManager = getConnectionManager();
    const connection = connectionManager.create({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "Andrey06",
      database: "neposidko",
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

    await connection.connect();
    console.log("TypeORM connected!");

    try {
      const q = getRepository(Roles);
      const w = getRepository(Brands);
      const e = getRepository(Categories);
      const r = getRepository(Orders);
      const t = getRepository(Products);
      const y = getRepository(ProductsCategory);
      const u = getRepository(ProductsOrder);
      const i = getRepository(Review);
      const o = getRepository(Users);
      const a = await q.find();
      const s = await w.find();
      const d = await e.find();
      const f = await r.find();
      const g = await t.find();
      const h = await y.find();
      const j = await u.find();
      const k = await i.find();
      const l = await o.find();

      console.log(a, s, d, f, g, h, j, k, l);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
}

startApp();
