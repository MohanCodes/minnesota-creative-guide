"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type Filters = {
  womenOwned: boolean;
  pocOwned: boolean;
  lgbtqiaOwned: boolean;
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

const EDITIONS = ["Northern", "Seven Metro", "Central", "Southern", "Statewide"];

const SPECIAL_ATTRIBUTES: { key: keyof Filters; label: string }[] = [
  { key: "womenOwned", label: "Women-Owned" },
  { key: "pocOwned", label: "POC-Owned" },
  { key: "lgbtqiaOwned", label: "LGBTQIA+-Owned" },
];

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
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Filters</p>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearAll}
            className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="h-3 w-3" />
            Clear
            <span
              className="inline-flex items-center justify-center h-4 w-4 rounded-full text-white text-[10px] font-bold"
              style={{ backgroundColor: "#8a5c8a" }}
            >
              {activeFilterCount}
            </span>
          </button>
        )}
      </div>

      {/* Categories */}
      <FilterSection label="Categories">
        <div className="space-y-0.5">
          {HARD_CODED_CATEGORIES.map((name) => {
            const color = getCategoryColor(name);
            const checked = selectedCategories.includes(name);
            return (
              <FilterPill
                key={name}
                label={name}
                checked={checked}
                onChange={() => onCategoryChange(name)}
                dot={color}
              />
            );
          })}
        </div>
      </FilterSection>

      <Divider />

      {/* Special Attributes */}
      <FilterSection label="Special Attributes">
        <div className="flex flex-wrap gap-2">
          {SPECIAL_ATTRIBUTES.map(({ key, label }) => (
            <ToggleChip
              key={key}
              label={label}
              checked={filters[key]}
              onChange={() => onFilterChange(key)}
            />
          ))}
        </div>
      </FilterSection>

      <Divider />

      {/* Edition */}
      <FilterSection label="Edition">
        <div className="flex flex-wrap gap-2">
          {EDITIONS.map((edition) => (
            <ToggleChip
              key={edition}
              label={edition}
              checked={selectedEditions.includes(edition)}
              onChange={() => onEditionChange(edition)}
            />
          ))}
        </div>
      </FilterSection>

    </div>
  );
}

/* ─── Helpers ──────────────────────────────────────────────────────── */

function FilterSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">{label}</p>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-stone-100" />;
}

function FilterPill({
  label,
  checked,
  onChange,
  dot,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  dot?: string;
}) {
  return (
    <button
      onClick={onChange}
      className={`
        w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left text-sm transition-all
        ${checked
          ? "bg-[#8a5c8a14] text-[#8a5c8a] font-medium ring-1 ring-[#8a5c8a40]"
          : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
        }
      `}
    >
      {dot && (
        <span
          className="h-2.5 w-2.5 rounded-full shrink-0"
          style={{ backgroundColor: dot }}
        />
      )}
      <span className="leading-snug">{label}</span>
      {checked && (
        <span className="ml-auto shrink-0">
          <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="7" fill="#8a5c8a" />
            <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </button>
  );
}

function ToggleChip({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`
        inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all border
        ${checked
          ? "border-[#8a5c8a] text-[#8a5c8a] bg-[#8a5c8a10]"
          : "border-stone-200 text-stone-500 hover:border-stone-400 hover:text-stone-700 bg-white"
        }
      `}
    >
      {label}
    </button>
  );
}