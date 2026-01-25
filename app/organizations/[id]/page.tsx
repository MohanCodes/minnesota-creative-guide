"use client";

import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Phone, Mail, Globe, ExternalLink } from "lucide-react";
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
  // Simple heuristic: starts with http(s) or looks like a bare domain
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

        // Fetch the organization by id (this should return a row shaped like the CSV)
        const org = await getOrganizationByIdClient(id);
        setOrganization(org);

        if (org) {
          // org.description is your exact category string
          const categoryName = org.description as string | undefined;

          const [allResult, categories] = await Promise.all([
            getOrganizationsClient({ page: 1, pageSize: 1000 }),
            getCategoriesClient(),
          ]);

          const allOrgs = (allResult?.data ?? []) as any[];

          // Related orgs = same description (category), different resource
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

          // Category color from categories table
          const category = categories?.find(
            (c: any) => c.name === categoryName
          );
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
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container max-w-7xl mx-auto py-8 px-8">
          <div className="space-y-4">
            <Skeleton className="h-12 w-1/2 bg-white" />
            <Skeleton className="h-6 w-1/3 bg-white" />
            <div className="flex gap-4">
              <Skeleton className="h-24 w-24 rounded-full bg-white" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-3/4 bg-white" />
                <Skeleton className="h-4 w-full bg-white" />
                <Skeleton className="h-4 w-5/6 bg-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container max-w-7xl mx-auto py-16 px-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Organization not found</h1>
          <Button asChild>
            <Link href="/browse">Browse Resources</Link>
          </Button>
        </div>
      </div>
    );
  }

  // CSV field names
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
  const comments = organization.comments as string | undefined;
  const edition = organization.edition as string | undefined;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container max-w-7xl mx-auto py-8 px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold flex items-center gap-2">{name}
                      <CopyLinkButton url={`${typeof window !== 'undefined' ? window.location.origin : ''}/organizations/${organization.id}`} />
                    </h1>
                    {categoryName && categoryColor && (
                      <Badge
                        variant="secondary"
                        style={{
                          backgroundColor: categoryColor,
                          color: 'black',
                          borderColor: categoryColor,
                        }}
                      >
                        {categoryName}
                      </Badge>
                    )}
                  </div>
                  {(county || edition) && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {county}
                        {county && edition && " • "}
                        {edition && `${edition} region`}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Special Attributes */}
              <div className="flex flex-wrap gap-2">
                {womenOwned && (
                  <Badge variant="outline" className="bg-primary/5">
                    Women-Owned
                  </Badge>
                )}
                {pocOwned && (
                  <Badge variant="outline" className="bg-primary/5">
                    POC-Owned
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* Description / eligibility / comments */}
            <div className="space-y-4">
              {categoryName && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Type</h2>
                  <p className="text-muted-foreground">{categoryName}</p>
                </div>
              )}

              {eligibility && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Eligibility</h2>
                  <p className="text-muted-foreground">{eligibility}</p>
                </div>
              )}

              {comments && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Notes</h2>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {comments}
                  </p>
                </div>
              )}
            </div>

            {/* Additional links/info */}
            {(upcomingEvents || opportunities || howToSupport) && (
              <>
                <Separator />
                <div className="grid gap-4 md:grid-cols-3">
                  {upcomingEvents && (
                    <Card>
                      <CardContent className="p-4 space-y-1">
                        <h3 className="font-semibold text-sm">
                          Upcoming Events
                        </h3>
                        {looksLikeUrl(upcomingEvents) ? (
                          <a
                            href={normalizeUrl(upcomingEvents)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-background inline-flex items-center gap-1"
                          >
                            View events
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <p className="text-sm text-background">
                            {upcomingEvents}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {opportunities && (
                    <Card>
                      <CardContent className="p-4 space-y-1">
                        <h3 className="font-semibold text-sm">
                          Opportunities
                        </h3>
                        {looksLikeUrl(opportunities) ? (
                          <a
                            href={normalizeUrl(opportunities)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-400 inline-flex items-center gap-1"
                          >
                            View opportunities
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {opportunities}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {howToSupport && (
                    <Card>
                      <CardContent className="p-4 space-y-1">
                        <h3 className="font-semibold text-sm">
                          How to Support
                        </h3>
                        {looksLikeUrl(howToSupport) ? (
                          <a
                            href={normalizeUrl(howToSupport)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-400 inline-flex items-center gap-1"
                          >
                            Support this organization
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {howToSupport}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-lg">Contact Information</h3>

                {address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-background shrink-0 mt-0.5" />
                    <p className="text-sm whitespace-pre-line">{address}</p>
                  </div>
                )}

                {phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-background shrink-0" />
                    <a
                      href={`tel:${phone}`}
                      className="text-sm hover:text-gray-400"
                    >
                      {phone}
                    </a>
                  </div>
                )}

                {email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-background shrink-0" />
                    <a
                      href={`mailto:${email}`}
                      className="text-sm hover:text-gray-400 break-all"
                    >
                      {email}
                    </a>
                  </div>
                )}

                {website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-background shrink-0" />
                    {looksLikeUrl(website) ? (
                      <a
                        href={normalizeUrl(website)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:text-gray-400 inline-flex items-center gap-1 break-all"
                      >
                        Visit Website
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {website}
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Organizations */}
        {relatedOrgs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Similar Resources</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedOrgs.map((org) => (
                <OrganizationCard
                  key={org.id}
                  organization={org}
                  // org.description is the category string; OrganizationCard can
                  // use it for its own badge if needed
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}