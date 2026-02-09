"use client";

import { useState } from "react";
import { loginAdmin } from "./actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await loginAdmin(password);

    if (result.success) {
      router.refresh(); // Re-renders layout, now authenticated
    } else {
      setError("Wrong password");
      setPassword("");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <Link
            href="/"
            className="px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
          >
            ← Back to Site
          </Link>
        </div>
        <form onSubmit={handleSubmit}>
        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter admin password"
          className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-foreground text-white rounded-lg  disabled:opacity-50 transition duration-300"
        >
          {loading ? "Checking..." : "Enter"}
        </button>
        </form>
      </div>
    </div>
  );
}
