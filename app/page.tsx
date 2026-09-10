"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { TentTree } from "lucide-react";

import CampsiteDetail from "@/components/campsite-detail";
import CampsiteFilters, {
  type RegionFilter,
  type SiteTypeFilter,
} from "@/components/campsite-filters";
import CampsiteList from "@/components/campsite-list";
import { CAMPSITES } from "@/lib/campsites";

const CampsiteMap = dynamic(() => import("@/components/campsite-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-lg border bg-muted text-sm text-muted-foreground">
      Loading map…
    </div>
  ),
});

export default function Page() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [region, setRegion] = useState<RegionFilter>("All");
  const [siteType, setSiteType] = useState<SiteTypeFilter>("All");
  const [dogOnly, setDogOnly] = useState(false);
  const [showersOnly, setShowersOnly] = useState(false);

  const filtered = useMemo(
    () =>
      CAMPSITES.filter((site) => {
        if (region !== "All" && site.region !== region) return false;
        if (siteType !== "All" && !site.siteTypes.includes(siteType)) return false;
        if (dogOnly && !site.dogFriendly) return false;
        if (showersOnly && !site.showers) return false;
        return true;
      }),
    [region, siteType, dogOnly, showersOnly]
  );

  const selected = useMemo(
    () => CAMPSITES.find((s) => s.id === selectedId) ?? null,
    [selectedId]
  );

  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center gap-3 border-b px-4 py-3 sm:px-6">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <TentTree className="size-5" />
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold leading-tight">
            Bay Area Campsite Finder
          </h1>
          <p className="text-xs text-muted-foreground">
            {filtered.length} of {CAMPSITES.length} campgrounds · availability via booking sites
          </p>
        </div>
      </header>

      <main className="grid flex-1 gap-4 p-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="flex min-h-[380px] flex-col gap-3 lg:min-h-0">
          <CampsiteFilters
            region={region}
            onRegionChange={setRegion}
            siteType={siteType}
            onSiteTypeChange={setSiteType}
            dogOnly={dogOnly}
            onDogOnlyChange={setDogOnly}
            showersOnly={showersOnly}
            onShowersOnlyChange={setShowersOnly}
            onReset={() => {
              setRegion("All");
              setSiteType("All");
              setDogOnly(false);
              setShowersOnly(false);
            }}
          />
          <div className="min-h-[320px] flex-1 overflow-hidden rounded-lg border lg:min-h-[420px]">
            <CampsiteMap sites={filtered} selectedId={selectedId} onSelect={setSelectedId} />
          </div>
          <p className="text-xs text-muted-foreground">
            Pins are colored by region. Availability isn&apos;t live — hitting a site opens its
            booking page on ReserveCalifornia, Recreation.gov, or the park operator.
          </p>
        </section>

        <aside className="min-h-0 lg:overflow-y-auto lg:pr-1">
          <CampsiteList sites={filtered} selectedId={selectedId} onSelect={setSelectedId} />
        </aside>
      </main>

      <CampsiteDetail site={selected} onClose={() => setSelectedId(null)} />
    </div>
  );
}
