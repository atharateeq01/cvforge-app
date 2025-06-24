import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import type { CvContent, Cv, User } from "@/lib/db/schema"

// Theme atom
export const themeAtom = atomWithStorage<"light" | "dark" | "system">("theme", "system")

// User atom
export const userAtom = atom<User | null>(null)

// Current CV being edited
export const currentCvAtom = atom<Cv | null>(null)

// CV form data
export const cvFormDataAtom = atom<CvContent>({
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
})

// CV builder step
export const cvBuilderStepAtom = atom<number>(0)

// Selected template
export const selectedTemplateAtom = atom<string | null>(null)

// CV list
export const cvListAtom = atom<Cv[]>([])

// Loading states
export const isLoadingAtom = atom<boolean>(false)
export const isSavingAtom = atom<boolean>(false)

// Preview mode
export const previewModeAtom = atom<boolean>(false)
