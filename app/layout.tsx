import type React from "react"
import type { Metadata } from "next"
import { Sriracha } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const sriracha = Sriracha({
  weight: '400', // Sriracha only has one weight (400)
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sriracha',
})

export const metadata: Metadata = {
  title: "MiracleArts Creative Guide | Minnesota Resource Directory",
  description: "Discover galleries, art supply stores, and creative resources across the state",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${sriracha.className} antialiased`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
