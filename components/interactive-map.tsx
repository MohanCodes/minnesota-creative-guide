"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Link from "next/link"

interface Organization {
  id: string
  name: string
  description: string
  address: string
  city: string
  county: string
  latitude: number
  longitude: number
  category: string
  phone?: string
  email?: string
  website?: string
  isWomenOwned: boolean
  isPocOwned: boolean
  isAccessible: boolean
  isYouthFocused: boolean
}

interface Category {
  name: string
  color: string
}

interface InteractiveMapProps {
  organizations: Organization[]
  categories: Category[]
}

declare global {
  interface Window {
    L: any
  }
}

export function InteractiveMap({ organizations, categories }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

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

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.L || mapInstanceRef.current) return

    const minnesotaCenter: [number, number] = [46.7296, -94.6859]

    const map = window.L.map(mapRef.current).setView(minnesotaCenter, 7)

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    mapInstanceRef.current = map

    organizations.forEach((org) => {
      if (org.latitude && org.longitude) {
        const category = categories.find((c) => c.name === org.category)
        const color = category?.color || "#8b5cf6"

        // Create custom colored marker icon
        const customIcon = window.L.divIcon({
          className: "custom-marker",
          html: `
            <div style="
              width: 24px;
              height: 24px;
              background-color: ${color};
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              cursor: pointer;
            "></div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        })

        const marker = window.L.marker([org.latitude, org.longitude], {
          icon: customIcon,
          title: org.name,
        }).addTo(map)

        // Add click listener to show organization details
        marker.on("click", () => {
          setSelectedOrg(org)
          map.setView([org.latitude, org.longitude], 10, { animate: true })
        })
      }
    })

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [isLoaded, organizations, categories])

  const category = selectedOrg ? categories.find((c) => c.name === selectedOrg.category) : null

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full min-h-[600px] rounded-lg" />

      {/* Selected Organization Card */}
      {selectedOrg && (
        <Card className="absolute top-4 left-4 w-80 max-w-[calc(100%-2rem)] shadow-lg z-10">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-lg line-clamp-2">{selectedOrg.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedOrg.city}, {selectedOrg.county} County
                </p>
              </div>
              <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8" onClick={() => setSelectedOrg(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {category && (
              <Badge style={{ backgroundColor: category.color }} className="text-white mb-3">
                {category.name}
              </Badge>
            )}

            <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{selectedOrg.description}</p>

            <div className="flex flex-wrap gap-1 mb-3">
              {selectedOrg.isWomenOwned && (
                <Badge variant="outline" className="text-xs">
                  Women-Owned
                </Badge>
              )}
              {selectedOrg.isPocOwned && (
                <Badge variant="outline" className="text-xs">
                  POC-Owned
                </Badge>
              )}
              {selectedOrg.isAccessible && (
                <Badge variant="outline" className="text-xs">
                  Accessible
                </Badge>
              )}
              {selectedOrg.isYouthFocused && (
                <Badge variant="outline" className="text-xs">
                  Youth-Focused
                </Badge>
              )}
            </div>

            <Button asChild className="w-full" size="sm">
              <Link href={`/organizations/${selectedOrg.id}`}>View Details</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  )
}
