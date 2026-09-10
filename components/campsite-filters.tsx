"use client";

import { Heart, RotateCcw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { REGIONS, SITE_TYPES, type Region, type SiteType } from "@/lib/campsites";

export type RegionFilter = Region | "All";
export type SiteTypeFilter = SiteType | "All";
export type SortOption = "featured" | "name" | "region";

interface CampsiteFiltersProps {
  region: RegionFilter;
  onRegionChange: (r: RegionFilter) => void;
  siteType: SiteTypeFilter;
  onSiteTypeChange: (t: SiteTypeFilter) => void;
  dogOnly: boolean;
  onDogOnlyChange: (v: boolean) => void;
  showersOnly: boolean;
  onShowersOnlyChange: (v: boolean) => void;
  query: string;
  onQueryChange: (v: string) => void;
  sort: SortOption;
  onSortChange: (v: SortOption) => void;
  favoritesOnly: boolean;
  onFavoritesOnlyChange: (v: boolean) => void;
  favoritesCount: number;
  activeCount: number;
  onReset: () => void;
}

export default function CampsiteFilters({
  region,
  onRegionChange,
  siteType,
  onSiteTypeChange,
  dogOnly,
  onDogOnlyChange,
  showersOnly,
  onShowersOnlyChange,
  query,
  onQueryChange,
  sort,
  onSortChange,
  favoritesOnly,
  onFavoritesOnlyChange,
  favoritesCount,
  activeCount,
  onReset,
}: CampsiteFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search name, park, or keyword…"
            aria-label="Search campsites"
            className="pl-7"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
            <SelectTrigger size="sm" aria-label="Sort campsites" className="w-[150px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="name">Name A–Z</SelectItem>
              <SelectItem value="region">Region</SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="sm"
            variant="ghost"
            onClick={onReset}
            disabled={activeCount === 0}
            className="gap-1"
          >
            <RotateCcw className="size-3" />
            Reset
            {activeCount > 0 && (
              <span className="rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">
                {activeCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-medium text-muted-foreground">Region</p>
        <div className="flex flex-wrap gap-1.5">
          {(["All", ...REGIONS] as RegionFilter[]).map((r) => (
            <Button
              key={r}
              size="sm"
              variant={region === r ? "default" : "outline"}
              aria-pressed={region === r}
              onClick={() => onRegionChange(r)}
            >
              {r}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-medium text-muted-foreground">Site type</p>
        <div className="flex flex-wrap gap-1.5">
          <Button
            size="sm"
            variant={siteType === "All" ? "default" : "outline"}
            aria-pressed={siteType === "All"}
            onClick={() => onSiteTypeChange("All")}
          >
            All
          </Button>
          {SITE_TYPES.map((t) => (
            <Button
              key={t.value}
              size="sm"
              variant={siteType === t.value ? "default" : "outline"}
              aria-pressed={siteType === t.value}
              onClick={() => onSiteTypeChange(t.value)}
            >
              {t.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <label className="inline-flex cursor-pointer items-center gap-2 text-xs">
          <Switch checked={dogOnly} onCheckedChange={onDogOnlyChange} />
          Dog-friendly
        </label>
        <label className="inline-flex cursor-pointer items-center gap-2 text-xs">
          <Switch checked={showersOnly} onCheckedChange={onShowersOnlyChange} />
          Showers
        </label>
        <label className="inline-flex cursor-pointer items-center gap-2 text-xs">
          <Switch checked={favoritesOnly} onCheckedChange={onFavoritesOnlyChange} />
          <span className="inline-flex items-center gap-1">
            <Heart className="size-3" />
            Saved ({favoritesCount})
          </span>
        </label>
      </div>
    </div>
  );
}
