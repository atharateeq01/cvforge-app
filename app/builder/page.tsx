"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAtom } from "jotai"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Eye,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  Globe,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { PersonalInfoForm } from "@/features/cv/personal-info-form"
import { ExperienceForm } from "@/features/cv/experience-form"
import { EducationForm } from "@/features/cv/education-form"
import { SkillsForm } from "@/features/cv/skills-form"
import { ProjectsForm } from "@/features/cv/projects-form"
import { CertificationsForm } from "@/features/cv/certifications-form"
import { LanguagesForm } from "@/features/cv/languages-form"
import { cvBuilderStepAtom, cvFormDataAtom, selectedTemplateAtom, previewModeAtom, isSavingAtom } from "@/store/atoms"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { CvPreview } from "@/features/cv/cv-preview"

const steps = [
  { id: 0, title: "Personal Info", icon: User, description: "Basic information and contact details" },
  { id: 1, title: "Experience", icon: Briefcase, description: "Work history and achievements" },
  { id: 2, title: "Education", icon: GraduationCap, description: "Educational background" },
  { id: 3, title: "Skills", icon: Code, description: "Technical and soft skills" },
  { id: 4, title: "Projects", icon: FileText, description: "Notable projects and work" },
  { id: 5, title: "Certifications", icon: Award, description: "Certificates and achievements" },
  { id: 6, title: "Languages", icon: Globe, description: "Language proficiencies" },
]

export default function BuilderPage() {
  const [currentStep, setCurrentStep] = useAtom(cvBuilderStepAtom)
  const [formData, setFormData] = useAtom(cvFormDataAtom)
  const [selectedTemplate, setSelectedTemplate] = useAtom(selectedTemplateAtom)
  const [previewMode, setPreviewMode] = useAtom(previewModeAtom)
  const [isSaving, setIsSaving] = useAtom(isSavingAtom)
  const [cvId, setCvId] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const templateId = searchParams.get("template")
    if (templateId) {
      setSelectedTemplate(templateId)
    }
  }, [searchParams, setSelectedTemplate])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = async (isDraft = true) => {
    setIsSaving(true)
    try {
      const method = cvId ? "PUT" : "POST"
      const url = cvId ? `/api/cvs/${cvId}` : "/api/cvs"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `${formData.personalInfo.firstName} ${formData.personalInfo.lastName} CV`,
          content: formData,
          templateId: selectedTemplate,
          isDraft,
        }),
      })

      if (response.ok) {
        const savedCv = await response.json()
        if (!cvId) {
          setCvId(savedCv.id)
        }

        toast({
          title: "Success",
          description: isDraft ? "CV saved as draft" : "CV saved successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save CV",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoForm />
      case 1:
        return <ExperienceForm />
      case 2:
        return <EducationForm />
      case 3:
        return <SkillsForm />
      case 4:
        return <ProjectsForm />
      case 5:
        return <CertificationsForm />
      case 6:
        return <LanguagesForm />
      default:
        return <PersonalInfoForm />
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  if (previewMode) {
    return (
      <div className="min-h-screen bg-white">
        <div className="no-print border-b p-4 flex items-center justify-between">
          <Button variant="outline" onClick={() => setPreviewMode(false)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Editor
          </Button>
          <div className="flex items-center gap-2">
            <Button onClick={() => handleSave(false)}>
              <Save className="mr-2 h-4 w-4" />
              Save CV
            </Button>
            <Button onClick={() => window.print()}>Export PDF</Button>
          </div>
        </div>
        <CvPreview data={formData} templateId={selectedTemplate} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
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
            <Button variant="outline" onClick={() => setPreviewMode(true)}>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button onClick={() => handleSave()} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">CV Builder</CardTitle>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {steps.map((step) => {
                  const Icon = step.icon
                  const isActive = currentStep === step.id
                  const isCompleted = currentStep > step.id

                  return (
                    <div
                      key={step.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : isCompleted
                            ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                            : "hover:bg-muted"
                      }`}
                      onClick={() => setCurrentStep(step.id)}
                    >
                      <Icon className="h-5 w-5" />
                      <div className="flex-1">
                        <div className="font-medium">{step.title}</div>
                        <div className="text-xs opacity-70">{step.description}</div>
                      </div>
                      {isCompleted && (
                        <Badge variant="secondary" className="text-xs">
                          ✓
                        </Badge>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
                    <p className="text-muted-foreground mt-1">{steps[currentStep].description}</p>
                  </div>
                  <Badge variant="outline">
                    Step {currentStep + 1} of {steps.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {renderStepContent()}

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t">
                  <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleSave()} disabled={isSaving}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Draft
                    </Button>

                    {currentStep === steps.length - 1 ? (
                      <Button onClick={() => setPreviewMode(true)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview & Finish
                      </Button>
                    ) : (
                      <Button onClick={handleNext}>
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
