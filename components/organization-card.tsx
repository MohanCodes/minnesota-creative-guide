'use client';

import React from 'react';
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { MapPin, Phone, Globe, Mail } from 'lucide-react'
import { CopyLinkButton } from '@/components/copy-link-button'
import { useRouter } from 'next/navigation'

interface OrganizationCardProps {
  organization: {
    id: string
    resource: string
    description: string | null
    service_area: string | null
    website: string | null
    number: string | null
    email: string | null
    address: string | null
    upcoming_events: string | null
    opportunities: string | null
    how_to_support: string | null
    women_owned: boolean
    poc_owned: boolean
    lgbtqia_owned: boolean
    comments: string | null
    edition: string[] | null
  }
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  const router = useRouter()
  const badges = []
  if (organization.women_owned) badges.push("Women-Owned")
  if (organization.poc_owned) badges.push("POC-Owned")
  if (organization.lgbtqia_owned) badges.push("LGBTQIA+ Owned")

  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate if the click is not on a link
    if ((e.target as HTMLElement).tagName !== 'A') {
      router.push(`/organizations/${organization.id}`)
    }
  }

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg hover:border-accent/50 bg-card cursor-pointer" onClick={handleCardClick}>
      <CardContent className="">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg leading-tight line-clamp-1 group-hover:text-accent transition-colors">
            {organization.resource}
          </h3>
        </div>

        {organization.description && (
          <p className="text-sm text-card-foreground/70 line-clamp-2 mb-3">{organization.description}</p>
        )}

        <div className="flex flex-col gap-2 text-sm text-card-foreground/70">
          {organization.address && (
            <div className="flex items-start gap-1">
              <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{organization.address}</span>
            </div>
          )}

          {organization.number && (
            <div className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <a href={`tel:${organization.number}`} className="hover:text-accent">
                {organization.number}
              </a>
            </div>
          )}

          {organization.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <a href={`mailto:${organization.email}`} className="hover:text-accent line-clamp-1">
                {organization.email}
              </a>
            </div>
          )}

          {organization.website && (
            <div className="flex items-center gap-1">
              <Globe className="h-3.5 w-3.5 shrink-0" />
              <a 
                href={organization.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="line-clamp-1 hover:text-accent"
              >
                {organization.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </div>
      </CardContent>

      {(badges.length > 0 || organization.how_to_support || (organization.edition && organization.edition.length > 0)) && (
        <CardFooter className="p-4 pt-0 flex flex-col items-start gap-2">
          {(badges.length > 0 || (organization.edition && organization.edition.length > 0)) && (
            <div className="flex flex-wrap gap-1 w-full">
              {organization.edition && organization.edition.length > 0 && (
                <Badge 
                  variant="outline" 
                  className="text-xs bg-white border-card-foreground/30 text-gray-700"
                >
                  {organization.edition.join(", ")}
                </Badge>
              )}
              {badges.map((badge) => (
                <Badge 
                  key={badge} 
                  variant="outline" 
                  className="text-xs bg-white border-card-foreground/30 text-gray-700"
                >
                  {badge}
                </Badge>
              ))}
            </div>
          )}
          
          {organization.how_to_support && (
            <p className="text-xs text-card-foreground/60 mt-1">
              <span className="font-medium">How to support:</span> {organization.how_to_support}
            </p>
          )}
        </CardFooter>
      )}
      <CopyLinkButton url={`${typeof window !== 'undefined' ? window.location.origin : ''}/organizations/${organization.id}`} className="absolute right-3 top-3" />
    </Card>
  )
} 