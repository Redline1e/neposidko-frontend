import { db } from "@/db/drizzle"; 
import { products } from "@/db/schema";
import { Hono } from "hono";

const app = new Hono().post("/", async (c) => {
  const { brandId, categoryId, price, discount, description, imageUrl } = await c.req.json();

  try {
    const [data] = await db.insert(products).values({
      brandId,
      categoryId,
      price,
      discount,
      description,
      imageUrl,
    }).returning();

    return c.json({ data }, 201); 
  } catch (error) {
    return c.json({ error: 'Failed to create product' }, 500);
  }
});

export default app;
