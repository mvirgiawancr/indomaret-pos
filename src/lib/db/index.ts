import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

// Create the connection
const sql = neon(process.env.DATABASE_URL!);

// Create the drizzle database instance
export const db = drizzle(sql, { schema });

// Export all schema items for easy access
export * from "./schema";
