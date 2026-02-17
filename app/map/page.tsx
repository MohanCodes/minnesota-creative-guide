"use client"
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { Header } from "@/components/header"
import { SearchFilters } from "@/components/search-filters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { InteractiveMap } from "@/components/interactive-map"
import { Filter, Search } from "lucide-react"
import { getOrganizationsClient, getCategoriesClient } from "@/lib/supabase-utils"

export default function MapPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const debounceTimeoutRef = useRef<NodeJS.Timeout>()
  
  const [allOrganizations, setAllOrganizations] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedCounties, setSelectedCounties] = useState<string[]>([])
  const [selectedEditions, setSelectedEditions] = useState<string[]>([])
  const [filters, setFilters] = useState({
    womenOwned: false,
    pocOwned: false,
    lgbtqiaOwned: false,
    accessible: false,
    youthFocused: false,
  })

  // Debounce search query
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)
    
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [searchQuery])

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [orgResult, cats] = await Promise.all([
          getOrganizationsClient({ page: 1, pageSize: 1000 }),
          getCategoriesClient()
        ])
        setAllOrganizations(orgResult?.data ?? [])
        setCategories(cats)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [])

  // Generic array toggle handler to reduce code duplication
  const handleArrayToggle = useCallback((
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  }, []);

  // Handlers using the generic toggle
  const handleCategoryChange = useCallback((categoryName: string) => {
    handleArrayToggle(setSelectedCategories, categoryName);
  }, [handleArrayToggle]);

  const handleCountyChange = useCallback((county: string) => {
    handleArrayToggle(setSelectedCounties, county);
  }, [handleArrayToggle]);

  const handleEditionChange = useCallback((edition: string) => {
    handleArrayToggle(setSelectedEditions, edition);
  }, [handleArrayToggle]);

  const handleFilterChange = useCallback((filter: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [filter]: !prev[filter] }));
  }, []);

  const handleClearAll = useCallback(() => {
    setSelectedCategories([]);
    setSelectedCounties([]);
    setSelectedEditions([]);
    setFilters({
      womenOwned: false,
      pocOwned: false,
      lgbtqiaOwned: false,
      accessible: false,
      youthFocused: false,
    });
    setSearchQuery("");
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
  }, []);

  // Optimized filtering with early returns - matching browse page logic
  const filteredOrganizations = useMemo(() => {
    let filtered = allOrganizations;

    // Early return if no filters applied
    const hasFilters = 
      debouncedSearchQuery ||
      selectedCategories.length > 0 ||
      selectedEditions.length > 0 ||
      filters.womenOwned ||
      filters.pocOwned ||
      filters.lgbtqiaOwned ||
      filters.accessible ||
      filters.youthFocused;

    if (!hasFilters) {
      return filtered;
    }

    // Search filter - now includes service_area
    if (debouncedSearchQuery) {
      const q = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter((org) => {
        const name = (org.name as string | undefined)?.toLowerCase() || "";
        const description = (org.description as string | undefined)?.toLowerCase() || "";
        const serviceArea = (org.service_area as string | undefined)?.toLowerCase() || "";
        return name.includes(q) || description.includes(q) || serviceArea.includes(q);
      });
    }

    // Category filter - using description field like browse page
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((org) =>
        selectedCategories.includes(org.description as string)
      );
    }

    // Edition filter - now handles array field
    if (selectedEditions.length > 0) {
      filtered = filtered.filter((org) => {
        const orgEditions = org.edition as string[] | string | undefined;
        if (Array.isArray(orgEditions)) {
          // Check if any of the organization's editions match selected editions
          return selectedEditions.some(selectedEdition => 
            orgEditions.includes(selectedEdition)
          );
        } else if (typeof orgEditions === 'string') {
          // Handle string case for backward compatibility
          return selectedEditions.includes(orgEditions);
        }
        return false;
      });
    }

    // Special attributes filters
    if (filters.womenOwned) {
      filtered = filtered.filter((org) => org.women_owned === true);
    }
    if (filters.pocOwned) {
      filtered = filtered.filter((org) => org.poc_owned === true);
    }
    if (filters.lgbtqiaOwned) {
      filtered = filtered.filter((org) => org.lgbtqia_owned === true);
    }

    return filtered;
  }, [
    allOrganizations,
    debouncedSearchQuery,
    selectedCategories,
    selectedEditions,
    filters.womenOwned,
    filters.pocOwned,
    filters.lgbtqiaOwned,
    filters.accessible,
    filters.youthFocused,
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop Filters */}
        <aside className="hidden lg:block w-64 border-r overflow-y-auto z-10 relative bg-background">
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
              categories={categories}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
              selectedEditions={selectedEditions}
              onEditionChange={handleEditionChange}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAll}
            />
          </div>
        </aside>
        {/* Mobile Filters */}
        <div className="lg:hidden fixed bottom-4 right-4 z-100">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="lg" className="rounded-full shadow-lg bg-accent text-accent-foreground hover:bg-accent/90">
                <Filter className="mr-2 h-5 w-5" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto z-100">
              <VisuallyHidden>
                <SheetTitle>Filters</SheetTitle>
              </VisuallyHidden>
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
                  categories={categories}
                  selectedCategories={selectedCategories}
                  onCategoryChange={handleCategoryChange}
                  selectedEditions={selectedEditions}
                  onEditionChange={handleEditionChange}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearAll={handleClearAll}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        {/* Map View - Interactive Google Maps */}
        <div className="flex-1 overflow-hidden relative z-0">
          <div className="h-full p-4 relative z-0 flex flex-col">
            {/* Header - takes only the space it needs */}
            <div className="mb-4 relative z-10 bg-background flex-shrink-0">
              <h1 className="text-3xl font-bold">Map View</h1>
              <p className="text-muted-foreground mt-1">
                {filteredOrganizations.length} organization{filteredOrganizations.length !== 1 ? "s" : ""} found
              </p>
            </div>
            
            {/* Map container - grows to fill remaining space */}
            {isLoading ? (
              <div className="flex items-center justify-center flex-1">
                <p>Loading map data...</p>
              </div>
            ) : (
              <div className="relative z-0 flex-1 min-h-0">
                <InteractiveMap organizations={filteredOrganizations} categories={categories} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}