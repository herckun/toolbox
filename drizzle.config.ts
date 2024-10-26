import "dotenv/config";
import { defineConfig } from "drizzle-kit";

import "dotenv/config";

const TURSO_CONNECTION_URL = process.env.TURSO_CONNECTION_URL as string;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN as string;

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "turso",
  dbCredentials: {
    url: TURSO_CONNECTION_URL,
    authToken: TURSO_AUTH_TOKEN,
  },
});
