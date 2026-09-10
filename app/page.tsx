"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Heart, MapPinned, TentTree } from "lucide-react";

import CampsiteFilters, {
  type RegionFilter,
  type SiteTypeFilter,
  type SortOption,
} from "@/components/campsite-filters";
import CampsiteList from "@/components/campsite-list";
import ThemeToggle from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { CAMPSITES } from "@/lib/campsites";

const CampsiteMap = dynamic(() => import("@/components/campsite-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-lg border bg-muted text-sm text-muted-foreground">
      Loading map…
    </div>
  ),
});

const FAVORITES_KEY = "lgc:favorites:v1";

function loadFavorites(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((v): v is string => typeof v === "string"));
  } catch {
    return new Set();
  }
}

export default function Page() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [region, setRegion] = useState<RegionFilter>("All");
  const [siteType, setSiteType] = useState<SiteTypeFilter>("All");
  const [dogOnly, setDogOnly] = useState(false);
  const [showersOnly, setShowersOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("featured");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Hydrate saved favorites after mount to avoid SSR / hydration mismatch.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    setFavorites(loadFavorites());
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
    } catch {
      // ignore quota / privacy-mode errors
    }
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const resetFilters = () => {
    setRegion("All");
    setSiteType("All");
    setDogOnly(false);
    setShowersOnly(false);
    setQuery("");
    setSort("featured");
    setFavoritesOnly(false);
  };

  const handleSelect = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleMapSelect = (id: string) => {
    setSelectedId(id);
  };

  const activeFilterCount =
    (region !== "All" ? 1 : 0) +
    (siteType !== "All" ? 1 : 0) +
    (dogOnly ? 1 : 0) +
    (showersOnly ? 1 : 0) +
    (query.trim() !== "" ? 1 : 0) +
    (favoritesOnly ? 1 : 0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = CAMPSITES.filter((site) => {
      if (region !== "All" && site.region !== region) return false;
      if (siteType !== "All" && !site.siteTypes.includes(siteType)) return false;
      if (dogOnly && !site.dogFriendly) return false;
      if (showersOnly && !site.showers) return false;
      if (favoritesOnly && !favorites.has(site.id)) return false;
      if (q) {
        const haystack = `${site.name} ${site.park} ${site.region} ${site.description}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    switch (sort) {
      case "name":
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      case "region":
        return [...list].sort(
          (a, b) => a.region.localeCompare(b.region) || a.name.localeCompare(b.name)
        );
      case "featured":
      default:
        return list;
    }
  }, [region, siteType, dogOnly, showersOnly, favoritesOnly, favorites, query, sort]);

  const selected = useMemo(
    () => CAMPSITES.find((s) => s.id === selectedId) ?? null,
    [selectedId]
  );

  return (
    <div className="flex min-h-svh flex-col lg:h-svh lg:overflow-hidden">
      <header className="flex shrink-0 items-center gap-3 border-b bg-background/80 px-4 py-3 backdrop-blur sm:px-6">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <TentTree className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold leading-tight">
            Bay Area Campsite Finder
          </h1>
          <p className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
            <span>
              {filtered.length} of {CAMPSITES.length} campgrounds
            </span>
            <span aria-hidden className="text-border">
              ·
            </span>
            <span className="hidden sm:inline">availability via booking sites</span>
            {favorites.size > 0 && (
              <Badge variant="secondary" className="gap-1">
                <Heart className="size-2.5 fill-current" />
                {favorites.size} saved
              </Badge>
            )}
          </p>
        </div>
        <ThemeToggle />
      </header>

      <main className="grid min-h-0 flex-1 gap-4 p-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:grid-rows-[minmax(0,1fr)] lg:overflow-hidden">
        <section className="flex min-h-[420px] flex-col gap-3 lg:h-full lg:min-h-0 lg:overflow-hidden">
          <div className="shrink-0">
          <CampsiteFilters
            region={region}
            onRegionChange={setRegion}
            siteType={siteType}
            onSiteTypeChange={setSiteType}
            dogOnly={dogOnly}
            onDogOnlyChange={setDogOnly}
            showersOnly={showersOnly}
            onShowersOnlyChange={setShowersOnly}
            query={query}
            onQueryChange={setQuery}
            sort={sort}
            onSortChange={setSort}
            favoritesOnly={favoritesOnly}
            onFavoritesOnlyChange={setFavoritesOnly}
            favoritesCount={favorites.size}
            activeCount={activeFilterCount}
            onReset={resetFilters}
          />
          </div>
          <div className="relative min-h-[340px] flex-1 overflow-hidden rounded-lg border lg:min-h-0">
            <CampsiteMap
              sites={filtered}
              selectedId={selectedId}
              selectedSite={selected}
              favorites={favorites}
              onSelect={handleMapSelect}
            />
            <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-md border bg-background/90 px-2 py-1 text-[11px] text-muted-foreground shadow-sm backdrop-blur">
              <MapPinned className="size-3.5" />
              {filtered.length} in view
            </div>
          </div>
          <p className="shrink-0 text-xs text-muted-foreground">
            Pins are colored by region. Availability isn&apos;t live — opening a site jumps to its
            booking page on ReserveCalifornia, Recreation.gov, or the park operator.
          </p>
        </section>

        <aside className="min-h-0 lg:h-full lg:overflow-y-auto lg:overscroll-contain lg:pr-1 lg:pb-6 [scrollbar-gutter:stable]">
          <CampsiteList
            sites={filtered}
            selectedId={selectedId}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onSelect={handleSelect}
            onReset={resetFilters}
          />
        </aside>
      </main>
    </div>
  );
}
