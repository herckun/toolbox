import { drizzle } from "drizzle-orm/libsql";
import "dotenv/config";
import { createClient } from "libsql-stateless-easy";

const TURSO_CONNECTION_URL = process.env.TURSO_CONNECTION_URL as string;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN as string;

const client = createClient({
  url: TURSO_CONNECTION_URL!.replace("libsql", "https"),
  authToken: TURSO_AUTH_TOKEN!,
});

export const db = drizzle(client);
