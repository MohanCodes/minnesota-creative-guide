// lib/supabase-utils.ts

// For client components (browser)
import { createClient as createBrowserClient } from '@/utils/supabase/client';

// For server components / server code
import { createServerSupabaseClient } from '@/utils/supabase/server';

// Response type for API calls
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  status?: number;
}

export interface PaginationParams {
  page?: number;      // Page number (1-based)
  pageSize?: number;  // Items per page
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;      // Total number of items
  page: number;       // Current page
  pageSize: number;   // Items per page
  totalPages: number; // Total number of pages
}

// For client components
export function getSupabaseClient() {
  return createBrowserClient();
}

// For server components
export async function getSupabaseServerClient() {
  return await createServerSupabaseClient();
}

/* -------------------- Server-side functions -------------------- */

export async function getOrganizations(
  { page = 1, pageSize = 10 }: PaginationParams = {}
): Promise<PaginatedResult<any>> {
  const supabase = await getSupabaseServerClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // First, get the total count
  const { count } = await supabase
    .from('resources')
    .select('*', { count: 'exact', head: true });

  // Then get the paginated data
  const { data: organizations, error } = await supabase
    .from('resources')
    .select('*')
    .order('resource')
    .range(from, to);

  if (error) {
    console.error('Error fetching organizations:', error);
    return {
      data: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0
    };
  }

  const totalPages = Math.ceil((count || 0) / pageSize);

  return {
    data: organizations || [],
    total: count || 0,
    page,
    pageSize,
    totalPages
  };
}

export async function getOrganizationById(id: string) {
  const supabase = await getSupabaseServerClient();
  const { data: organization, error } = await supabase
    .from('resources')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching organization ${id}:`, error);
    return null;
  }

  return organization;
}

export async function getCategories() {
  const supabase = await getSupabaseServerClient();
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return categories || [];
}

/* -------------------- Client-side versions -------------------- */

// In supabase-utils.ts
export async function getOrganizationsClient(
  { page = 1, pageSize = 10 }: PaginationParams = {}
): Promise<PaginatedResult<any>> {
  try {
    const supabase = getSupabaseClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // First, get the total count
    const { count } = await supabase
      .from('resources')
      .select('*', { count: 'exact', head: true });

    // Then get the paginated data
    const { data: organizations, error } = await supabase
      .from('resources')
      .select('*')
      .order('resource')
      .range(from, to);

    if (error) {
      console.error('Error fetching organizations (client):', error);
      return {
        data: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0
      };
    }

    const totalPages = Math.ceil((count || 0) / pageSize);

    return {
      data: organizations || [],
      total: count || 0,
      page,
      pageSize,
      totalPages
    };
  } catch (error) {
    console.error('Unexpected error in getOrganizationsClient:', error);
    return {
      data: [],
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0
    };
  }
}

export async function getOrganizationByIdClient(id: string) {
  try {
    const supabase = getSupabaseClient();
    
    // Fetch the resource
    const { data: organization, error } = await supabase
      .from('resources')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching organization ${id} (client):`, error);
      if (error.code === '42501') {
        console.error('RLS Policy Violation: Make sure your RLS policies are correctly set up in Supabase');
      }
      return null;
    }

    return organization;
  } catch (error) {
    console.error(`Unexpected error in getOrganizationByIdClient for id ${id}:`, error);
    return null;
  }
}

import mockData from '@/data/mock-data.json';

export async function getCategoriesClient() {
  try {
    const supabase = getSupabaseClient();
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.warn('Supabase categories fetch failed, falling back to mock data:', error.message || error);
      return (mockData as any).categories ?? [];
    }

    if (!categories || categories.length === 0) {
      // If the table is empty, also fall back.
      return (mockData as any).categories ?? [];
    }

    return categories;
  } catch (err) {
    console.error('Unexpected error fetching categories (client):', err);
    return (mockData as any).categories ?? [];
  }
}
