"use client";

import type React from "react";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Map, Search, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Image data with descriptions
const imageData = [
  {
    path: "/cycle-images/alt-inspiro.png",
    description: "Alternative music inspiration from Minnesota's vibrant indie scene"
  },
  {
    path: "/cycle-images/country-inspiro.png",
    description: "Country music heritage and creative expression"
  },
  {
    path: "/cycle-images/hiphop-inspiro.png",
    description: "Hip-hop culture and artistic innovation in the Twin Cities"
  }
];

// Random Image Component
function RandomImagePane() {
  const [selectedImage, setSelectedImage] = useState<typeof imageData[0] | null>(null);
  
  useEffect(() => {
    // Select random image with description
    const randomIndex = Math.floor(Math.random() * imageData.length);
    setSelectedImage(imageData[randomIndex]);
  }, []);

  if (!selectedImage) return null;

  return (
    <div className="relative h-full w-full overflow-hidden bg-white flex items-center justify-center p-8">
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <div className="relative w-full h-full max-w-full max-h-full">
          <Image
            src={selectedImage.path}
            alt={selectedImage.description}
            fill
            className="object-contain"
            priority
          />
        </div>
        {/* <div className="absolute bottom-8 left-8 right-8 flex justify-center">
          <div className="inline-block px-6 py-3 rounded-lg bg-primary text-primary-foreground">
            <p className="text-sm font-medium">
              {selectedImage.description}
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/browse");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section - Double Paned */}
      <section className="relative flex-1 flex items-center justify-center bg-background">
        <div className="w-full h-full grid lg:grid-cols-2">
          {/* Left Pane - Content */}
          <div className="relative flex items-center justify-center px-6 py-20 md:py-32">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            <div className="relative z-10 max-w-2xl mx-auto text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-accent/20 border border-accent/30">
                <Sparkles className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-accent-foreground">
                  Discover Minnesota&apos;s Creative Community
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance text-foreground">
                Your Creative Resource
              </h1>

              <p className="text-lg md:text-xl text-foreground/80 mb-8 text-balance">
                Discover galleries, art supply stores, and creative resources across the state
              </p>

              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
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
                </Button>
              </form>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <Button variant="outline" size="lg" asChild className="bg-card border-accent/30">
                  <Link href="/browse">
                    Browse All Resources
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="bg-card border-accent/30">
                  <Link href="/map">
                    Map
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="bg-card border-accent/30">
                  <Link href="https://miraclearts.org/">
                    Miracle Arts
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Right Pane - Random Image */}
          <div className="hidden lg:block relative min-h-[600px]">
            <RandomImagePane />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 border-t bg-card">
        <div className="container max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-accent/20 mb-4">
                <Search className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg text-background mb-2">Advanced Search</h3>
              <p className="text-sm text-background/70">
                Filter by category, location, and special attributes to find exactly what you need
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-accent/20 mb-4">
                <Map className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg text-background mb-2">Interactive Map</h3>
              <p className="text-sm text-background/70">
                Explore resources geographically with our interactive map and clustering features
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-accent/20 mb-4">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg text-background mb-2">Save & Organize</h3>
              <p className="text-sm text-background/70">
                Create custom lists and save your favorite resources for easy access
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}