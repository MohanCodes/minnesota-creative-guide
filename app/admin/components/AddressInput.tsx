"use client";

import { useState } from "react";
import { geocodeAddress } from "../geocode";

interface Props {
  value: string;
  latitude: number | null;
  longitude: number | null;
  onChange: (fields: {
    address: string;
    latitude: number | null;
    longitude: number | null;
  }) => void;
}

export default function AddressInput({ value, latitude, longitude, onChange }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState("");

  const handleGeocode = async () => {
    if (!value.trim()) return;
    setLoading(true);
    setError("");

    const result = await geocodeAddress(value);

    if (result?.success) {
      onChange({
        address: value,
        latitude: result.latitude,
        longitude: result.longitude,
      });
      setVerified(result.displayName);
      setError("");
    } else {
      setError(result?.error || "Could not find that address. Check spelling.");
      onChange({ address: value, latitude: null, longitude: null });
      setVerified("");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange({ address: e.target.value, latitude: null, longitude: null });
            setVerified("");
            setError("");
          }}
          onBlur={handleGeocode}
          placeholder="e.g. 750 Main St, Mendota Heights, MN"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={handleGeocode}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm whitespace-nowrap"
        >
          {loading ? "..." : "Verify"}
        </button>
      </div>

      {error && <p className="text-red-600 text-sm">❌ {error}</p>}

      {verified && (
        <p className="text-green-700 text-sm">
          ✅ {verified}
        </p>
      )}

      {latitude && longitude && (
        <p className="text-gray-500 text-xs">
          📍 Lat: {latitude.toFixed(6)}, Lon: {longitude.toFixed(6)}
        </p>
      )}
    </div>
  );
}
