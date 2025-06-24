import { config } from "dotenv"
import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import { cvTemplates } from "../lib/db/schema"

// Load environment variables
config({ path: ".env.local" })

const templates = [
    {
        name: "Modern Professional",
        description: "Clean and modern design perfect for corporate roles",
        category: "modern",
        previewUrl: "/templates/modern-professional.png",
    },
    {
        name: "Creative Designer",
        description: "Eye-catching layout for creative professionals",
        category: "creative",
        previewUrl: "/templates/creative-designer.png",
    },
    {
        name: "Executive",
        description: "Sophisticated template for senior positions",
        category: "executive",
        previewUrl: "/templates/executive.png",
    },
    {
        name: "Minimalist",
        description: "Simple and clean design focusing on content",
        category: "minimal",
        previewUrl: "/templates/minimalist.png",
    },
    {
        name: "Tech Professional",
        description: "Perfect for software developers and tech roles",
        category: "tech",
        previewUrl: "/templates/tech-professional.png",
    },
    {
        name: "Academic",
        description: "Formal template for academic and research positions",
        category: "academic",
        previewUrl: "/templates/academic.png",
    },
    {
        name: "Sales & Marketing",
        description: "Dynamic template for sales and marketing professionals",
        category: "sales",
        previewUrl: "/templates/sales-marketing.png",
    },
    {
        name: "Healthcare",
        description: "Professional template for healthcare workers",
        category: "healthcare",
        previewUrl: "/templates/healthcare.png",
    },
    {
        name: "Finance",
        description: "Conservative design for finance professionals",
        category: "finance",
        previewUrl: "/templates/finance.png",
    },
    {
        name: "Startup",
        description: "Modern template for startup and entrepreneurial roles",
        category: "startup",
        previewUrl: "/templates/startup.png",
    },
]

async function seed() {
    let client: postgres.Sql | null = null

    try {
        console.log("🌱 Seeding database...")

        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL environment variable is not set")
        }

        console.log("📊 Connecting to database...")

        // Create a direct connection for seeding
        client = postgres(process.env.DATABASE_URL, {
            ssl: "require",
            max: 1, // Use only one connection for seeding
        })

        const db = drizzle(client, { schema: { cvTemplates } })

        // Test connection
        await client`SELECT 1`
        console.log("✅ Database connection successful")

        // Insert CV templates
        console.log("📄 Inserting CV templates...")

        const result = await db.insert(cvTemplates).values(templates).onConflictDoNothing().returning()

        console.log(`✅ Inserted ${result.length} CV templates`)
        console.log("✅ Database seeded successfully!")
    } catch (error) {
        console.error("❌ Error seeding database:", error)

        if (error instanceof Error) {
            console.error("Error message:", error.message)
            console.error("Error stack:", error.stack)
        }

        process.exit(1)
    } finally {
        // Close the connection
        if (client) {
            await client.end()
        }
        process.exit(0)
    }
}

seed()
