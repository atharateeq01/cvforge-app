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
import { Plus, Trash2, Building, Briefcase, MapPin, Calendar } from "lucide-react"

const experienceSchema = z.object({
  experience: z.array(
    z.object({
      id: z.string(),
      company: z.string().min(1, "Company is required"),
      position: z.string().min(1, "Position is required"),
      startDate: z.string().min(1, "Start date is required"),
      endDate: z.string().optional(),
      current: z.boolean(),
      description: z.string().optional(),
      location: z.string().optional(),
    }),
  ),
})

type ExperienceForm = z.infer<typeof experienceSchema>

export function ExperienceForm() {
  const [formData, setFormData] = useAtom(cvFormDataAtom)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ExperienceForm>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      experience:
        formData.experience.length > 0
          ? formData.experience
          : [
              {
                id: crypto.randomUUID(),
                company: "",
                position: "",
                startDate: "",
                endDate: "",
                current: false,
                description: "",
                location: "",
              },
            ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  })

  const watchedValues = watch()

  React.useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      experience: watchedValues.experience,
    }))
  }, [watchedValues, setFormData])

  const addExperience = () => {
    append({
      id: crypto.randomUUID(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      location: "",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Work Experience</h3>
          <p className="text-sm text-muted-foreground">
            Add your work experience starting with the most recent position.
          </p>
        </div>
        <Button onClick={addExperience} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      </div>

      {fields.map((field, index) => (
        <Card key={field.id}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Experience {index + 1}</CardTitle>
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
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`experience.${index}.company`}>Company *</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Company Name" className="pl-10" {...register(`experience.${index}.company`)} />
                </div>
                {errors.experience?.[index]?.company && (
                  <p className="text-sm text-destructive">{errors.experience[index]?.company?.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`experience.${index}.position`}>Position *</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Job Title" className="pl-10" {...register(`experience.${index}.position`)} />
                </div>
                {errors.experience?.[index]?.position && (
                  <p className="text-sm text-destructive">{errors.experience[index]?.position?.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`experience.${index}.location`}>Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="City, State" className="pl-10" {...register(`experience.${index}.location`)} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`experience.${index}.startDate`}>Start Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input type="month" className="pl-10" {...register(`experience.${index}.startDate`)} />
                </div>
                {errors.experience?.[index]?.startDate && (
                  <p className="text-sm text-destructive">{errors.experience[index]?.startDate?.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`experience.${index}.endDate`}>End Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="month"
                    className="pl-10"
                    disabled={watch(`experience.${index}.current`)}
                    {...register(`experience.${index}.endDate`)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`experience.${index}.current`}
                checked={watch(`experience.${index}.current`)}
                onCheckedChange={(checked) => {
                  setValue(`experience.${index}.current`, checked as boolean)
                  if (checked) {
                    setValue(`experience.${index}.endDate`, "")
                  }
                }}
              />
              <Label htmlFor={`experience.${index}.current`}>I currently work here</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`experience.${index}.description`}>Description</Label>
              <Textarea
                placeholder="Describe your responsibilities, achievements, and key contributions..."
                className="min-h-[100px]"
                {...register(`experience.${index}.description`)}
              />
              <p className="text-sm text-muted-foreground">
                Use bullet points to highlight your key achievements and responsibilities.
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
