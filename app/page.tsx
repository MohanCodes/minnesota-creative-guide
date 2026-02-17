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

const imageData = [
  {
    path: "/cycle-images/alt-inspiro.png",
    description: "Alternative music inspiration from Minnesota's vibrant indie scene",
  },
  {
    path: "/cycle-images/country-inspiro.png",
    description: "Country music heritage and creative expression",
  },
  {
    path: "/cycle-images/hiphop-inspiro.png",
    description: "Hip-hop culture and artistic innovation in the Twin Cities",
  },
];

function RandomImagePane() {
  const [selectedImage, setSelectedImage] = useState<(typeof imageData)[0] | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * imageData.length);
    setSelectedImage(imageData[randomIndex]);
  }, []);

  if (!selectedImage) return null;

  return (
    <div className="relative h-full w-full overflow-hidden flex items-center justify-center">
      {/* Warm tinted background */}
      <div className="absolute inset-0 bg-[#FAFAF8]" />

      <div
        className="relative w-full h-full max-w-md mx-auto p-12 transition-opacity duration-700"
        style={{ opacity: loaded ? 1 : 0 }}
      >
        <Image
          src={selectedImage.path}
          alt={selectedImage.description}
          fill
          className="object-contain drop-shadow-xl"
          priority
          onLoad={() => setLoaded(true)}
        />
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
    <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
      <Header />

      {/* Hero */}
      <section className="flex-1 grid lg:grid-cols-2 min-h-[calc(100vh-4rem)]">

        {/* Left — Content */}
        <div className="flex items-center justify-center px-8 py-20 md:py-28 lg:py-0">
          <div className="max-w-lg w-full">

            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full border border-[#8a5c8a44] bg-white shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#8a5c8a]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[#8a5c8a]">
                Minnesota Creative Community
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-5 text-[#8a5c8a]">
              Your Creative
              <br />
              <span className="text-[#c4a0c4]">Resource</span>
            </h1>

            <p className="text-base md:text-lg leading-relaxed mb-10 max-w-md text-[#8a5c8a]/70">
              Discover galleries, art supply stores, and creative resources across the state — all in one place.
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <Input
                  type="text"
                  placeholder="Studios, galleries, supplies…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 text-sm bg-white border-stone-200 rounded-full shadow-sm focus-visible:ring-stone-300 text-stone-800 placeholder:text-stone-400"
                />
              </div>
              <Button
                type="submit"
                className="h-11 px-6 rounded-full text-white text-sm font-medium shadow-sm bg-[#8a5c8a] hover:bg-[#7a4c7a]"
              >
                Search
              </Button>
            </form>

            {/* Quick links */}
            <div className="flex flex-wrap gap-2">
              <QuickLink href="/browse" label="Browse All" />
              <QuickLink href="/map" label="Map View" icon={<Map className="h-3.5 w-3.5" />} />
              <QuickLink href="https://miraclearts.org/" label="Miracle Arts" external />
            </div>
          </div>
        </div>

        {/* Right — Image */}
        <div className="hidden lg:block relative border-l border-stone-200">
          <RandomImagePane />
        </div>
      </section>

      {/* Feature strip */}
      <section className="border-t border-stone-200 bg-white">
        <div className="container max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-stone-100">
            <FeatureTile
              icon={<Search className="h-5 w-5" />}
              title="Advanced Search"
              body="Filter by category, location, and special attributes to find exactly what you need."
            />
            <FeatureTile
              icon={<Map className="h-5 w-5" />}
              title="Interactive Map"
              body="Explore resources geographically with our interactive map and clustering features."
            />
            <FeatureTile
              icon={<Sparkles className="h-5 w-5" />}
              title="Save & Organize"
              body="Create custom lists and save your favorite resources for easy access."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── Helpers ──────────────────────────────────────────────────────── */

function QuickLink({
  href,
  label,
  icon,
  external,
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
  external?: boolean;
}) {
  const inner = (
    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-stone-600 bg-white border border-stone-200 hover:border-stone-400 hover:text-stone-900 transition-colors shadow-sm">
      {icon}
      {label}
      <ArrowRight className="h-3.5 w-3.5" />
    </span>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return <Link href={href}>{inner}</Link>;
}

function FeatureTile({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="px-8 py-10 flex flex-col gap-3">
      <div className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-stone-100 text-stone-500">
        {icon}
      </div>
      <h3 className="font-semibold text-stone-800 text-sm">{title}</h3>
      <p className="text-sm text-stone-500 leading-relaxed">{body}</p>
    </div>
  );
}