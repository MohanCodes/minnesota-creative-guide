"use client"

import { Menu, X } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { href: "/browse", label: "Browse" },
    { href: "/map", label: "Map" },
    { href: "/about", label: "About" },
  ]

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#7a4c7a] bg-[#8a5c8a]/95 backdrop-blur-md">
        <div className="w-full flex h-14 items-center justify-between px-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/ma6white.png"
              alt="MiracleArts Logo"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
            <span className="font-semibold text-sm text-white tracking-tight transition-colors">
              MiracleArts
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-1.5 rounded-full text-sm font-medium text-white/80 hover:text-white hover:bg-white/15 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/browse"
              className="ml-2 px-4 py-1.5 rounded-full text-sm font-medium bg-white text-[#8a5c8a] hover:bg-stone-100 transition-colors"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <div className="fixed top-0 right-0 z-50 h-full w-72 bg-[#FAFAF8] border-l border-[#7a4c7a] shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-6 h-14 border-b border-[#7a4c7a]">
              <span className="text-sm font-semibold text-stone-800">Menu</span>
              <button
                className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex flex-col px-4 py-6 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="px-8 mt-auto pb-8">
              <Link
                href="/browse"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-full h-10 rounded-full bg-[#8a5c8a] hover:bg-[#7a4c7a] text-white text-sm font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  )
}