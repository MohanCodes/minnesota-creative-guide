"use client"

import { Button } from "@/components/ui/button"
import { Menu } from 'lucide-react'
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"

export function Header() {
  const navLinks = [
    { href: "/browse", label: "Browse Resources" },
    { href: "/map", label: "Map View" },
    { href: "/about", label: "About" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-foreground/95 backdrop-blur">
      <div className="w-full max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image 
              src="/ma6white.png" 
              alt="MiracleArts Logo" 
              width={64} 
              height={64} 
              className="object-contain"
              priority
          />
          <span className="hidden font-bold text-lg sm:inline-block text-white">MiracleArts</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-background/80 transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <nav className="flex flex-col gap-6 mt-8 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-medium text-background/80 transition-colors hover:text-accent py-2"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
