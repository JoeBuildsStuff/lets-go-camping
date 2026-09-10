"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { REGIONS, SITE_TYPES, type Region, type SiteType } from "@/lib/campsites";

export type RegionFilter = Region | "All";
export type SiteTypeFilter = SiteType | "All";

interface CampsiteFiltersProps {
  region: RegionFilter;
  onRegionChange: (r: RegionFilter) => void;
  siteType: SiteTypeFilter;
  onSiteTypeChange: (t: SiteTypeFilter) => void;
  dogOnly: boolean;
  onDogOnlyChange: (v: boolean) => void;
  showersOnly: boolean;
  onShowersOnlyChange: (v: boolean) => void;
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
  onReset,
}: CampsiteFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-medium text-muted-foreground">Region</p>
        <div className="flex flex-wrap gap-1.5">
          {(["All", ...REGIONS] as RegionFilter[]).map((r) => (
            <Button
              key={r}
              size="sm"
              variant={region === r ? "default" : "outline"}
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
            onClick={() => onSiteTypeChange("All")}
          >
            All
          </Button>
          {SITE_TYPES.map((t) => (
            <Button
              key={t.value}
              size="sm"
              variant={siteType === t.value ? "default" : "outline"}
              onClick={() => onSiteTypeChange(t.value)}
            >
              {t.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <label className="inline-flex cursor-pointer items-center gap-2 text-xs">
          <Switch checked={dogOnly} onCheckedChange={onDogOnlyChange} />
          Dog-friendly
        </label>
        <label className="inline-flex cursor-pointer items-center gap-2 text-xs">
          <Switch checked={showersOnly} onCheckedChange={onShowersOnlyChange} />
          Showers
        </label>
        <Button size="sm" variant="ghost" onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
