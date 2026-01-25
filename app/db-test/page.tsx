"use client"

import { useState, useEffect } from "react"
import { getOrganizationsClient } from "@/lib/supabase-utils"

export default function DatabaseTestPage() {
  const [status, setStatus] = useState<string>("Testing connection...")
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const testConnection = async () => {
      try {
        setStatus("Connecting to Supabase...")
        const result = await getOrganizationsClient({ page: 1, pageSize: 5 })
        
        if (result.data.length === 0 && result.total === 0) {
          setError("No data found - database may be empty or connection failed")
          setStatus("Connection issue detected")
        } else {
          setData(result.data)
          setStatus(`Connected successfully! Found ${result.total} total organizations`)
        }
      } catch (err) {
        setError(`Connection error: ${err instanceof Error ? err.message : 'Unknown error'}`)
        setStatus("Connection failed")
      }
    }

    testConnection()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      
      <div className="space-y-4">
        <div className={`p-4 rounded-lg ${status.includes("failed") || error ? "bg-red-100 border-red-300" : "bg-green-100 border-green-300"} border`}>
          <h2 className="font-semibold">Status: {status}</h2>
        </div>

        {error && (
          <div className="p-4 bg-red-100 border border-red-300 rounded-lg">
            <h3 className="font-semibold text-red-800">Error Details:</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {data && (
          <div className="p-4 bg-blue-100 border border-blue-300 rounded-lg">
            <h3 className="font-semibold text-blue-800">Sample Data (first 5 organizations):</h3>
            <pre className="text-sm overflow-auto bg-white p-2 rounded mt-2">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}

        <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg">
          <h3 className="font-semibold">Environment Variables Check:</h3>
          <p className="text-sm">NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"}</p>
          <p className="text-sm">NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing"}</p>
        </div>
      </div>
    </div>
  )
}
