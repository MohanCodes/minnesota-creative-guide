import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Users, Map, Heart } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">About MiracleArts Creative Guide</h1>
            <p className="text-xl text-muted-foreground">
              Your comprehensive resource for discovering creative spaces and organizations across Minnesota
            </p>
          </div>

          <div className="space-y-8 mb-12">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  MiracleArts Creative Guide is dedicated to connecting artists, makers, and creative enthusiasts with
                  the resources they need to thrive. We believe that by making creative resources more accessible and
                  discoverable, we can strengthen Minnesota&apos;s vibrant arts community and support the growth of
                  creative expression throughout the state.
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mb-4">
                    <Map className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Statewide Coverage</h3>
                  <p className="text-sm text-muted-foreground">
                    Discover creative resources across all of Minnesota&apos;s counties
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Community Driven</h3>
                  <p className="text-sm text-muted-foreground">Built by and for the creative community of Minnesota</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mb-4">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Supporting Diversity</h3>
                  <p className="text-sm text-muted-foreground">
                    Highlighting women-owned, POC-owned, and accessible spaces
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      <strong className="text-foreground">Comprehensive Directory:</strong> Browse galleries, studios,
                      supply stores, makerspaces, and more
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      <strong className="text-foreground">Advanced Search:</strong> Filter by category, location, and
                      special attributes
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      <strong className="text-foreground">Interactive Map:</strong> Visualize resources geographically
                      to find what&apos;s near you
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      <strong className="text-foreground">Detailed Profiles:</strong> Get complete information about
                      each organization
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Ready to Explore?</h2>
            <p className="text-muted-foreground mb-6">
              Start discovering the creative resources Minnesota has to offer
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/browse">Browse Resources</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
