// app/profile/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser, signOut } from '@/lib/supabase/client-utils'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await getCurrentUser()
      if (data) {
        setUser(data)
      }
      setLoading(false)
    }
    fetchUser()
  }, [])
  
  const handleSignOut = async () => {
    await signOut()
    // Optionally redirect to login page
    window.location.href = '/login'
  }

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Not authenticated</div>

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        <div className="space-y-2">
          <p><span className="font-medium">Email:</span> {user.email}</p>
          <p><span className="font-medium">User ID:</span> {user.id}</p>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSignOut}
          className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}