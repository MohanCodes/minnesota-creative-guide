"use client"

import { useEffect, useRef, useState } from "react"
import { X, MapPin, Phone, Mail, Globe, ExternalLink } from "lucide-react"
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

type CategoryWithColor = Omit<Category, 'color_code'> & { color: string }

interface InteractiveMapProps {
  organizations: Organization[]
  categories: (Category | CategoryWithColor)[]
}

declare global {
  interface Window { L: any }
}

const getCategoryColor = (cat: Category | CategoryWithColor | undefined) => {
  if (!cat) return "#8a5c8a"
  return 'color_code' in cat ? cat.color_code : cat.color
}

export function InteractiveMap({ organizations, categories }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.L) { setIsLoaded(true); return }

    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    link.crossOrigin = ""
    document.head.appendChild(link)

    const script = document.createElement("script")
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
    script.crossOrigin = ""
    script.onload = () => setIsLoaded(true)
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.L || mapInstanceRef.current) return

    const map = window.L.map(mapRef.current).setView([46.7296, -94.6859], 7)
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    mapInstanceRef.current = map
    return () => {
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null }
    }
  }, [isLoaded])

  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return

    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    if (!document.getElementById('custom-marker-styles')) {
      const style = document.createElement('style')
      style.id = 'custom-marker-styles'
      style.textContent = `.custom-marker { background: transparent !important; border: none !important; }`
      document.head.appendChild(style)
    }

    organizations.forEach((org) => {
      if (!org.latitude || !org.longitude) return
      const category = categories.find((c) => c.name === org.description)
      const color = getCategoryColor(category)

      const icon = window.L.divIcon({
        className: "custom-marker",
        html: `<div style="width:14px;height:14px;background:${color};border:2.5px solid white;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.25);cursor:pointer;"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      })

      const marker = window.L.marker([org.latitude, org.longitude], { icon, title: org.resource }).addTo(mapInstanceRef.current)
      markersRef.current.push(marker)
      marker.on("click", () => {
        setSelectedOrg(org)
        const zoom = mapInstanceRef.current.getZoom()
        mapInstanceRef.current.setView([org.latitude, org.longitude], Math.max(zoom, 10), { animate: true })
      })
    })
  }, [isLoaded, organizations, categories])

  const selectedCategory = selectedOrg ? categories.find((c) => c.name === selectedOrg.description) : null
  const selectedColor = getCategoryColor(selectedCategory ?? undefined)

  const ownershipTags = selectedOrg ? [
    selectedOrg.is_women_owned && "Women-Owned",
    selectedOrg.is_poc_owned && "POC-Owned",
    selectedOrg.is_lgbtqia_owned && "LGBTQIA+-Owned",
    selectedOrg.is_accessible && "Accessible",
    selectedOrg.is_youth_focused && "Youth-Focused",
  ].filter(Boolean) as string[] : []

  return (
    <div className="relative w-full h-full">
      {/* Map */}
      <div ref={mapRef} className="w-full h-3/4 min-h-[600px] rounded-2xl overflow-hidden border border-stone-200" style={{ zIndex: 0 }} />

      {/* Selected org panel */}
      {selectedOrg && (
        <div
          className="absolute top-4 right-4 w-80 max-w-[calc(100%-2rem)] bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden max-h-[calc(100%-2rem)] flex flex-col [&_*]:not-italic [&_a]:no-underline"
          style={{ zIndex: 1000 }}
        >
          {/* Tinted header */}
          <div
            className="px-5 pt-5 pb-4"
            style={{ background: `linear-gradient(135deg, ${selectedColor}18 0%, ${selectedColor}08 100%)` }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                {selectedCategory && (
                  <div className="mb-2">
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider text-stone-900"
                      style={{ backgroundColor: selectedColor }}
                    >
                      {selectedCategory.name}
                    </span>
                  </div>
                )}
                <h3 className="font-semibold text-stone-900 leading-snug text-base">
                  {selectedOrg.name || selectedOrg.resource}
                </h3>
                {(selectedOrg.city || selectedOrg.county) && (
                  <div className="flex items-center gap-1 mt-1 text-stone-500 text-xs">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span>
                      {selectedOrg.city && `${selectedOrg.city}, `}{selectedOrg.county && `${selectedOrg.county} County`}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setSelectedOrg(null)}
                className="shrink-0 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Contact info */}
          <div className="px-5 py-4 space-y-2.5 overflow-y-auto">
            {selectedOrg.address && (
              <ContactRow icon={<MapPin className="h-3.5 w-3.5" />}>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedOrg.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-stone-600 hover:text-stone-900 transition-colors inline-flex items-center gap-1 group"
                >
                  <span>{selectedOrg.address}</span>
                  <ExternalLink className="h-2.5 w-2.5 shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </ContactRow>
            )}
            {selectedOrg.phone && (
              <ContactRow icon={<Phone className="h-3.5 w-3.5" />}>
                <a href={`tel:${selectedOrg.phone}`} className="text-xs text-stone-600 hover:text-stone-900 transition-colors">
                  {selectedOrg.phone}
                </a>
              </ContactRow>
            )}
            {selectedOrg.email && (
              <ContactRow icon={<Mail className="h-3.5 w-3.5" />}>
                <a href={`mailto:${selectedOrg.email}`} className="text-xs text-stone-600 hover:text-stone-900 transition-colors break-all">
                  {selectedOrg.email}
                </a>
              </ContactRow>
            )}
            {selectedOrg.website && (
              <ContactRow icon={<Globe className="h-3.5 w-3.5" />}>
                <a
                  href={selectedOrg.website.startsWith('http') ? selectedOrg.website : `https://${selectedOrg.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-stone-600 hover:text-stone-900 transition-colors inline-flex items-center gap-1"
                >
                  {selectedOrg.website.replace(/^https?:\/\//, '')}
                  <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                </a>
              </ContactRow>
            )}

            {ownershipTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {ownershipTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-stone-200 text-stone-500 bg-stone-50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Footer CTA */}
          <div className="px-5 py-4 bg-stone-50 border-t border-stone-100">
            <Link
              href={`/organizations/${selectedOrg.id}`}
              className="flex items-center justify-center w-full h-9 rounded-full bg-[#8a5c8a] hover:bg-[#7a4c7a] text-white text-xs font-medium transition-colors"
            >
              View Full Details
            </Link>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#FAFAF8]/80 rounded-2xl" style={{ zIndex: 999 }}>
          <div className="text-center">
            <div className="h-8 w-8 rounded-full border-2 border-stone-200 border-t-[#8a5c8a] animate-spin mx-auto mb-3" />
            <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold">Loading map…</p>
          </div>
        </div>
      )}
    </div>
  )
}

function ContactRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-stone-400 shrink-0 mt-0.5">{icon}</span>
      <div className="min-w-0">{children}</div>
    </div>
  )
}