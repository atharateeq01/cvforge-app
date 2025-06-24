"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, ArrowLeft, Eye } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

const templates = [
  {
    id: "1",
    name: "Modern Professional",
    description: "Clean and modern design perfect for corporate roles",
    category: "modern",
    previewUrl: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "2",
    name: "Creative Designer",
    description: "Eye-catching layout for creative professionals",
    category: "creative",
    previewUrl: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "3",
    name: "Executive",
    description: "Sophisticated template for senior positions",
    category: "executive",
    previewUrl: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "4",
    name: "Minimalist",
    description: "Simple and clean design focusing on content",
    category: "minimal",
    previewUrl: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "5",
    name: "Tech Professional",
    description: "Perfect for software developers and tech roles",
    category: "tech",
    previewUrl: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "6",
    name: "Academic",
    description: "Formal template for academic and research positions",
    category: "academic",
    previewUrl: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "7",
    name: "Sales & Marketing",
    description: "Dynamic template for sales and marketing professionals",
    category: "sales",
    previewUrl: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "8",
    name: "Healthcare",
    description: "Professional template for healthcare workers",
    category: "healthcare",
    previewUrl: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "9",
    name: "Finance",
    description: "Conservative design for finance professionals",
    category: "finance",
    previewUrl: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "10",
    name: "Startup",
    description: "Modern template for startup and entrepreneurial roles",
    category: "startup",
    previewUrl: "/placeholder.svg?height=400&width=300",
  },
]

const categories = [
  { id: "all", name: "All Templates" },
  { id: "modern", name: "Modern" },
  { id: "creative", name: "Creative" },
  { id: "executive", name: "Executive" },
  { id: "minimal", name: "Minimal" },
  { id: "tech", name: "Tech" },
  { id: "academic", name: "Academic" },
  { id: "sales", name: "Sales" },
  { id: "healthcare", name: "Healthcare" },
  { id: "finance", name: "Finance" },
  { id: "startup", name: "Startup" },
]

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredTemplates =
    selectedCategory === "all" ? templates : templates.filter((template) => template.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">CVForge</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Professional CV Templates</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from our collection of professionally designed templates. Each template is ATS-friendly and optimized
            for modern hiring practices.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="mb-2"
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={template.previewUrl || "/placeholder.svg"}
                    alt={template.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                      <Button size="sm" variant="secondary">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {template.category}
                  </Badge>
                </div>
                <CardDescription className="mb-4">{template.description}</CardDescription>
                <div className="flex gap-2">
                  <Link href={`/builder?template=${template.id}`} className="flex-1">
                    <Button className="w-full">Use Template</Button>
                  </Link>
                  <Button variant="outline" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 py-12 bg-white dark:bg-slate-900 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your CV?</h2>
          <p className="text-muted-foreground text-lg mb-6">
            Join thousands of professionals who have created stunning CVs with our templates
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="text-lg px-8">
              Get Started Free
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
