"use client"

import React from "react"
import { useAtom } from "jotai"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cvFormDataAtom } from "@/store/atoms"
import { Plus, Trash2, Award, Building, Calendar, Globe, Hash } from "lucide-react"

const certificationsSchema = z.object({
  certifications: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, "Certification name is required"),
      issuer: z.string().min(1, "Issuer is required"),
      date: z.string().min(1, "Date is required"),
      expiryDate: z.string().optional(),
      credentialId: z.string().optional(),
      url: z.string().url().optional().or(z.literal("")),
    }),
  ),
})

type CertificationsForm = z.infer<typeof certificationsSchema>

export function CertificationsForm() {
  const [formData, setFormData] = useAtom(cvFormDataAtom)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CertificationsForm>({
    resolver: zodResolver(certificationsSchema),
    defaultValues: {
      certifications:
        formData.certifications.length > 0
          ? formData.certifications
          : [
              {
                id: crypto.randomUUID(),
                name: "",
                issuer: "",
                date: "",
                expiryDate: "",
                credentialId: "",
                url: "",
              },
            ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "certifications",
  })

  const watchedValues = watch()

  React.useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      certifications: watchedValues.certifications,
    }))
  }, [watchedValues, setFormData])

  const addCertification = () => {
    append({
      id: crypto.randomUUID(),
      name: "",
      issuer: "",
      date: "",
      expiryDate: "",
      credentialId: "",
      url: "",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Certifications</h3>
          <p className="text-sm text-muted-foreground">Add your professional certifications and achievements.</p>
        </div>
        <Button onClick={addCertification} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Certification
        </Button>
      </div>

      {fields.map((field, index) => (
        <Card key={field.id}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Certification {index + 1}</CardTitle>
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
              <Label htmlFor={`certifications.${index}.name`}>Certification Name *</Label>
              <div className="relative">
                <Award className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="AWS Certified Solutions Architect"
                  className="pl-10"
                  {...register(`certifications.${index}.name`)}
                />
              </div>
              {errors.certifications?.[index]?.name && (
                <p className="text-sm text-destructive">{errors.certifications[index]?.name?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`certifications.${index}.issuer`}>Issuing Organization *</Label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Amazon Web Services"
                  className="pl-10"
                  {...register(`certifications.${index}.issuer`)}
                />
              </div>
              {errors.certifications?.[index]?.issuer && (
                <p className="text-sm text-destructive">{errors.certifications[index]?.issuer?.message}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`certifications.${index}.date`}>Issue Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input type="month" className="pl-10" {...register(`certifications.${index}.date`)} />
                </div>
                {errors.certifications?.[index]?.date && (
                  <p className="text-sm text-destructive">{errors.certifications[index]?.date?.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`certifications.${index}.expiryDate`}>Expiry Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input type="month" className="pl-10" {...register(`certifications.${index}.expiryDate`)} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`certifications.${index}.credentialId`}>Credential ID</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ABC123DEF456"
                  className="pl-10"
                  {...register(`certifications.${index}.credentialId`)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`certifications.${index}.url`}>Credential URL</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="https://www.credly.com/badges/..."
                  className="pl-10"
                  {...register(`certifications.${index}.url`)}
                />
              </div>
              {errors.certifications?.[index]?.url && (
                <p className="text-sm text-destructive">{errors.certifications[index]?.url?.message}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="font-medium mb-2">💡 Certification tips:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Include relevant professional certifications for your field</li>
          <li>• Add credential IDs and verification URLs when available</li>
          <li>• Keep track of expiry dates for time-sensitive certifications</li>
          <li>• Prioritize certifications that are recognized in your industry</li>
        </ul>
      </div>
    </div>
  )
}
