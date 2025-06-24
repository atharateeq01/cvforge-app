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
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cvFormDataAtom } from "@/store/atoms"
import { Plus, Trash2, GraduationCap, Book, Calendar } from "lucide-react"

const educationSchema = z.object({
  education: z.array(
    z.object({
      id: z.string(),
      institution: z.string().min(1, "Institution is required"),
      degree: z.string().min(1, "Degree is required"),
      field: z.string().optional(),
      startDate: z.string().min(1, "Start date is required"),
      endDate: z.string().optional(),
      current: z.boolean().default(false),
      gpa: z.string().optional(),
      description: z.string().optional(),
    }),
  ),
})

type EducationForm = z.infer<typeof educationSchema>

export function EducationForm() {
  const [formData, setFormData] = useAtom(cvFormDataAtom)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<EducationForm>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      education:
        formData.education.length > 0
          ? formData.education
          : [
              {
                id: crypto.randomUUID(),
                institution: "",
                degree: "",
                field: "",
                startDate: "",
                endDate: "",
                current: false,
                gpa: "",
                description: "",
              },
            ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  })

  const watchedValues = watch()

  React.useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      education: watchedValues.education,
    }))
  }, [watchedValues, setFormData])

  const addEducation = () => {
    append({
      id: crypto.randomUUID(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      current: false,
      gpa: "",
      description: "",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Education</h3>
          <p className="text-sm text-muted-foreground">
            Add your educational background starting with the most recent.
          </p>
        </div>
        <Button onClick={addEducation} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Education
        </Button>
      </div>

      {fields.map((field, index) => (
        <Card key={field.id}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Education {index + 1}</CardTitle>
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
              <Label htmlFor={`education.${index}.institution`}>Institution *</Label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="University Name"
                  className="pl-10"
                  {...register(`education.${index}.institution`)}
                />
              </div>
              {errors.education?.[index]?.institution && (
                <p className="text-sm text-destructive">{errors.education[index]?.institution?.message}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`education.${index}.degree`}>Degree *</Label>
                <div className="relative">
                  <Book className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Bachelor's, Master's, PhD, etc."
                    className="pl-10"
                    {...register(`education.${index}.degree`)}
                  />
                </div>
                {errors.education?.[index]?.degree && (
                  <p className="text-sm text-destructive">{errors.education[index]?.degree?.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`education.${index}.field`}>Field of Study</Label>
                <Input placeholder="Computer Science, Business, etc." {...register(`education.${index}.field`)} />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`education.${index}.startDate`}>Start Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input type="month" className="pl-10" {...register(`education.${index}.startDate`)} />
                </div>
                {errors.education?.[index]?.startDate && (
                  <p className="text-sm text-destructive">{errors.education[index]?.startDate?.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`education.${index}.endDate`}>End Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="month"
                    className="pl-10"
                    disabled={watch(`education.${index}.current`)}
                    {...register(`education.${index}.endDate`)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`education.${index}.gpa`}>GPA (Optional)</Label>
                <Input placeholder="3.8" {...register(`education.${index}.gpa`)} />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`education.${index}.current`}
                checked={watch(`education.${index}.current`)}
                onCheckedChange={(checked) => {
                  setValue(`education.${index}.current`, checked as boolean)
                  if (checked) {
                    setValue(`education.${index}.endDate`, "")
                  }
                }}
              />
              <Label htmlFor={`education.${index}.current`}>Currently studying here</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`education.${index}.description`}>Description</Label>
              <Textarea
                placeholder="Relevant coursework, achievements, honors, etc."
                className="min-h-[80px]"
                {...register(`education.${index}.description`)}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
