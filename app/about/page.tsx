import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Users, Map, Heart } from 'lucide-react'
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-accent/20 mb-4">
              <Sparkles className="h-8 w-8 text-accent" />
            </div>
            <h1 className="text-4xl font-bold mb-4">About MiracleArts Resource Guide</h1>
            <p className="text-xl text-foreground/80">
              Your comprehensive resource for discovering creative spaces across Minnesota
            </p>
          </div>

          <div className="space-y-8 mb-12">
            <Card className="bg-card">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                <p className="text-background/80 leading-relaxed mb-4">
                  MiracleArts, commonly known as "Minnesota Art Resource Hub" is a youth-centered creative education 
                  organization serving youth Minnesota creatives. Our resources aim to inspire, connect and educate 
                  youth Minnesota creatives.
                </p>
                <p className="text-background/80 leading-relaxed">
                  Our founder, Xavier Thomas, originally created the MiracleArts Resource Guide to help his sister 
                  find a local sewing class. That small, personal mission grew into a comprehensive statewide guide, 
                  connecting youth to creative opportunities throughout Minnesota.
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-card">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-accent/20 mb-4">
                    <Map className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">Statewide Coverage</h3>
                  <p className="text-sm text-background/70">
                    Discover creative resources across all of Minnesota&apos;s counties
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-accent/20 mb-4">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">Community Driven</h3>
                  <p className="text-sm text-background/70">Built by and for the creative community of Minnesota</p>
                </CardContent>
              </Card>

              <Card className="bg-card">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-accent/20 mb-4">
                    <Heart className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">Supporting Diversity</h3>
                  <p className="text-sm text-background/70">
                    Highlighting women-owned, POC-owned, and accessible spaces
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
                <ul className="space-y-3 text-backgroun">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      <strong className="text-background">Comprehensive Directory:</strong> Browse galleries, studios,
                      supply stores, makerspaces, and more
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      <strong className="text-background">Advanced Search:</strong> Filter by category, location, and
                      special attributes
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      <strong className="text-background">Interactive Map:</strong> Visualize resources geographically
                      to find what&apos;s near you
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      <strong className="text-background">Detailed Profiles:</strong> Get complete information about
                      each organization
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Ready to Explore?</h2>
            <p className="text-foreground/80 mb-6">
              Start discovering the creative resources Minnesota has to offer
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/browse">Browse Resources</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-accent/30 hover:bg-accent hover:text-accent-foreground">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
