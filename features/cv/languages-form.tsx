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
import { Plus, Trash2, Globe } from "lucide-react"

const languagesSchema = z.object({
  languages: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, "Language name is required"),
      proficiency: z.enum(["Basic", "Conversational", "Fluent", "Native"]),
    }),
  ),
})

type LanguagesForm = z.infer<typeof languagesSchema>

const proficiencyLevels = [
  { value: "Basic", label: "Basic", description: "Limited working proficiency" },
  { value: "Conversational", label: "Conversational", description: "Professional working proficiency" },
  { value: "Fluent", label: "Fluent", description: "Full professional proficiency" },
  { value: "Native", label: "Native", description: "Native or bilingual proficiency" },
]

export function LanguagesForm() {
  const [formData, setFormData] = useAtom(cvFormDataAtom)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LanguagesForm>({
    resolver: zodResolver(languagesSchema),
    defaultValues: {
      languages:
        formData.languages.length > 0
          ? formData.languages
          : [
            {
              id: crypto.randomUUID(),
              name: "",
              proficiency: "Basic",
            },
          ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "languages",
  })

  const watchedValues = watch()

  React.useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      languages: watchedValues.languages,
    }))
  }, [watchedValues, setFormData])

  const addLanguage = () => {
    append({
      id: crypto.randomUUID(),
      name: "",
      proficiency: "Basic",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Languages</h3>
          <p className="text-sm text-muted-foreground">Add languages you speak and your proficiency level.</p>
        </div>
        <Button onClick={addLanguage} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Language
        </Button>
      </div>

      <div className="grid gap-4">
        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                  <Label htmlFor={`languages.${index}.name`}>Language *</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="English, Spanish, French..."
                      className="pl-10"
                      {...register(`languages.${index}.name`)}
                    />
                  </div>
                  {errors.languages?.[index]?.name && (
                    <p className="text-sm text-destructive">{errors.languages[index]?.name?.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`languages.${index}.proficiency`}>Proficiency Level *</Label>
                  <Select
                    value={watch(`languages.${index}.proficiency`) || "Basic"}
                    onValueChange={(value) => setValue(`languages.${index}.proficiency`, value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select proficiency" />
                    </SelectTrigger>
                    <SelectContent>
                      {proficiencyLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          <div>
                            <div className="font-medium">{level.label}</div>
                            <div className="text-xs text-muted-foreground">{level.description}</div>
                          </div>
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
        <h4 className="font-medium mb-2">💡 Language tips:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Only include languages you can actually use in a professional setting</li>
          <li>• Be honest about your proficiency levels</li>
          <li>• Consider including your native language(s)</li>
          <li>• Language skills can be a significant advantage in many roles</li>
        </ul>
      </div>
    </div>
  )
}
