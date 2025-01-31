import { db } from "./db";
import { users } from "./schema";


export async function createUser(name: string, email: string, password: string, roleId: number) {
  const result = await db.insert(users).values({
    name,
    email,
    password,
    roleId
  }).returning();

  return result[0];
}
