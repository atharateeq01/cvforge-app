"use client"

import React from "react"

import { useAtom } from "jotai"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cvFormDataAtom } from "@/store/atoms"
import { User, Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react"

const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  summary: z.string().optional(),
})

type PersonalInfoForm = z.infer<typeof personalInfoSchema>

export function PersonalInfoForm() {
  const [formData, setFormData] = useAtom(cvFormDataAtom)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PersonalInfoForm>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: formData.personalInfo,
  })

  const watchedValues = watch()

  // Update form data in real-time
  React.useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: watchedValues,
    }))
  }, [watchedValues, setFormData])

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input id="firstName" placeholder="John" className="pl-10" {...register("firstName")} />
          </div>
          {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input id="lastName" placeholder="Doe" className="pl-10" {...register("lastName")} />
          </div>
          {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input id="email" type="email" placeholder="john@example.com" className="pl-10" {...register("email")} />
          </div>
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input id="phone" placeholder="+1 (555) 123-4567" className="pl-10" {...register("phone")} />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input id="location" placeholder="New York, NY" className="pl-10" {...register("location")} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input id="website" placeholder="https://yourwebsite.com" className="pl-10" {...register("website")} />
          </div>
          {errors.website && <p className="text-sm text-destructive">{errors.website.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <div className="relative">
            <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="linkedin"
              placeholder="https://linkedin.com/in/yourprofile"
              className="pl-10"
              {...register("linkedin")}
            />
          </div>
          {errors.linkedin && <p className="text-sm text-destructive">{errors.linkedin.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Professional Summary</Label>
        <Textarea
          id="summary"
          placeholder="Write a brief summary of your professional background and key achievements..."
          className="min-h-[120px]"
          {...register("summary")}
        />
        <p className="text-sm text-muted-foreground">
          A compelling summary can help you stand out to recruiters and hiring managers.
        </p>
      </div>
    </div>
  )
}
