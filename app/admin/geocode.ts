"use server";

export async function geocodeAddress(address: string) {
  if (!address.trim()) return null;

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
        new URLSearchParams({
          q: address,
          format: "jsonv2",
          limit: "1",
          countrycodes: "us", // restrict to US since all your data is MN
          addressdetails: "1",
        }),
      {
        headers: {
          "User-Agent": "MinnesotaCreativeGuide/1.0 (admin@mncreativeguide.com)", // required by Nominatim policy
        },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    if (data.length === 0) {
      return { success: false as const, error: "Address not found" };
    }

    const result = data[0];
    return {
      success: true as const,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      displayName: result.display_name, // full formatted address for verification
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    return { 
      success: false as const, 
      error: "Failed to geocode address. Please try again." 
    };
  }
}
