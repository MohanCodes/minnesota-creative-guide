"use client"

import type React from "react"

import { Header } from "@/components/header"
import { OrganizationCard } from "@/components/organization-card"
import { SearchFilters } from "@/components/search-filters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Filter, Search } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react"
import mockData from "@/data/mock-data.json"

export default function BrowsePage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [organizations, setOrganizations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedCounties, setSelectedCounties] = useState<string[]>([])
  const [filters, setFilters] = useState({
    womenOwned: false,
    pocOwned: false,
    accessible: false,
    youthFocused: false,
  })

  useEffect(() => {
    fetchOrganizations()
  }, [searchQuery, selectedCategories, selectedCounties, filters])

  const fetchOrganizations = () => {
    setIsLoading(true)

    let filtered = mockData.organizations

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (org) =>
          org.name.toLowerCase().includes(query) || (org.description && org.description.toLowerCase().includes(query)),
      )
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((org) => selectedCategories.includes(org.category))
    }

    // County filter
    if (selectedCounties.length > 0) {
      filtered = filtered.filter((org) => selectedCounties.includes(org.county))
    }

    // Special attribute filters
    if (filters.womenOwned) filtered = filtered.filter((org) => org.is_women_owned)
    if (filters.pocOwned) filtered = filtered.filter((org) => org.is_poc_owned)
    if (filters.accessible) filtered = filtered.filter((org) => org.is_accessible)
    if (filters.youthFocused) filtered = filtered.filter((org) => org.is_youth_focused)

    setOrganizations(filtered)
    setIsLoading(false)
  }

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
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchOrganizations()
  }

  const getCategoryColor = (categoryName: string) => {
    const category = mockData.categories.find((c) => c.name === categoryName)
    return category?.color_code
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container py-8">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </form>

        <div className="flex gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
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
          <div className="lg:hidden fixed bottom-4 right-4 z-[200]">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="lg" className="rounded-full shadow-lg bg-accent text-accent-foreground hover:bg-accent/90">
                  <Filter className="mr-2 h-5 w-5" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto z-[300] p-6">
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
              </SheetContent>
            </Sheet>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {isLoading ? "Loading..." : `${organizations.length} Resources Found`}
              </h2>
            </div>

            {isLoading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-video w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : organizations.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No organizations found matching your criteria</p>
                <Button variant="outline" onClick={handleClearAll}>
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {organizations.map((org) => (
                  <OrganizationCard key={org.id} organization={org} categoryColor={getCategoryColor(org.category)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
