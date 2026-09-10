"use client";

import { Dog, ShowerHead } from "lucide-react";
import { cn } from "cn";

import { Badge } from "@/components/ui/badge";
import type { Campsite } from "@/lib/campsites";

interface CampsiteListProps {
  sites: Campsite[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function CampsiteList({ sites, selectedId, onSelect }: CampsiteListProps) {
  if (sites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm font-medium">No campsites match your filters</p>
        <p className="text-xs text-muted-foreground">Try widening the region or clearing the site-type filter.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {sites.map((site) => {
        const active = site.id === selectedId;
        return (
          <li key={site.id}>
            <button
              type="button"
              onClick={() => onSelect(site.id)}
              className={cn(
                "flex w-full flex-col gap-1.5 rounded-lg border bg-card p-3 text-left transition-colors hover:border-foreground/30",
                active ? "border-foreground/40 ring-1 ring-foreground/20" : "border-border"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium leading-tight">{site.name}</p>
                  <p className="text-xs text-muted-foreground">{site.park}</p>
                </div>
                <Badge variant={active ? "default" : "secondary"}>{site.region}</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-1">
                {site.siteTypes.map((t) => (
                  <Badge key={t} variant="outline">
                    {t}
                  </Badge>
                ))}
                {site.dogFriendly && (
                  <span className="inline-flex items-center gap-1 text-[0.625rem] text-muted-foreground">
                    <Dog className="size-3" /> dogs
                  </span>
                )}
                {site.showers && (
                  <span className="inline-flex items-center gap-1 text-[0.625rem] text-muted-foreground">
                    <ShowerHead className="size-3" /> showers
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{site.priceRange} · {site.driveNotes}</p>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
