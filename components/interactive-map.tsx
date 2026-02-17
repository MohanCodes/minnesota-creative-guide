"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, MapPin, Phone, Mail, Globe } from "lucide-react"
import Link from "next/link"

export interface Organization {
  id: string
  name?: string
  resource?: string
  description: string
  address: string
  city: string
  county: string
  state: string
  zip_code: string
  latitude: number
  longitude: number
  category: string
  phone: string
  email: string
  website: string
  is_women_owned: boolean
  is_poc_owned: boolean
  is_lgbtqia_owned: boolean
  is_accessible: boolean
  is_youth_focused: boolean
  is_approved: boolean
}

export interface Category {
  id: string
  name: string
  color_code: string
  icon: string
}

// For backward compatibility with existing code
type CategoryWithColor = Omit<Category, 'color_code'> & {
  color: string
}

interface InteractiveMapProps {
  organizations: Organization[]
  categories: (Category | CategoryWithColor)[]
}

declare global {
  interface Window {
    L: any
  }
}

export function InteractiveMap({ organizations, categories }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Helper function to get color from category
  const getCategoryColor = (cat: Category | CategoryWithColor | undefined) => {
    if (!cat) return "#8b5cf6";
    return 'color_code' in cat ? cat.color_code : cat.color;
  };

  useEffect(() => {
    if (typeof window !== "undefined" && !window.L) {
      // Load Leaflet CSS
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
      link.crossOrigin = ""
      document.head.appendChild(link)

      // Load Leaflet JS
      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
      script.crossOrigin = ""
      script.onload = () => {
        setIsLoaded(true)
      }
      document.head.appendChild(script)
    } else if (window.L) {
      setIsLoaded(true)
    }
  }, [])

  // Initialize map once
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.L || mapInstanceRef.current) return

    const minnesotaCenter: [number, number] = [46.7296, -94.6859]

    const map = window.L.map(mapRef.current).setView(minnesotaCenter, 7)

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    mapInstanceRef.current = map

    // Cleanup function only on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [isLoaded])

  // Update markers when organizations or categories change
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    // Add style element for custom markers if not already added
    if (!document.getElementById('custom-marker-styles')) {
      const style = document.createElement('style');
      style.id = 'custom-marker-styles';
      style.textContent = `
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    organizations.forEach((org) => {
      if (org.latitude && org.longitude) {
        // Match org.description with category.name to get the color
        const category = categories.find((c) => c.name === org.description);
        const color = getCategoryColor(category)

        // Create custom colored marker icon
        const customIcon = window.L.divIcon({
          className: "custom-marker",
          html: `
            <div style="
              width: 16px;
              height: 16px;
              background-color: ${color};
              border: 2px solid white;
              border-radius: 50%;
              box-shadow: 0 1px 3px rgba(0,0,0,0.3);
              cursor: pointer;
            "></div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        })

        const marker = window.L.marker([org.latitude, org.longitude], {
          icon: customIcon,
          title: org.resource,
        }).addTo(mapInstanceRef.current)

        markersRef.current.push(marker)

        marker.on("click", () => {
          setSelectedOrg(org)
          const currentZoom = mapInstanceRef.current.getZoom()
          mapInstanceRef.current.setView(
            [org.latitude, org.longitude], 
            Math.max(currentZoom, 10),
            { animate: true }
          )
        })
      }
    })
  }, [isLoaded, organizations, categories])

  const category = selectedOrg ? categories.find((c) => c.name === selectedOrg.description) : null

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-3/4 min-h-[600px] rounded-lg" style={{ zIndex: 0 }} />

      {/* Selected Organization Card - Portal to ensure it stays on top */}
      {selectedOrg && (
        <Card className="absolute top-4 left-4 w-96 max-w-[calc(100%-2rem)] shadow-lg max-h-[calc(100%-2rem)] overflow-y-auto bg-card" style={{ zIndex: 1000 }}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-lg leading-tight text-white">
                  {selectedOrg.name || selectedOrg.resource}
                </h3>
                {selectedOrg.county && (
                  <p className="text-sm text-card-foreground/70 mt-1">
                    {selectedOrg.city && `${selectedOrg.city}, `}{selectedOrg.county} County
                  </p>
                )}
              </div>
              <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8" onClick={() => setSelectedOrg(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {category && (
              <Badge style={{ backgroundColor: getCategoryColor(category), color: 'white' }} className="mb-3">
                {category.name}
              </Badge>
            )}

            {selectedOrg.description && (
              <p className="text-sm text-card-foreground/70 mb-3">{selectedOrg.description}</p>
            )}

            {/* Contact Information */}
            <div className="flex flex-col gap-2 text-sm text-card-foreground/70 mb-3">
              {selectedOrg.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{selectedOrg.address}</span>
                </div>
              )}

              {selectedOrg.phone && (
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 shrink-0 mt-0.5" />
                  <a href={`tel:${selectedOrg.phone}`} className="hover:text-accent">
                    {selectedOrg.phone}
                  </a>
                </div>
              )}

              {selectedOrg.email && (
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 shrink-0 mt-0.5" />
                  <a href={`mailto:${selectedOrg.email}`} className="hover:text-accent break-all">
                    {selectedOrg.email}
                  </a>
                </div>
              )}

              {selectedOrg.website && (
                <div className="flex items-start gap-2">
                  <Globe className="h-4 w-4 shrink-0 mt-0.5" />
                  <a 
                    href={selectedOrg.website.startsWith('http') ? selectedOrg.website : `https://${selectedOrg.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-accent break-all"
                  >
                    {selectedOrg.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>

            {/* Special Attributes */}
            <div className="flex flex-wrap gap-1 mb-3">
              {selectedOrg.is_women_owned && (
                <Badge variant="outline" className="text-xs bg-white border-card-foreground/30 text-gray-700">
                  Women-Owned
                </Badge>
              )}
              {selectedOrg.is_poc_owned && (
                <Badge variant="outline" className="text-xs bg-white border-card-foreground/30 text-gray-700">
                  POC-Owned
                </Badge>
              )}
              {selectedOrg.is_lgbtqia_owned && (
                <Badge variant="outline" className="text-xs bg-white border-card-foreground/30 text-gray-700">
                  LGBTQIA+ Owned
                </Badge>
              )}
              {selectedOrg.is_accessible && (
                <Badge variant="outline" className="text-xs bg-white border-card-foreground/30 text-gray-700">
                  Accessible
                </Badge>
              )}
              {selectedOrg.is_youth_focused && (
                <Badge variant="outline" className="text-xs bg-white border-card-foreground/30 text-gray-700">
                  Youth-Focused
                </Badge>
              )}
            </div>

            <Button asChild className="w-full" size="sm">
              <Link href={`/organizations/${selectedOrg.id}`}>View Full Details</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg" style={{ zIndex: 999 }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  )
}