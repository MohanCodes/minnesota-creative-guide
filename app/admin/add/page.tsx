"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import AddressInput from "../components/AddressInput";

const categoryNames = [
  "Art Gallery & Creative Space",
  "Art Program/School",
  "Art Supply Store",
  "Community Theatre",
  "Dance School & Studio",
  "Makerspace",
  "Non-profit Art Service Organization",
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

export default function AddOrganizationPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Organization>>({
    women_owned: false,
    poc_owned: false,
  });

  const handleSave = async () => {
    try {
      setSaving(true);
      const supabase = createClient();
      const { error } = await supabase
        .from('resources')
        .insert([formData]);

      if (error) {
        console.error("Supabase error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
      
      router.push('/admin');
    } catch (error) {
      console.error("Error adding organization:", error);
      alert(`Error adding organization: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof Organization, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Add Organization</h1>
        <Link
          href="/admin"
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          ← Back to List
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md border">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Area</label>
                <input
                  type="text"
                  value={formData.service_area || ""}
                  onChange={(e) => handleInputChange('service_area', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
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

              <div className="flex items-center space-x-4">
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
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upcoming Events</label>
                <textarea
                  value={formData.upcoming_events || ""}
                  onChange={(e) => handleInputChange('upcoming_events', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opportunities</label>
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
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? "Adding..." : "Add Organization"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
