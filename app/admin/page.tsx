"use client";

import { useState, useEffect } from "react";
import { getOrganizationsClient } from "@/lib/supabase-utils";
import { createClient } from "@/utils/supabase/client";
import AdminLogoutButton from "./logout-button";
import Link from "next/link";
import { Edit, Trash2, MapPin, ExternalLink } from "lucide-react";

const categoryNames = [
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

interface Organization {
  id: string;
  resource: string;
  description: string | null;
  service_area: string | null;
  website: string | null;
  number: string | null;
  email: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  upcoming_events: string | null;
  opportunities: string | null;
  how_to_support: string | null;
  women_owned: boolean;
  poc_owned: boolean;
  comments: string | null;
  edition: string[] | null;
  categories: string[] | null;
}

export default function AdminPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Organization>("resource");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterServiceArea, setFilterServiceArea] = useState<string>("");
  const [filterWomenOwned, setFilterWomenOwned] = useState<string>("");
  const [filterPocOwned, setFilterPocOwned] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const result = await getOrganizationsClient({ page: 1, pageSize: 1000 });
      setOrganizations(result.data);
    } catch (error) {
      console.error("Error loading organizations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this organization?")) return;
    
    try {
      setDeletingId(id);
      const supabase = createClient();
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await loadOrganizations();
    } catch (error) {
      console.error("Error deleting organization:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSort = (field: keyof Organization) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const getUniqueValues = (field: keyof Organization) => {
    const values = organizations.map(org => org[field]).filter(Boolean) as string[];
    return [...new Set(values)].sort();
  };

  const filteredAndSortedOrganizations = organizations
    .filter(org => {
      const matchesSearch = searchTerm === "" || 
        org.resource?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.service_area?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filterCategory === "" || org.description === filterCategory;
      const matchesServiceArea = filterServiceArea === "" || org.service_area === filterServiceArea;
      const matchesWomenOwned = filterWomenOwned === "" || 
        (filterWomenOwned === "yes" && org.women_owned) ||
        (filterWomenOwned === "no" && !org.women_owned);
      const matchesPocOwned = filterPocOwned === "" || 
        (filterPocOwned === "yes" && org.poc_owned) ||
        (filterPocOwned === "no" && !org.poc_owned);

      return matchesSearch && matchesCategory && matchesServiceArea && matchesWomenOwned && matchesPocOwned;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return sortDirection === "asc" ? 1 : -1;
      if (bValue === null) return sortDirection === "asc" ? -1 : 1;
      
      // Special handling for ID field - treat as integer
      if (sortField === 'id') {
        const aId = parseInt(String(aValue).replace(/[^0-9]/g, ''), 10) || 0;
        const bId = parseInt(String(bValue).replace(/[^0-9]/g, ''), 10) || 0;
        return sortDirection === "asc" ? aId - bId : bId - aId;
      }
      
      // Special handling for service_area - treat empty strings as null
      if (sortField === 'service_area') {
        const aService = String(aValue).trim() === '' ? null : String(aValue);
        const bService = String(bValue).trim() === '' ? null : String(bValue);
        
        if (aService === null && bService === null) return 0;
        if (aService === null) return sortDirection === "asc" ? 1 : -1;
        if (bService === null) return sortDirection === "asc" ? -1 : 1;
        
        const comparison = aService.localeCompare(bService);
        return sortDirection === "asc" ? comparison : -comparison;
      }
      
      const comparison = String(aValue).localeCompare(String(bValue));
      return sortDirection === "asc" ? comparison : -comparison;
    });

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedOrganizations.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedOrganizations = filteredAndSortedOrganizations.slice(startIndex, endIndex);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory, filterServiceArea, filterWomenOwned, filterPocOwned]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center">
          <div className="text-lg">Loading organizations...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Portal</h1>
        <div className="flex gap-2">
          <Link
            href="/"
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            ← Back to Site
          </Link>
          <Link
            href="/admin/add"
            className="px-4 py-2 bg-foreground rounded-lg hover:bg-foreground/80 text-white"
          >
            Add Organization
          </Link>
          <AdminLogoutButton />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border mb-6">
        <div className="p-4 border-b">
          <div className="space-y-4">
            {/* Search */}
            <div>
              <input
                type="text"
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {categoryNames.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Service Area</label>
                <select
                  value={filterServiceArea}
                  onChange={(e) => setFilterServiceArea(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Service Areas</option>
                  {getUniqueValues('service_area').map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Women Owned</label>
                <select
                  value={filterWomenOwned}
                  onChange={(e) => setFilterWomenOwned(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">POC Owned</label>
                <select
                  value={filterPocOwned}
                  onChange={(e) => setFilterPocOwned(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
            
            {/* Clear Filters */}
            {(searchTerm || filterCategory || filterServiceArea || filterWomenOwned || filterPocOwned) && (
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterCategory("");
                    setFilterServiceArea("");
                    setFilterWomenOwned("");
                    setFilterPocOwned("");
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" 
                  style={{width: '10%'}}
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center">
                    ID
                    {sortField === 'id' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" 
                  style={{width: '25%'}}
                  onClick={() => handleSort('resource')}
                >
                  <div className="flex items-center">
                    Organization
                    {sortField === 'resource' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" 
                  style={{width: '18%'}}
                  onClick={() => handleSort('description')}
                >
                  <div className="flex items-center">
                    Category
                    {sortField === 'description' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" 
                  style={{width: '15%'}}
                  onClick={() => handleSort('service_area')}
                >
                  <div className="flex items-center">
                    Service Area
                    {sortField === 'service_area' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" 
                  style={{width: '10%'}}
                  onClick={() => handleSort('website')}
                >
                  <div className="flex items-center">
                    Website
                    {sortField === 'website' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" 
                  style={{width: '22%'}}
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center">
                    Email
                    {sortField === 'email' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" 
                  style={{width: '6%'}}
                  onClick={() => handleSort('women_owned')}
                >
                  <div className="flex items-center justify-center">
                    Women Owned
                    {sortField === 'women_owned' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" 
                  style={{width: '6%'}}
                  onClick={() => handleSort('poc_owned')}
                >
                  <div className="flex items-center justify-center">
                    POC Owned
                    {sortField === 'poc_owned' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '130px'}}>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedOrganizations.map((org) => (
                <tr key={org.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="text-sm font-mono text-gray-600 truncate" title={org.id}>{org.id}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 truncate" title={org.resource || undefined}>{org.resource}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-500 truncate" title={org.description || undefined}>{org.description}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-500 truncate" title={org.service_area || undefined}>{org.service_area}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {org.website && (
                        <a
                          href={org.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 inline-flex items-center justify-center"
                          title="Visit Website"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {org.address && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(org.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-green-600 text-white rounded hover:bg-green-700 inline-flex items-center justify-center"
                          title="View on Map"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {!org.website && !org.address && (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${org.email}`} className="text-foreground hover:text-foreground-700 text-sm truncate block" title={org.email || undefined}>
                      {org.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 text-xs rounded-full inline-block ${org.women_owned ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                      {org.women_owned ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 text-xs rounded-full inline-block ${org.poc_owned ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                      {org.poc_owned ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex gap-2 justify-center whitespace-nowrap">
                      <Link
                        href={`/admin/edit/${org.id}`}
                        className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-flex items-center justify-center"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(org.id)}
                        disabled={deletingId === org.id}
                        className="p-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 inline-flex items-center justify-center"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            {/* Page Size Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Show</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1); // Reset to first page when changing page size
                }}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={100}>100</option>
                <option value={500}>500</option>
                <option value={1000}>1000</option>
              </select>
              <span className="text-sm text-gray-600">per page</span>
            </div>

            {/* Page Info */}
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedOrganizations.length)} of {filteredAndSortedOrganizations.length} organizations
            </div>

            {/* Page Navigation */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 border rounded text-sm ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
