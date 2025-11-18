"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Map, Search, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/browse?q=${encodeURIComponent(searchQuery)}`)
    } else {
      router.push("/browse")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center px-4 py-20 md:py-32 bg-gradient-to-br from-background via-secondary/20 to-primary/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Discover Minnesota&apos;s Creative Community</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Your Guide to Creative Resources Across Minnesota
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 text-balance max-w-2xl mx-auto">
            Find studios, galleries, supply stores, and creative spaces throughout the state. Connect with the resources
            you need to bring your artistic vision to life.
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for studios, galleries, supplies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-8">
              Search
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="outline" size="lg" asChild>
              <Link href="/browse">
                Browse All Resources
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/map">
                <Map className="mr-2 h-5 w-5" />
                View Map
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 border-t">
        <div className="container max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Advanced Search</h3>
              <p className="text-sm text-muted-foreground">
                Filter by category, location, and special attributes to find exactly what you need
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mb-4">
                <Map className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Interactive Map</h3>
              <p className="text-sm text-muted-foreground">
                Explore resources geographically with our interactive map and clustering features
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Save & Organize</h3>
              <p className="text-sm text-muted-foreground">
                Create custom lists and save your favorite resources for easy access
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
