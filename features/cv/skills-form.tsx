"use client"

import React from "react"
import { useAtom } from "jotai"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { cvFormDataAtom } from "@/store/atoms"
import { Plus, Trash2, Code, Star } from "lucide-react"

const skillsSchema = z.object({
  skills: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, "Skill name is required"),
      level: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]).optional(),
      category: z.string().optional(),
    }),
  ),
})

type SkillsForm = z.infer<typeof skillsSchema>

const skillLevels = [
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
  { value: "Expert", label: "Expert" },
]

const skillCategories = [
  "Programming Languages",
  "Frameworks & Libraries",
  "Databases",
  "Tools & Technologies",
  "Soft Skills",
  "Languages",
  "Other",
]

export function SkillsForm() {
  const [formData, setFormData] = useAtom(cvFormDataAtom)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SkillsForm>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills:
        formData.skills.length > 0
          ? formData.skills
          : [
              {
                id: crypto.randomUUID(),
                name: "",
                level: undefined,
                category: "",
              },
            ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  })

  const watchedValues = watch()

  React.useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      skills: watchedValues.skills,
    }))
  }, [watchedValues, setFormData])

  const addSkill = () => {
    append({
      id: crypto.randomUUID(),
      name: "",
      level: undefined,
      category: "",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Skills</h3>
          <p className="text-sm text-muted-foreground">Add your technical and soft skills with proficiency levels.</p>
        </div>
        <Button onClick={addSkill} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Skill
        </Button>
      </div>

      <div className="grid gap-4">
        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                  <Label htmlFor={`skills.${index}.name`}>Skill Name *</Label>
                  <div className="relative">
                    <Code className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="JavaScript, Leadership, etc."
                      className="pl-10"
                      {...register(`skills.${index}.name`)}
                    />
                  </div>
                  {errors.skills?.[index]?.name && (
                    <p className="text-sm text-destructive">{errors.skills[index]?.name?.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`skills.${index}.level`}>Proficiency Level</Label>
                  <Select
                    value={watch(`skills.${index}.level`) || ""}
                    onValueChange={(value) => setValue(`skills.${index}.level`, value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {skillLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          <div className="flex items-center">
                            <Star className="mr-2 h-4 w-4" />
                            {level.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`skills.${index}.category`}>Category</Label>
                  <Select
                    value={watch(`skills.${index}.category`) || ""}
                    onValueChange={(value) => setValue(`skills.${index}.category`, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {skillCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end">
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="font-medium mb-2">💡 Tips for adding skills:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Include both technical and soft skills relevant to your target role</li>
          <li>• Be honest about your proficiency levels</li>
          <li>• Group similar skills using categories for better organization</li>
          <li>• Focus on skills that are mentioned in job descriptions you're targeting</li>
        </ul>
      </div>
    </div>
  )
}
