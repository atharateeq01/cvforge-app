"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAtom } from "jotai"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileText, Plus, MoreVertical, Edit, Copy, Download, Trash2, Upload, LogOut, User } from "lucide-react"
import { supabase } from "@/lib/auth/supabase"
import { userAtom, cvListAtom } from "@/store/atoms"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import type { Cv } from "@/lib/db/schema"

export default function DashboardPage() {
  const [user, setUser] = useAtom(userAtom)
  const [cvList, setCvList] = useAtom(cvListAtom)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkUser()
    loadCvs()
  }, [])

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push("/auth/login")
      return
    }
    setUser({
      id: user.id,
      email: user.email!,
      firstName: user.user_metadata?.first_name || "",
      lastName: user.user_metadata?.last_name || "",
      avatarUrl: user.user_metadata?.avatar_url || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  const loadCvs = async () => {
    try {
      const response = await fetch("/api/cvs")
      if (response.ok) {
        const cvs = await response.json()
        setCvList(cvs)
      }
    } catch (error) {
      console.error("Error loading CVs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleDeleteCv = async (cvId: string) => {
    if (!confirm("Are you sure you want to delete this CV?")) return

    try {
      const response = await fetch(`/api/cvs/${cvId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setCvList(cvList.filter((cv) => cv.id !== cvId))
        toast({
          title: "Success",
          description: "CV deleted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete CV",
        variant: "destructive",
      })
    }
  }

  const handleDuplicateCv = async (cv: Cv) => {
    try {
      const response = await fetch("/api/cvs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `${cv.title} (Copy)`,
          content: cv.content,
          templateId: cv.templateId,
        }),
      })

      if (response.ok) {
        const newCv = await response.json()
        setCvList([...cvList, newCv])
        toast({
          title: "Success",
          description: "CV duplicated successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate CV",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">CVForge</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.firstName || "User"}!</h1>
          <p className="text-muted-foreground">Manage your CVs and create new ones with our professional templates.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link href="/builder">
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Create New CV
            </Button>
          </Link>
          <Link href="/upload">
            <Button variant="outline" size="lg">
              <Upload className="mr-2 h-5 w-5" />
              Upload & Parse CV
            </Button>
          </Link>
          <Link href="/templates">
            <Button variant="outline" size="lg">
              <FileText className="mr-2 h-5 w-5" />
              Browse Templates
            </Button>
          </Link>
        </div>

        {/* CV List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Your CVs</h2>

          {cvList.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No CVs yet</h3>
                <p className="text-muted-foreground mb-6">Create your first CV to get started</p>
                <Link href="/builder">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First CV
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cvList.map((cv) => (
                <Card key={cv.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-1">{cv.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {cv.isDraft ? (
                            <Badge variant="secondary">Draft</Badge>
                          ) : (
                            <Badge variant="default">Complete</Badge>
                          )}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/builder/${cv.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicateCv(cv)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/export/${cv.id}`}>
                              <Download className="mr-2 h-4 w-4" />
                              Export
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteCv(cv.id)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Last updated: {new Date(cv.updatedAt).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <Link href={`/builder/${cv.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </Link>
                      <Link href={`/preview/${cv.id}`}>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
