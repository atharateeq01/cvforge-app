import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

// Check for DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is not set")
  console.error("Please check your .env.local file")
  throw new Error("DATABASE_URL is not set")
}

const client = postgres(process.env.DATABASE_URL)
export const db = drizzle(client, { schema })

// Export a function to close the connection
export const closeDb = async () => {
  await client.end()
}
