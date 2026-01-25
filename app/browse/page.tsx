"use client";

import type React from "react";

import { Header } from "@/components/header";
import { OrganizationCard } from "@/components/organization-card";
import { SearchFilters } from "@/components/search-filters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Filter, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useCallback } from "react";
import {
  getOrganizationsClient,
  getCategoriesClient,
  PaginatedResult,
} from "@/lib/supabase-utils";
import Masonry from "react-masonry-css";

// Row type from Supabase
type SupabaseOrganization = PaginatedResult<any>["data"][number];

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function BrowsePage() {
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  const [allOrganizations, setAllOrganizations] = useState<
    SupabaseOrganization[]
  >([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCounties, setSelectedCounties] = useState<string[]>([]);
  const [selectedEditions, setSelectedEditions] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    womenOwned: false,
    pocOwned: false,
    accessible: false,
    youthFocused: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  // Fetch base data once
  const fetchOrganizations = async () => {
    try {
      setIsLoading(true);
      const result = await getOrganizationsClient({
        page: 1,
        pageSize: 1000,
      });

      setAllOrganizations(result.data as SupabaseOrganization[]);
      setCurrentPage(1);
      setPageInput("1");
    } catch (error) {
      console.error("Error loading organizations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const cats = await getCategoriesClient();
      setCategories(cats || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  useEffect(() => {
    fetchOrganizations();
    fetchCategories();
  }, []);

  // Optimized filtering with early returns
  const filteredOrganizations = useMemo(() => {
    let filtered = allOrganizations;

    // Early return if no filters applied
    const hasFilters = 
      debouncedSearchQuery ||
      selectedCategories.length > 0 ||
      selectedEditions.length > 0 ||
      filters.womenOwned ||
      filters.pocOwned ||
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

    // Category filter
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

    return filtered;
  }, [
    allOrganizations,
    debouncedSearchQuery,
    selectedCategories,
    selectedEditions,
    filters.womenOwned,
    filters.pocOwned,
    filters.accessible,
    filters.youthFocused,
  ]);

  // Pagination derived from filtered list
  const total = filteredOrganizations.length;
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

  // Clamp current page if filters reduce the total
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
      setPageInput(String(totalPages));
    }
  }, [currentPage, totalPages]);

  // Optimized pagination - only slice when dependencies change
  const pageItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrganizations.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrganizations, currentPage, itemsPerPage]);

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

  const handleEditionChange = useCallback((edition: string) => {
    handleArrayToggle(setSelectedEditions, edition);
  }, [handleArrayToggle]);

  const handleFilterChange = useCallback((filter: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [filter]: !prev[filter] }));
  }, []);

  const handleClearAll = useCallback(() => {
    setSelectedCategories([]);
    setSelectedEditions([]);
    setFilters({
      womenOwned: false,
      pocOwned: false,
      accessible: false,
      youthFocused: false,
    });
    setSearchQuery("");
    setCurrentPage(1);
    setPageInput("1");
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setPageInput("1");
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setPageInput(String(newPage));
    }
  }, [totalPages]);

  const handlePageInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setPageInput(value);
    }
  }, []);

  const handlePageInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    let page = parseInt(e.target.value, 10);
    if (isNaN(page) || page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setPageInput(page.toString());
    if (page !== currentPage) {
      handlePageChange(page);
    }
  }, [totalPages, currentPage, handlePageChange]);

  const handlePageInputKeyDown = useCallback((
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  }, []);

  const handleItemsPerPageChange = useCallback((
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    setPageInput("1");
  }, []);

  const paginationControls = (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Items per page:</span>
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="40">40</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1 text-sm">
          <span>Page</span>
          <input
            type="text"
            value={pageInput}
            onChange={handlePageInputChange}
            onBlur={handlePageInputBlur}
            onKeyDown={handlePageInputKeyDown}
            className="w-10 text-center border rounded h-8"
          />
          <span>of {totalPages}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">{total} total items</div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container max-w-7xl mx-auto py-8 px-8">
        <div className="flex gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <SearchFilters
                categories={categories}
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearAll={handleClearAll}
                selectedEditions={selectedEditions}
                onEditionChange={handleEditionChange}
              />
            </div>
          </aside>

          {/* Mobile Filters */}
          <div className="lg:hidden fixed bottom-4 right-4 z-200">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  size="lg"
                  className="rounded-full shadow-lg bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <Filter className="mr-2 h-5 w-5" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-80 overflow-y-auto z-300 p-6"
              >
                <SearchFilters
                  categories={categories}
                  selectedCategories={selectedCategories}
                  onCategoryChange={handleCategoryChange}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearAll={handleClearAll}
                  selectedEditions={selectedEditions}
                  onEditionChange={handleEditionChange}
                />
              </SheetContent>
            </Sheet>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <form onSubmit={handleSearch} className="w-full md:max-w-xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search organizations, locations, or categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 w-full"
                  />
                </div>
              </form>

              <h2 className="text-xl font-semibold md:text-2xl">
                {isLoading ? "Loading..." : `${total} Resources Found`}
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
            ) : pageItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No organizations found matching your criteria
                </p>
                <Button variant="outline" onClick={handleClearAll}>
                  Clear filters
                </Button>
              </div>
            ) : (
              <>
                <Masonry
                  breakpointCols={breakpointColumnsObj}
                  className="flex w-auto -ml-4"
                  columnClassName="pl-4 bg-clip-padding"
                >
                  {pageItems.map((org) => (
                    <div key={org.id} className="mb-4">
                      <OrganizationCard organization={org} />
                    </div>
                  ))}
                </Masonry>

                {total > 0 && paginationControls}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}