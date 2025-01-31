import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "npx drizzle-kit studio",
  out: "./drizzle/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    table: "neposidko",
    schema: "npx drizzle-kit studio",
  },
});
