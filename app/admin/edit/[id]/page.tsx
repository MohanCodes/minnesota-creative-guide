"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import AddressInput from "../../components/AddressInput";

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
  lgbtqia_owned: boolean;
  comments: string | null;
  edition: string[] | null;
  categories: string[] | null;
}

export default function EditOrganizationPage() {
  const params = useParams();
  const router = useRouter();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState<Partial<Organization>>({});

  useEffect(() => {
    if (params.id) {
      loadOrganization(params.id as string);
    }
  }, [params.id]);

  const loadOrganization = async (id: string) => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setOrganization(data);
      setFormData(data || {});
    } catch (error) {
      console.error("Error loading organization:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!params.id) return;
    
    try {
      setSaving(true);
      setSaved(false);
      const supabase = createClient();
      const { error } = await supabase
        .from('resources')
        .update(formData)
        .eq('id', params.id);

      if (error) {
        console.error("Supabase error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
      
      setSaved(true);
      // Reload organization data to show updated values
      await loadOrganization(params.id as string);
    } catch (error) {
      console.error("Error saving organization:", error);
      alert(`Error saving organization: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof Organization, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaved(false); // Reset saved state when form is changed
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center">
          <div className="text-lg">Loading organization...</div>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Organization Not Found</h1>
          <Link href="/admin" className="text-blue-600 hover:text-blue-800">
            ← Back to Admin Portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Organization</h1>
        <Link
          href="/admin"
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          ← Back to List
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md border">
        {saved && (
          <div className="m-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Organization updated successfully!
                </p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name *</label>
                <input
                  type="text"
                  value={formData.resource || ""}
                  onChange={(e) => handleInputChange('resource', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  value={formData.description || ""}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categoryNames.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Area (County)</label>
                <input
                  type="text"
                  value={formData.service_area || ""}
                  onChange={(e) => handleInputChange('service_area', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address (Verify puts on map)</label>
                <AddressInput
                  value={formData.address || ""}
                  latitude={formData.latitude || null}
                  longitude={formData.longitude || null}
                  onChange={({ address, latitude, longitude }) => {
                    setFormData(prev => ({ ...prev, address, latitude, longitude }));
                  }}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Contact Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="url"
                  value={formData.website || ""}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.number || ""}
                  onChange={(e) => handleInputChange('number', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.women_owned || false}
                    onChange={(e) => handleInputChange('women_owned', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Women Owned</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.poc_owned || false}
                    onChange={(e) => handleInputChange('poc_owned', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">POC Owned</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.lgbtqia_owned || false}
                    onChange={(e) => handleInputChange('lgbtqia_owned', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">LGBTQIA+ Owned</span>
                </label>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upcoming Events (Link if possible)</label>
                <textarea
                  value={formData.upcoming_events || ""}
                  onChange={(e) => handleInputChange('upcoming_events', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opportunities (Link if possible)</label>
                <textarea
                  value={formData.opportunities || ""}
                  onChange={(e) => handleInputChange('opportunities', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">How to Support</label>
              <textarea
                value={formData.how_to_support || ""}
                onChange={(e) => handleInputChange('how_to_support', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
              <textarea
                value={formData.comments || ""}
                onChange={(e) => handleInputChange('comments', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-8 flex justify-end space-x-4">
            <Link
              href="/admin"
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
