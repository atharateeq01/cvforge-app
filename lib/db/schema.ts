import { pgTable, text, timestamp, uuid, jsonb, boolean } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  provider: text("provider").notNull(), // 'email' | 'google'
  providerAccountId: text("provider_account_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const cvTemplates = pgTable("cv_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  previewUrl: text("preview_url"),
  category: text("category").notNull().default("modern"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const cvs = pgTable("cvs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  templateId: uuid("template_id").references(() => cvTemplates.id),
  title: text("title").notNull(),
  content: jsonb("content").notNull(),
  isDraft: boolean("is_draft").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Zod schemas
export const insertUserSchema = createInsertSchema(users)
export const selectUserSchema = createSelectSchema(users)
export const insertCvSchema = createInsertSchema(cvs)
export const selectCvSchema = createSelectSchema(cvs)

export const cvContentSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    location: z.string().optional(),
    website: z.string().url().optional().or(z.literal("")),
    linkedin: z.string().url().optional().or(z.literal("")),
    summary: z.string().optional(),
  }),
  experience: z.array(
    z.object({
      id: z.string(),
      company: z.string().min(1, "Company is required"),
      position: z.string().min(1, "Position is required"),
      startDate: z.string().min(1, "Start date is required"),
      endDate: z.string().optional(),
      current: z.boolean().default(false),
      description: z.string().optional(),
      location: z.string().optional(),
    }),
  ),
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
  skills: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, "Skill name is required"),
      level: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]).optional(),
      category: z.string().optional(),
    }),
  ),
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
  languages: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, "Language name is required"),
      proficiency: z.enum(["Basic", "Conversational", "Fluent", "Native"]),
    }),
  ),
})

export type CvContent = z.infer<typeof cvContentSchema>
export type User = typeof users.$inferSelect
export type Cv = typeof cvs.$inferSelect
export type CvTemplate = typeof cvTemplates.$inferSelect
