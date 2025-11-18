"use client"

import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MapPin, Phone, Mail, Globe, Clock, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { OrganizationCard } from "@/components/organization-card"
import mockData from "@/data/mock-data.json"

export default function OrganizationPage() {
  const params = useParams()
  const id = params.id as string

  const organization = mockData.organizations.find((org) => org.id === id)

  // Find related organizations (same category)
  const relatedOrgs = organization
    ? mockData.organizations.filter((org) => org.category === organization.category && org.id !== id).slice(0, 3)
    : []

  const categoryColor = organization
    ? mockData.categories.find((c) => c.name === organization.category)?.color_code
    : undefined

  if (!organization) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Organization not found</h1>
          <Button asChild>
            <Link href="/browse">Browse Resources</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container py-8">
        {/* Hero Image */}
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg bg-muted mb-8">
          {organization.image_url ? (
            <Image
              src={organization.image_url || "/placeholder.svg"}
              alt={organization.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
              <span className="text-6xl font-bold text-primary/20">{organization.name.charAt(0)}</span>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{organization.name}</h1>
                    {organization.category && categoryColor && (
                      <Badge
                        variant="secondary"
                        style={{
                          backgroundColor: `${categoryColor}20`,
                          color: categoryColor,
                          borderColor: categoryColor,
                        }}
                      >
                        {organization.category}
                      </Badge>
                    )}
                  </div>
                  {(organization.city || organization.county) && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {organization.city}
                        {organization.city && organization.county && ", "}
                        {organization.county}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Special Attributes */}
              <div className="flex flex-wrap gap-2">
                {organization.is_women_owned && (
                  <Badge variant="outline" className="bg-primary/5">
                    Women-Owned
                  </Badge>
                )}
                {organization.is_poc_owned && (
                  <Badge variant="outline" className="bg-primary/5">
                    POC-Owned
                  </Badge>
                )}
                {organization.is_accessible && (
                  <Badge variant="outline" className="bg-primary/5">
                    Accessible
                  </Badge>
                )}
                {organization.is_youth_focused && (
                  <Badge variant="outline" className="bg-primary/5">
                    Youth-Focused
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* Description */}
            {organization.description && (
              <div>
                <h2 className="text-xl font-semibold mb-3">About</h2>
                <p className="text-muted-foreground leading-relaxed">{organization.description}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-lg">Contact Information</h3>

                {organization.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p>{organization.address}</p>
                      <p>
                        {organization.city}, {organization.state} {organization.zip_code}
                      </p>
                    </div>
                  </div>
                )}

                {organization.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground shrink-0" />
                    <a href={`tel:${organization.phone}`} className="text-sm hover:text-primary">
                      {organization.phone}
                    </a>
                  </div>
                )}

                {organization.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
                    <a href={`mailto:${organization.email}`} className="text-sm hover:text-primary">
                      {organization.email}
                    </a>
                  </div>
                )}

                {organization.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground shrink-0" />
                    <a
                      href={organization.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:text-primary flex items-center gap-1"
                    >
                      Visit Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}

                {organization.hours && (
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="text-sm whitespace-pre-line">{organization.hours}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Map Preview */}
            {organization.latitude && organization.longitude && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Location</h3>
                  <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${organization.longitude - 0.01},${organization.latitude - 0.01},${organization.longitude + 0.01},${organization.latitude + 0.01}&layer=mapnik&marker=${organization.latitude},${organization.longitude}`}
                    />
                  </div>
                  <Button variant="outline" className="w-full mt-3 bg-transparent" asChild>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${organization.latitude},${organization.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on Google Maps
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Related Organizations */}
        {relatedOrgs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Similar Resources</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedOrgs.map((org) => (
                <OrganizationCard
                  key={org.id}
                  organization={org}
                  categoryColor={mockData.categories.find((c) => c.name === org.category)?.color_code}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
