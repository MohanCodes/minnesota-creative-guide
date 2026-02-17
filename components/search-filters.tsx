"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import mockData from "@/data/mock-data.json";

type Filters = {
  womenOwned: boolean;
  pocOwned: boolean;
  accessible: boolean;
  youthFocused: boolean;
};

interface SearchFiltersProps {
  categories: Array<{ id: string; name: string; color_code: string }>;
  selectedCategories: string[];
  onCategoryChange: (categoryName: string) => void;
  filters: Filters;
  onFilterChange: (filter: keyof Filters) => void;
  onClearAll: () => void;
  selectedEditions: string[];
  onEditionChange: (edition: string) => void;
}

const HARD_CODED_CATEGORIES = [
  "Art Gallery & Creative Space",
  "Art Program/School",
  "Art Supply Store",
  "Community Theatre",
  "Dance School & Studio",
  "Makerspace",
  "Art Service Organization",
  "Pottery/Sewing Studio",
  "Recording Studio",
  "Regional Art Council",
  "University",
];

// Updated to match Supabase format
const EDITIONS = ["Northern", "Seven Metro", "Central", "Southern", "Statewide"];

export function SearchFilters({
  categories,
  selectedCategories,
  onCategoryChange,
  filters,
  onFilterChange,
  onClearAll,
  selectedEditions = [],
  onEditionChange,
}: SearchFiltersProps) {
  const activeFilterCount =
    (selectedCategories?.length ?? 0) +
    (selectedEditions?.length ?? 0) +
    Object.values(filters).filter(Boolean).length;

  const getCategoryColor = (name: string) =>
    categories.find((c) => c.name === name)?.color_code ?? "#e5e7eb";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-8 px-2"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
            <Badge variant="secondary" className="ml-2">
              {activeFilterCount}
            </Badge>
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Categories */}
        <div>
          <h3 className="font-medium mb-3">Categories</h3>
          <div className="space-y-2">
            {HARD_CODED_CATEGORIES.map((name) => {
              const id = `category-${name}`;
              const color = getCategoryColor(name);
              return (
                <div key={name} className="flex items-center space-x-2">
                  <Checkbox
                    id={id}
                    checked={selectedCategories.includes(name)}
                    onCheckedChange={() => onCategoryChange(name)}
                  />
                  <Label
                    htmlFor={id}
                    className="flex items-center gap-2 text-sm font-normal cursor-pointer"
                  >
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    {name}
                  </Label>
                </div>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Special Attributes */}
        <div>
          <h3 className="font-medium mb-3">Special Attributes</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="women-owned"
                checked={filters.womenOwned}
                onCheckedChange={() => onFilterChange("womenOwned")}
              />
              <Label
                htmlFor="women-owned"
                className="text-sm font-normal cursor-pointer"
              >
                Women-Owned
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="poc-owned"
                checked={filters.pocOwned}
                onCheckedChange={() => onFilterChange("pocOwned")}
              />
              <Label
                htmlFor="poc-owned"
                className="text-sm font-normal cursor-pointer"
              >
                POC-Owned
              </Label>
            </div>
          </div>
        </div>

        <Separator />

        {/* Edition */}
        <div>
          <h3 className="font-medium mb-3">Edition</h3>
          <div className="space-y-2">
            {EDITIONS.map((edition) => {
              const id = `edition-${edition}`;
              return (
                <div key={edition} className="flex items-center space-x-2">
                  <Checkbox
                    id={id}
                    checked={selectedEditions.includes(edition)}
                    onCheckedChange={() => onEditionChange(edition)}
                  />
                  <Label
                    htmlFor={id}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {edition}
                  </Label>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}