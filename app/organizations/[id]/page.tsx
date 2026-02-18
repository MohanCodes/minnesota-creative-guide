"use client";

import { Header } from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { MapPin, Phone, Mail, Globe, ExternalLink, ArrowLeft, Calendar, Briefcase, Heart } from "lucide-react";
import { CopyLinkButton } from "@/components/copy-link-button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useParams } from "next/navigation";
import { OrganizationCard } from "@/components/organization-card";
import {
  getOrganizationByIdClient,
  getOrganizationsClient,
  getCategoriesClient,
} from "@/lib/supabase-utils";
import { useEffect, useState } from "react";

function looksLikeUrl(value?: string | null): boolean {
  if (!value) return false;
  const v = value.trim();
  if (!v) return false;
  return /^https?:\/\//i.test(v) || /^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(v);
}

function normalizeUrl(value: string): string {
  const v = value.trim();
  if (/^https?:\/\//i.test(v)) return v;
  return `https://${v}`;
}

export default function OrganizationPage() {
  const params = useParams();
  const id = params.id as string;

  const [organization, setOrganization] = useState<any>(null);
  const [relatedOrgs, setRelatedOrgs] = useState<any[]>([]);
  const [categoryColor, setCategoryColor] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const org = await getOrganizationByIdClient(id);
        setOrganization(org);

        if (org) {
          const categoryName = org.description as string | undefined;
          const [allResult, categories] = await Promise.all([
            getOrganizationsClient({ page: 1, pageSize: 1000 }),
            getCategoriesClient(),
          ]);
          const allOrgs = (allResult?.data ?? []) as any[];
          const related = allOrgs
            .filter(
              (o) =>
                o.id !== org.id &&
                o.description &&
                categoryName &&
                o.description === categoryName
            )
            .slice(0, 3);
          setRelatedOrgs(related);
          const category = categories?.find((c: any) => c.name === categoryName);
          setCategoryColor(category?.color_code);
        }
      } catch (error) {
        console.error("Error loading organization data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
        <Header />
        <div className="container max-w-5xl mx-auto py-16 px-6">
          <Skeleton className="h-4 w-24 mb-10 bg-stone-200" />
          <Skeleton className="h-14 w-2/3 mb-4 bg-stone-200" />
          <Skeleton className="h-5 w-1/4 mb-12 bg-stone-200" />
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-4 w-full bg-stone-200" />
              <Skeleton className="h-4 w-5/6 bg-stone-200" />
              <Skeleton className="h-4 w-4/5 bg-stone-200" />
            </div>
            <div>
              <Skeleton className="h-52 w-full rounded-2xl bg-stone-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
        <Header />
        <div className="container max-w-5xl mx-auto py-32 px-6 text-center">
          <p className="text-stone-400 text-sm uppercase tracking-widest mb-4">404</p>
          <h1 className="text-3xl font-semibold text-stone-800 mb-6">Organization not found</h1>
          <Link href="/browse" className="inline-flex items-center gap-2 px-6 h-10 rounded-full border border-stone-200 text-stone-600 hover:border-stone-400 hover:text-stone-900 text-sm font-medium transition-colors bg-white">← Browse Resources</Link>
        </div>
      </div>
    );
  }

  const name = organization.resource as string | undefined;
  const categoryName = organization.description as string | undefined;
  const county = organization.service_area as string | undefined;
  const eligibility = organization.eligibility as string | undefined;
  const website = organization.website as string | undefined;
  const phone = organization.number as string | undefined;
  const email = organization.email as string | undefined;
  const address = organization.address as string | undefined;
  const upcomingEvents = organization.upcoming_events as string | undefined;
  const opportunities = organization.opportunities as string | undefined;
  const howToSupport = organization.how_to_support as string | undefined;
  const womenOwned = Boolean(organization.women_owned);
  const pocOwned = Boolean(organization.poc_owned);
  const lgbtqiaOwned = Boolean(organization.lgbtqia_owned);
  const comments = organization.comments as string | undefined;
  const edition = organization.edition as string | undefined;

  const ownershipTags = [
    womenOwned && "Women-Owned",
    pocOwned && "POC-Owned",
    lgbtqiaOwned && "LGBTQIA+-Owned",
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
      <Header />

      {/* Hero band */}
      <div
        className={`w-full border-b border-stone-200 ${!categoryColor ? "bg-gradient-to-br from-[#f5f0eb] to-[#fafaf8]" : ""}`}
        style={categoryColor ? { background: `linear-gradient(135deg, ${categoryColor}18 0%, ${categoryColor}08 100%)` } : undefined}
      >
        <div className="container max-w-5xl mx-auto px-6 pt-10 pb-12">
          {/* Back nav */}
          <Link
            href="/browse"
            className="inline-flex items-center gap-1.5 text-xs text-stone-400 uppercase tracking-widest hover:text-stone-600 transition-colors mb-10"
          >
            <ArrowLeft className="h-3 w-3" />
            All Resources
          </Link>

          <div className="flex flex-wrap items-start gap-3 mb-3">
            {categoryName && (
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-stone-900"
                style={{ backgroundColor: categoryColor ?? "#e5e7eb" }}
              >
                {categoryName}
              </span>
            )}
            {ownershipTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/70 border border-stone-200 text-stone-600 uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight leading-tight mb-4">
            {name}
            <span className="inline-flex ml-3 align-middle">
              <CopyLinkButton
                url={`${typeof window !== "undefined" ? window.location.origin : ""}/organizations/${organization.id}`}
              />
            </span>
          </h1>

          {(county || edition) && (
            <div className="flex items-center gap-2 text-stone-500 text-sm">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>
                {county}
                {county && edition && " · "}
                {edition && `${edition} region`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="container max-w-5xl mx-auto px-6 py-14">
        <div className="grid lg:grid-cols-3 gap-12">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">

            {eligibility && (
              <section>
                <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold mb-3">Eligibility</p>
                <p className="text-stone-700 leading-relaxed text-base">{eligibility}</p>
              </section>
            )}

            {comments && (
              <>
                {eligibility && <Separator className="bg-stone-100" />}
                <section>
                  <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold mb-3">Notes</p>
                  <p className="text-stone-700 leading-relaxed text-base whitespace-pre-line">{comments}</p>
                </section>
              </>
            )}

            {/* Action cards */}
            {(upcomingEvents || opportunities || howToSupport) && (
              <>
                <Separator className="bg-stone-100" />
                <section>
                  <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold mb-5">Get Involved</p>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {upcomingEvents && (
                      <ActionCard
                        icon={<Calendar className="h-4 w-4" />}
                        label="Upcoming Events"
                        value={upcomingEvents}
                        linkText="View events"
                      />
                    )}
                    {opportunities && (
                      <ActionCard
                        icon={<Briefcase className="h-4 w-4" />}
                        label="Opportunities"
                        value={opportunities}
                        linkText="View opportunities"
                      />
                    )}
                    {howToSupport && (
                      <ActionCard
                        icon={<Heart className="h-4 w-4" />}
                        label="How to Support"
                        value={howToSupport}
                        linkText="Support this org"
                      />
                    )}
                  </div>
                </section>
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="px-6 pt-6 pb-2">
                <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold mb-5">Contact</p>
                <div className="space-y-4">
                  {address && (
                    <ContactRow icon={<MapPin className="h-4 w-4" />}>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-stone-700 hover:text-stone-900 transition-colors whitespace-pre-line inline-flex items-start gap-1.5 group"
                      >
                        <span>{address}</span>
                        <ExternalLink className="h-3 w-3 shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </ContactRow>
                  )}
                  {phone && (
                    <ContactRow icon={<Phone className="h-4 w-4" />}>
                      <a href={`tel:${phone}`} className="text-sm text-stone-700 hover:text-stone-900 transition-colors">
                        {phone}
                      </a>
                    </ContactRow>
                  )}
                  {email && (
                    <ContactRow icon={<Mail className="h-4 w-4" />}>
                      <a href={`mailto:${email}`} className="text-sm text-stone-700 hover:text-stone-900 transition-colors break-all">
                        {email}
                      </a>
                    </ContactRow>
                  )}
                  {website && (
                    <ContactRow icon={<Globe className="h-4 w-4" />}>
                      {looksLikeUrl(website) ? (
                        <a
                          href={normalizeUrl(website)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-stone-700 hover:text-stone-900 transition-colors inline-flex items-center gap-1.5 break-all"
                        >
                          Visit Website
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-sm text-stone-500">{website}</span>
                      )}
                    </ContactRow>
                  )}
                </div>
              </div>

              {/* No contact info fallback */}
              {!address && !phone && !email && !website && (
                <div className="px-6 pb-6">
                  <p className="text-sm text-stone-400 italic">No contact information listed.</p>
                </div>
              )}

              <div className="px-6 py-5 mt-2 bg-stone-50 border-t border-stone-100">
                <Link href="/browse" className="inline-flex items-center justify-center w-full h-10 rounded-full bg-[#8a5c8a] hover:bg-[#7a4c7a] text-white text-sm font-medium transition-colors">Browse Similar Resources</Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Organizations */}
        {relatedOrgs.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center gap-4 mb-8">
              <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold">Similar Resources</p>
              <div className="flex-1 h-px bg-stone-200" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedOrgs.map((org) => (
                <OrganizationCard key={org.id} organization={org} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Small helpers ─────────────────────────────────────────────────── */

function ContactRow({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-stone-400 shrink-0 mt-0.5">{icon}</span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function ActionCard({
  icon,
  label,
  value,
  linkText,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  linkText: string;
}) {
  const isLink = looksLikeUrl(value);
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-4 hover:border-stone-300 transition-colors">
      <div className="flex items-center gap-2 text-stone-500 mb-2">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
      </div>
      {isLink ? (
        <a
          href={normalizeUrl(value)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-stone-700 hover:text-stone-900 inline-flex items-center gap-1 transition-colors"
        >
          {linkText}
          <ExternalLink className="h-3 w-3" />
        </a>
      ) : (
        <p className="text-sm text-stone-700 leading-snug">{value}</p>
      )}
    </div>
  );
}