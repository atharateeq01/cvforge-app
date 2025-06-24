import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { cvs } from "@/lib/db/schema"
import { supabase } from "@/lib/auth/supabase"
import { eq, and } from "drizzle-orm"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    const [cv] = await db
      .select()
      .from(cvs)
      .where(and(eq(cvs.id, params.id), eq(cvs.userId, user.id)))

    if (!cv) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 })
    }

    return NextResponse.json(cv)
  } catch (error) {
    console.error("Error fetching CV:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
    const { title, content, templateId, isDraft } = body

    const [updatedCv] = await db
      .update(cvs)
      .set({
        title,
        content,
        templateId,
        isDraft,
        updatedAt: new Date(),
      })
      .where(and(eq(cvs.id, params.id), eq(cvs.userId, user.id)))
      .returning()

    if (!updatedCv) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 })
    }

    return NextResponse.json(updatedCv)
  } catch (error) {
    console.error("Error updating CV:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    await db.delete(cvs).where(and(eq(cvs.id, params.id), eq(cvs.userId, user.id)))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting CV:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
