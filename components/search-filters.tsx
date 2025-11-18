"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { X } from "lucide-react"
import mockData from "@/data/mock-data.json"

type Filters = {
  womenOwned: boolean
  pocOwned: boolean
  accessible: boolean
  youthFocused: boolean
}

interface SearchFiltersProps {
  categories: Array<{ id: string; name: string; color_code: string }>
  selectedCategories: string[]
  onCategoryChange: (categoryName: string) => void
  selectedCounties: string[]
  onCountyChange: (county: string) => void
  filters: Filters
  onFilterChange: (filter: keyof Filters) => void
  onClearAll: () => void
}

export function SearchFilters({
  categories,
  selectedCategories,
  onCategoryChange,
  selectedCounties,
  onCountyChange,
  filters,
  onFilterChange,
  onClearAll,
}: SearchFiltersProps) {
  const activeFilterCount =
    selectedCategories.length + selectedCounties.length + Object.values(filters).filter(Boolean).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearAll} className="h-8 px-2">
            <X className="h-4 w-4 mr-1" />
            Clear all
            <Badge variant="secondary" className="ml-2">
              {activeFilterCount}
            </Badge>
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-3">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.name)}
                  onCheckedChange={() => onCategoryChange(category.name)}
                />
                <Label
                  htmlFor={`category-${category.id}`}
                  className="flex items-center gap-2 text-sm font-normal cursor-pointer"
                >
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color_code }} />
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-medium mb-3">Special Attributes</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="women-owned"
                checked={filters.womenOwned}
                onCheckedChange={() => onFilterChange("womenOwned")}
              />
              <Label htmlFor="women-owned" className="text-sm font-normal cursor-pointer">
                Women-Owned
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="poc-owned" checked={filters.pocOwned} onCheckedChange={() => onFilterChange("pocOwned")} />
              <Label htmlFor="poc-owned" className="text-sm font-normal cursor-pointer">
                POC-Owned
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="accessible"
                checked={filters.accessible}
                onCheckedChange={() => onFilterChange("accessible")}
              />
              <Label htmlFor="accessible" className="text-sm font-normal cursor-pointer">
                Accessible
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="youth-focused"
                checked={filters.youthFocused}
                onCheckedChange={() => onFilterChange("youthFocused")}
              />
              <Label htmlFor="youth-focused" className="text-sm font-normal cursor-pointer">
                Youth-Focused
              </Label>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-medium mb-3">County</h3>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2">
              {mockData.counties.map((county) => (
                <div key={county} className="flex items-center space-x-2">
                  <Checkbox
                    id={`county-${county}`}
                    checked={selectedCounties.includes(county)}
                    onCheckedChange={() => onCountyChange(county)}
                  />
                  <Label htmlFor={`county-${county}`} className="text-sm font-normal cursor-pointer">
                    {county}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
