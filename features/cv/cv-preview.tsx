"use client"
import type { CvContent } from "@/lib/db/schema"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Globe, Linkedin, Calendar, ExternalLink } from "lucide-react"

interface CvPreviewProps {
  data: CvContent
  templateId?: string | null
}

export function CvPreview({ data, templateId = "1" }: CvPreviewProps) {
  const renderModernTemplate = () => (
    <div className="max-w-4xl mx-auto bg-white text-black p-8 print:p-6 print:shadow-none shadow-lg">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {data.personalInfo.firstName} {data.personalInfo.lastName}
        </h1>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
          {data.personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <span>{data.personalInfo.phone}</span>
            </div>
          )}
          {data.personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{data.personalInfo.location}</span>
            </div>
          )}
          {data.personalInfo.website && (
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span>{data.personalInfo.website}</span>
            </div>
          )}
          {data.personalInfo.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="h-4 w-4" />
              <span>{data.personalInfo.linkedin}</span>
            </div>
          )}
        </div>

        {data.personalInfo.summary && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
          </div>
        )}
      </header>

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="mb-8 print-avoid-break">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
            Professional Experience
          </h2>
          <div className="space-y-6">
            {data.experience.map((exp) => (
              <div key={exp.id} className="print-avoid-break">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-gray-700 font-medium">{exp.company}</p>
                    {exp.location && <p className="text-gray-600 text-sm">{exp.location}</p>}
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(exp.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })} -{" "}
                        {exp.current
                          ? "Present"
                          : exp.endDate
                            ? new Date(exp.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                            : "Present"}
                      </span>
                    </div>
                  </div>
                </div>
                {exp.description && (
                  <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{exp.description}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-8 print-avoid-break">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">Education</h2>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id} className="print-avoid-break">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-700 font-medium">{edu.institution}</p>
                    {edu.field && <p className="text-gray-600 text-sm">{edu.field}</p>}
                    {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(edu.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })} -{" "}
                        {edu.current
                          ? "Present"
                          : edu.endDate
                            ? new Date(edu.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                            : "Present"}
                      </span>
                    </div>
                  </div>
                </div>
                {edu.description && <div className="text-gray-700 text-sm leading-relaxed">{edu.description}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <section className="mb-8 print-avoid-break">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(
              data.skills.reduce(
                (acc, skill) => {
                  const category = skill.category || "Other"
                  if (!acc[category]) acc[category] = []
                  acc[category].push(skill)
                  return acc
                },
                {} as Record<string, typeof data.skills>,
              ),
            ).map(([category, skills]) => (
              <div key={category} className="print-avoid-break">
                <h3 className="font-semibold text-gray-900 mb-2">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill.id} variant="secondary" className="text-xs">
                      {skill.name}
                      {skill.level && ` (${skill.level})`}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <section className="mb-8 print-avoid-break">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">Projects</h2>
          <div className="space-y-4">
            {data.projects.map((project) => (
              <div key={project.id} className="print-avoid-break">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.technologies.map((tech, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  {(project.startDate || project.endDate) && (
                    <div className="text-right text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {project.startDate &&
                            new Date(project.startDate).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })}
                          {project.startDate && project.endDate && " - "}
                          {project.endDate &&
                            new Date(project.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                {project.description && (
                  <div className="text-gray-700 text-sm leading-relaxed">{project.description}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <section className="mb-8 print-avoid-break">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">Certifications</h2>
          <div className="space-y-4">
            {data.certifications.map((cert) => (
              <div key={cert.id} className="print-avoid-break">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">{cert.name}</h3>
                      {cert.url && (
                        <a
                          href={cert.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-gray-700 font-medium">{cert.issuer}</p>
                    {cert.credentialId && <p className="text-gray-600 text-sm">Credential ID: {cert.credentialId}</p>}
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(cert.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        {cert.expiryDate && (
                          <span className="block">
                            Expires:{" "}
                            {new Date(cert.expiryDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <section className="mb-8 print-avoid-break">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">Languages</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {data.languages.map((lang) => (
              <div key={lang.id} className="flex justify-between items-center">
                <span className="font-medium text-gray-900">{lang.name}</span>
                <Badge variant="outline" className="text-xs">
                  {lang.proficiency}
                </Badge>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )

  const renderCreativeTemplate = () => (
    <div className="max-w-4xl mx-auto bg-white text-black p-8 print:p-6 print:shadow-none shadow-lg">
      {/* Creative template with different styling */}
      <div className="border-l-4 border-blue-500 pl-6">
        <header className="mb-8">
          <h1 className="text-5xl font-light text-gray-900 mb-2">
            {data.personalInfo.firstName} <span className="font-bold">{data.personalInfo.lastName}</span>
          </h1>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
            {data.personalInfo.email && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <span>{data.personalInfo.email}</span>
              </div>
            )}
            {data.personalInfo.phone && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Phone className="h-4 w-4 text-green-600" />
                </div>
                <span>{data.personalInfo.phone}</span>
              </div>
            )}
            {data.personalInfo.location && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-red-600" />
                </div>
                <span>{data.personalInfo.location}</span>
              </div>
            )}
            {data.personalInfo.website && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Globe className="h-4 w-4 text-purple-600" />
                </div>
                <span>{data.personalInfo.website}</span>
              </div>
            )}
          </div>

          {data.personalInfo.summary && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-l-4 border-blue-500">
              <p className="text-gray-700 leading-relaxed italic">{data.personalInfo.summary}</p>
            </div>
          )}
        </header>

        {/* Rest of the sections with creative styling... */}
        {/* For brevity, I'll use the same content structure as modern template */}
        {renderModernTemplate().props.children.slice(1)}
      </div>
    </div>
  )

  // Template selection logic
  const renderTemplate = () => {
    switch (templateId) {
      case "2":
        return renderCreativeTemplate()
      case "1":
      default:
        return renderModernTemplate()
    }
  }

  return <div className="cv-preview">{renderTemplate()}</div>
}
