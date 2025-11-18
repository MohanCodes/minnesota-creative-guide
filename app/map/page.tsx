"use client"

import type React from "react"

import { Header } from "@/components/header"
import { SearchFilters } from "@/components/search-filters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { InteractiveMap } from "@/components/interactive-map"
import { Filter, Search } from "lucide-react"
import { useState, useMemo } from "react"
import mockData from "@/data/mock-data.json"

export default function MapPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedCounties, setSelectedCounties] = useState<string[]>([])
  const [filters, setFilters] = useState({
    womenOwned: false,
    pocOwned: false,
    accessible: false,
    youthFocused: false,
  })

  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName) ? prev.filter((name) => name !== categoryName) : [...prev, categoryName],
    )
  }

  const handleCountyChange = (county: string) => {
    setSelectedCounties((prev) => (prev.includes(county) ? prev.filter((c) => c !== county) : [...prev, county]))
  }

  const handleFilterChange = (filter: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [filter]: !prev[filter] }))
  }

  const handleClearAll = () => {
    setSelectedCategories([])
    setSelectedCounties([])
    setFilters({
      womenOwned: false,
      pocOwned: false,
      accessible: false,
      youthFocused: false,
    })
    setSearchQuery("")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  // Filter organizations
  const filteredOrganizations = useMemo(() => {
    return mockData.organizations.filter((org) => {
      // Search query
      if (searchQuery && !org.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(org.category)) {
        return false
      }

      // County filter
      if (selectedCounties.length > 0 && !selectedCounties.includes(org.county)) {
        return false
      }

      // Special filters
      if (filters.womenOwned && !org.isWomenOwned) return false
      if (filters.pocOwned && !org.isPocOwned) return false
      if (filters.accessible && !org.isAccessible) return false
      if (filters.youthFocused && !org.isYouthFocused) return false

      return true
    })
  }, [searchQuery, selectedCategories, selectedCounties, filters])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Filters */}
        <aside className="hidden lg:block w-64 border-r overflow-y-auto">
          <div className="p-4 space-y-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </form>

            <SearchFilters
              categories={mockData.categories}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
              selectedCounties={selectedCounties}
              onCountyChange={handleCountyChange}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAll}
            />
          </div>
        </aside>

        {/* Mobile Filters */}
        <div className="lg:hidden fixed bottom-4 right-4 z-50">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="lg" className="rounded-full shadow-lg">
                <Filter className="mr-2 h-5 w-5" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <div className="space-y-4 mt-6">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </form>

                <SearchFilters
                  categories={mockData.categories}
                  selectedCategories={selectedCategories}
                  onCategoryChange={handleCategoryChange}
                  selectedCounties={selectedCounties}
                  onCountyChange={handleCountyChange}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearAll={handleClearAll}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Map View - Interactive Google Maps */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full p-4">
            <div className="mb-4">
              <h1 className="text-3xl font-bold">Map View</h1>
              <p className="text-muted-foreground mt-1">
                {filteredOrganizations.length} organization{filteredOrganizations.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <InteractiveMap organizations={filteredOrganizations} categories={mockData.categories} />
          </div>
        </div>
      </div>
    </div>
  )
}
