"use client"

import { useState, useEffect } from "react"
import { getOrganizationsClient } from "@/lib/supabase-utils"

export default function DatabaseTestPage() {
  const [status, setStatus] = useState<string>("Testing connection...")
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [tableInfo, setTableInfo] = useState<any>(null)

  useEffect(() => {
    const testConnection = async () => {
      try {
        setStatus("Connecting to Supabase...")
        
        // Test 1: Try to get organizations
        const result = await getOrganizationsClient({ page: 1, pageSize: 5 })
        
        if (result.data.length === 0 && result.total === 0) {
          // Test 2: Check if table exists and get schema info
          setStatus("Checking table structure...")
          
          // Direct Supabase client call to get more detailed info
          const { createClient } = await import('@/utils/supabase/client')
          const supabase = createClient()
          
          // Try to get table info
          const { data: tables, error: tableError } = await supabase
            .from('resources')
            .select('*')
            .limit(1)
          
          if (tableError) {
            setError(`Table access error: ${tableError.message}`)
            setStatus("Table access failed")
            
            // Try to list all tables
            try {
              const { data: schemaInfo } = await supabase.rpc('get_table_info') // This might not exist
              setTableInfo({ schemaInfo })
            } catch (e) {
              setTableInfo({ 
                note: "Cannot access table schema info",
                error: e instanceof Error ? e.message : 'Unknown'
              })
            }
          } else {
            setError("Table exists but appears to be empty")
            setStatus("Connected but no data found")
            setTableInfo({ 
              message: "Table 'resources' exists and is accessible",
              sampleData: tables
            })
          }
        } else {
          setData(result.data)
          setStatus(`Connected successfully! Found ${result.total} total organizations`)
          setTableInfo({
            message: "Data retrieval successful",
            firstRecord: result.data[0]
          })
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
        <div className={`p-4 rounded-lg ${status.includes("failed") || error ? "bg-red-100 border-red-300" : status.includes("success") ? "bg-green-100 border-green-300" : "bg-yellow-100 border-yellow-300"} border`}>
          <h2 className="font-semibold">Status: {status}</h2>
        </div>

        {error && (
          <div className="p-4 bg-red-100 border border-red-300 rounded-lg">
            <h3 className="font-semibold text-red-800">Error Details:</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {tableInfo && (
          <div className="p-4 bg-blue-100 border border-blue-300 rounded-lg">
            <h3 className="font-semibold text-blue-800">Table Information:</h3>
            <pre className="text-sm overflow-auto bg-white p-2 rounded mt-2">
              {JSON.stringify(tableInfo, null, 2)}
            </pre>
          </div>
        )}

        {data && (
          <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
            <h3 className="font-semibold text-green-800">Sample Data (first 5 organizations):</h3>
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

        <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
          <h3 className="font-semibold text-yellow-800">Troubleshooting Steps:</h3>
          <ol className="list-decimal list-inside text-sm space-y-1">
            <li>Check if your table is named 'resources' in Supabase</li>
            <li>Verify the table has data in it</li>
            <li>Check RLS policies in Supabase Dashboard</li>
            <li>Ensure anon role has SELECT permissions</li>
            <li>Verify the Supabase URL and anon key are correct</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
