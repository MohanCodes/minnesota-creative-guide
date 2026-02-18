import { Header } from "@/components/header";
import { Sparkles, Users, Map, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
      <Header />

      {/* Hero band */}
      <div className="w-full border-b border-stone-200 bg-gradient-to-br from-[#f5f0eb] to-[#fafaf8]">
        <div className="container max-w-5xl mx-auto px-6 pt-10 pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full border border-[#8a5c8a44] bg-white shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-[#8a5c8a]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#8a5c8a]">
              Minnesota Creative Community
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight leading-tight mb-4">
            About MiracleArts
            <br />
            <span className="text-[#c4a0c4]">Resource Guide</span>
          </h1>

          <p className="text-base md:text-lg text-stone-500 leading-relaxed max-w-xl">
            Your comprehensive resource for discovering creative spaces across Minnesota.
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="container max-w-5xl mx-auto px-6 py-14">
        <div className="grid lg:grid-cols-3 gap-12">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">

            <section>
              <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold mb-3">Our Mission</p>
              <p className="text-stone-700 leading-relaxed mb-4">
                MiracleArts, commonly known as "Minnesota Art Resource Hub," is a youth-centered creative education
                organization serving youth Minnesota creatives. Our resources aim to inspire, connect, and educate
                youth Minnesota creatives.
              </p>
              <p className="text-stone-700 leading-relaxed">
                Our founder, Xavier Thomas, originally created the MiracleArts Resource Guide to help his sister
                find a local sewing class. That small, personal mission grew into a comprehensive statewide guide,
                connecting youth to creative opportunities throughout Minnesota.
              </p>
            </section>

            <div className="h-px bg-stone-100" />

            <section>
              <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold mb-5">What We Offer</p>
              <div className="space-y-4">
                {[
                  { title: "Comprehensive Directory", body: "Browse galleries, studios, supply stores, makerspaces, and more." },
                  { title: "Advanced Search", body: "Filter by category, location, and special attributes to find exactly what you need." },
                  { title: "Interactive Map", body: "Visualize resources geographically to find what's near you." },
                  { title: "Detailed Profiles", body: "Get complete contact information, eligibility details, and ways to get involved." },
                ].map(({ title, body }) => (
                  <div key={title} className="flex gap-4">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#8a5c8a] shrink-0" />
                    <p className="text-stone-700 text-sm leading-relaxed">
                      <span className="font-semibold text-stone-800">{title}: </span>
                      {body}
                    </p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            {[
              { icon: <Map className="h-4 w-4" />, title: "Statewide Coverage", body: "Discover creative resources across all of Minnesota's counties." },
              { icon: <Users className="h-4 w-4" />, title: "Community Driven", body: "Built by and for the creative community of Minnesota." },
              { icon: <Heart className="h-4 w-4" />, title: "Supporting Diversity", body: "Highlighting women-owned, POC-owned, and accessible spaces." },
            ].map(({ icon, title, body }) => (
              <div
                key={title}
                className="bg-white rounded-2xl border border-stone-200 shadow-sm px-5 py-4 flex gap-4 items-start"
              >
                <div className="shrink-0 mt-0.5 inline-flex items-center justify-center h-8 w-8 rounded-xl bg-[#8a5c8a10] text-[#8a5c8a]">
                  {icon}
                </div>
                <div>
                  <p className="font-semibold text-stone-800 text-sm mb-1">{title}</p>
                  <p className="text-xs text-stone-500 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}

            <div className="h-px bg-stone-100 my-2" />

            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="px-5 py-5">
                <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold mb-3">Ready to Explore?</p>
                <p className="text-sm text-stone-500 leading-relaxed mb-4">
                  Start discovering the creative resources Minnesota has to offer.
                </p>
              </div>
              <div className="px-5 pb-5 flex flex-col gap-2">
                <Link
                  href="/browse"
                  className="inline-flex items-center justify-center gap-2 w-full h-10 rounded-full bg-[#8a5c8a] hover:bg-[#7a4c7a] text-white text-sm font-medium transition-colors"
                >
                  Browse Resources
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center w-full h-10 rounded-full border border-stone-200 text-stone-600 hover:border-stone-400 hover:text-stone-900 text-sm font-medium transition-colors bg-white"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}