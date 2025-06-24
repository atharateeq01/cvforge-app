"use client"

import React from "react"
import { useAtom } from "jotai"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cvFormDataAtom } from "@/store/atoms"
import { Plus, Trash2, FolderOpen, Globe, Calendar, X } from "lucide-react"

const projectsSchema = z.object({
  projects: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, "Project name is required"),
      description: z.string().optional(),
      technologies: z.array(z.string()).optional(),
      url: z.string().url().optional().or(z.literal("")),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }),
  ),
})

type ProjectsForm = z.infer<typeof projectsSchema>

export function ProjectsForm() {
  const [formData, setFormData] = useAtom(cvFormDataAtom)
  const [newTech, setNewTech] = React.useState<{ [key: number]: string }>({})

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ProjectsForm>({
    resolver: zodResolver(projectsSchema),
    defaultValues: {
      projects:
        formData.projects.length > 0
          ? formData.projects
          : [
              {
                id: crypto.randomUUID(),
                name: "",
                description: "",
                technologies: [],
                url: "",
                startDate: "",
                endDate: "",
              },
            ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  })

  const watchedValues = watch()

  React.useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      projects: watchedValues.projects,
    }))
  }, [watchedValues, setFormData])

  const addProject = () => {
    append({
      id: crypto.randomUUID(),
      name: "",
      description: "",
      technologies: [],
      url: "",
      startDate: "",
      endDate: "",
    })
  }

  const addTechnology = (index: number) => {
    const tech = newTech[index]?.trim()
    if (tech) {
      const currentTechs = watch(`projects.${index}.technologies`) || []
      if (!currentTechs.includes(tech)) {
        setValue(`projects.${index}.technologies`, [...currentTechs, tech])
      }
      setNewTech((prev) => ({ ...prev, [index]: "" }))
    }
  }

  const removeTechnology = (projectIndex: number, techIndex: number) => {
    const currentTechs = watch(`projects.${projectIndex}.technologies`) || []
    const updatedTechs = currentTechs.filter((_, i) => i !== techIndex)
    setValue(`projects.${projectIndex}.technologies`, updatedTechs)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Projects</h3>
          <p className="text-sm text-muted-foreground">Showcase your notable projects and side work.</p>
        </div>
        <Button onClick={addProject} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {fields.map((field, index) => (
        <Card key={field.id}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Project {index + 1}</CardTitle>
              {fields.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`projects.${index}.name`}>Project Name *</Label>
              <div className="relative">
                <FolderOpen className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="My Awesome Project" className="pl-10" {...register(`projects.${index}.name`)} />
              </div>
              {errors.projects?.[index]?.name && (
                <p className="text-sm text-destructive">{errors.projects[index]?.name?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`projects.${index}.url`}>Project URL</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="https://github.com/username/project"
                  className="pl-10"
                  {...register(`projects.${index}.url`)}
                />
              </div>
              {errors.projects?.[index]?.url && (
                <p className="text-sm text-destructive">{errors.projects[index]?.url?.message}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`projects.${index}.startDate`}>Start Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input type="month" className="pl-10" {...register(`projects.${index}.startDate`)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`projects.${index}.endDate`}>End Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input type="month" className="pl-10" {...register(`projects.${index}.endDate`)} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Technologies Used</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add technology (e.g., React, Node.js)"
                  value={newTech[index] || ""}
                  onChange={(e) => setNewTech((prev) => ({ ...prev, [index]: e.target.value }))}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTechnology(index)
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={() => addTechnology(index)}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {(watch(`projects.${index}.technologies`) || []).map((tech, techIndex) => (
                  <Badge key={techIndex} variant="secondary" className="flex items-center gap-1">
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(index, techIndex)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`projects.${index}.description`}>Description</Label>
              <Textarea
                placeholder="Describe the project, your role, key features, and impact..."
                className="min-h-[100px]"
                {...register(`projects.${index}.description`)}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="font-medium mb-2">💡 Project tips:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Include both personal and professional projects</li>
          <li>• Highlight the technologies and tools you used</li>
          <li>• Mention the impact or results of your projects</li>
          <li>• Provide links to live demos or source code when possible</li>
        </ul>
      </div>
    </div>
  )
}
