"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { MapPin, Phone, Globe } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"

interface OrganizationCardProps {
  organization: {
    id: string
    name: string
    description: string | null
    city: string | null
    county: string | null
    image_url: string | null
    website: string | null
    phone: string | null
    category: string
    is_women_owned: boolean
    is_poc_owned: boolean
    is_accessible: boolean
    is_youth_focused: boolean
  }
  categoryColor?: string
}

export function OrganizationCard({ organization, categoryColor }: OrganizationCardProps) {
  const badges = []
  if (organization.is_women_owned) badges.push("Women-Owned")
  if (organization.is_poc_owned) badges.push("POC-Owned")
  if (organization.is_accessible) badges.push("Accessible")
  if (organization.is_youth_focused) badges.push("Youth-Focused")

  return (
    <Link href={`/organizations/${organization.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:border-accent/50 bg-card">
        <div className="relative aspect-video overflow-hidden bg-muted">
          {organization.image_url ? (
            <Image
              src={organization.image_url || "/placeholder.svg"}
              alt={organization.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-secondary">
              <span className="text-4xl font-bold text-foreground/20">{organization.name.charAt(0)}</span>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-lg leading-tight line-clamp-1 group-hover:text-accent transition-colors">
              {organization.name}
            </h3>
            {organization.category && (
              <Badge
                variant="outline"
                className="shrink-0 bg-white"
                style={{
                  color: categoryColor,
                  borderColor: categoryColor,
                }}
              >
                {organization.category}
              </Badge>
            )}
          </div>

          {organization.description && (
            <p className="text-sm text-foreground/70 line-clamp-2 mb-3">{organization.description}</p>
          )}

          <div className="flex flex-col gap-1 text-sm text-foreground/70">
            {(organization.city || organization.county) && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="line-clamp-1">
                  {organization.city}
                  {organization.city && organization.county && ", "}
                  {organization.county}
                </span>
              </div>
            )}
            {organization.phone && (
              <div className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                <span>{organization.phone}</span>
              </div>
            )}
            {organization.website && (
              <div className="flex items-center gap-1">
                <Globe className="h-3.5 w-3.5 shrink-0" />
                <span className="line-clamp-1 hover:text-accent">{new URL(organization.website).hostname}</span>
              </div>
            )}
          </div>
        </CardContent>

        {badges.length > 0 && (
          <CardFooter className="p-4 pt-0">
            <div className="flex flex-wrap gap-1">
              {badges.map((badge) => (
                <Badge key={badge} variant="outline" className="text-xs bg-white border-foreground/30">
                  {badge}
                </Badge>
              ))}
            </div>
          </CardFooter>
        )}
      </Card>
    </Link>
  )
}
