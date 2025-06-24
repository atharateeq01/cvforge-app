import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { cvs } from "@/lib/db/schema"
import { supabase } from "@/lib/auth/supabase"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userCvs = await db.select().from(cvs).where(eq(cvs.userId, user.id))

    return NextResponse.json(userCvs)
  } catch (error) {
    console.error("Error fetching CVs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, templateId } = body

    const [newCv] = await db
      .insert(cvs)
      .values({
        userId: user.id,
        title,
        content,
        templateId,
        isDraft: true,
      })
      .returning()

    return NextResponse.json(newCv)
  } catch (error) {
    console.error("Error creating CV:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
