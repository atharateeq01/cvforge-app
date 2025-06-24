import { config } from "dotenv"
import postgres from "postgres"

// Load environment variables
config({ path: ".env.local" })

async function testConnection() {
    let client: postgres.Sql | null = null

    try {
        console.log("🔍 Testing database connection...")

        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL environment variable is not set")
        }

        console.log("📊 Database URL found:", process.env.DATABASE_URL.replace(/:[^:@]*@/, ":****@"))

        // Create connection
        client = postgres(process.env.DATABASE_URL, {
            ssl: "require",
            max: 1,
            connect_timeout: 10,
        })

        // Test basic connection
        const result = await client`SELECT version(), current_database(), current_user`
        console.log("✅ Connection successful!")
        console.log("📋 Database info:", result[0])

        // Check if our tables exist
        const tables = await client`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'accounts', 'cvs', 'cv_templates')
    `

        console.log(
            "📊 Existing tables:",
            tables.map((t) => t.table_name),
        )

        if (tables.length === 0) {
            console.log("⚠️  No CVForge tables found. You may need to run migrations first.")
        }
    } catch (error) {
        console.error("❌ Connection failed:", error)

        if (error instanceof Error) {
            console.error("Error details:", error.message)
        }
    } finally {
        if (client) {
            await client.end()
        }
    }
}

testConnection()
