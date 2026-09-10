"use client";

import { useEffect, useRef, useState } from "react";
import {
  CalendarCheck,
  CalendarX,
  Check,
  ChevronDown,
  Copy,
  Dog,
  ExternalLink,
  Heart,
  MapPin,
  Navigation,
  ShowerHead,
} from "lucide-react";
import { cn } from "cn";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SITE_TYPES, type Campsite } from "@/lib/campsites";

const SITE_TYPE_LABELS = Object.fromEntries(SITE_TYPES.map((t) => [t.value, t.label]));

interface CampsiteListProps {
  sites: Campsite[];
  selectedId: string | null;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onSelect: (id: string) => void;
  onReset: () => void;
}

export default function CampsiteList({
  sites,
  selectedId,
  favorites,
  onToggleFavorite,
  onSelect,
  onReset,
}: CampsiteListProps) {
  if (sites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm font-medium">No campsites match your filters</p>
        <p className="text-xs text-muted-foreground">
          Try a different search, or clear everything to see all campgrounds.
        </p>
        <Button size="sm" variant="outline" onClick={onReset} className="mt-1">
          Clear all filters
        </Button>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {sites.map((site) => (
        <CampsiteCard
          key={site.id}
          site={site}
          expanded={site.id === selectedId}
          isFavorite={favorites.has(site.id)}
          onToggleFavorite={onToggleFavorite}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}

function CampsiteCard({
  site,
  expanded,
  isFavorite,
  onToggleFavorite,
  onSelect,
}: {
  site: Campsite;
  expanded: boolean;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelect: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLLIElement>(null);

  // When a map pin is clicked, bring its card into view.
  useEffect(() => {
    if (expanded) {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [expanded]);

  const copyCoords = async () => {
    try {
      await navigator.clipboard.writeText(`${site.lat.toFixed(4)}, ${site.lng.toFixed(4)}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — no-op
    }
  };

  const detailsId = `campsite-details-${site.id}`;

  return (
    <li ref={cardRef} data-expanded={expanded ? "true" : undefined} className="scroll-mt-2">
      <div
        className={cn(
          "group flex w-full flex-col gap-1.5 rounded-lg border bg-card p-3 text-left transition-colors",
          expanded
            ? "border-foreground/40 ring-1 ring-foreground/20"
            : "border-border hover:border-foreground/30"
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <button
            type="button"
            onClick={() => onSelect(site.id)}
            aria-expanded={expanded}
            aria-controls={detailsId}
            className="min-w-0 flex-1 text-left"
          >
            <span className="flex items-center gap-1.5">
              <span className="truncate text-sm font-medium leading-tight">{site.name}</span>
              <ChevronDown
                className={cn(
                  "size-3.5 shrink-0 text-muted-foreground transition-transform",
                  expanded && "rotate-180"
                )}
              />
            </span>
            <span className="block truncate text-xs text-muted-foreground">{site.park}</span>
          </button>
          <div className="flex shrink-0 items-center gap-1">
            <Badge variant={expanded ? "default" : "secondary"}>{site.region}</Badge>
            <Button
              size="icon-xs"
              variant="ghost"
              aria-label={isFavorite ? `Unsave ${site.name}` : `Save ${site.name}`}
              aria-pressed={isFavorite}
              onClick={() => onToggleFavorite(site.id)}
            >
              <Heart className={cn("size-3.5", isFavorite && "fill-destructive text-destructive")} />
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {site.siteTypes.map((t) => (
            <Badge key={t} variant="outline">
              {SITE_TYPE_LABELS[t] ?? t}
            </Badge>
          ))}
          <span
            className={cn(
              "inline-flex items-center gap-1 text-[11px]",
              site.reservable
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-amber-600 dark:text-amber-400"
            )}
          >
            {site.reservable ? (
              <CalendarCheck className="size-3" />
            ) : (
              <CalendarX className="size-3" />
            )}
            {site.reservable ? "Reservable" : "First-come"}
          </span>
          {site.dogFriendly && (
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Dog className="size-3" /> dogs
            </span>
          )}
          {site.showers && (
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <ShowerHead className="size-3" /> showers
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {site.priceRange} · {site.driveNotes}
        </p>

        {expanded && (
          <div id={detailsId} className="flex flex-col gap-3 pt-1 text-sm">
            <Separator />
            <p className="text-xs leading-relaxed">{site.description}</p>
            <dl className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-md bg-muted p-2">
                <dt className="text-muted-foreground">Nightly rate</dt>
                <dd className="font-medium">{site.priceRange}</dd>
              </div>
              <div className="rounded-md bg-muted p-2">
                <dt className="text-muted-foreground">Booking</dt>
                <dd className="font-medium">
                  {site.reservable ? "Reservable" : "First-come"} · {site.bookingPlatform}
                </dd>
              </div>
            </dl>
            <ul className="flex flex-col gap-1.5 text-xs text-muted-foreground">
              <li className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5 shrink-0" /> {site.driveNotes}
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Dog className="size-3.5 shrink-0" />
                {site.dogFriendly ? "Dogs allowed (leashed in camp)" : "No dogs — check park rules"}
              </li>
              <li className="inline-flex items-center gap-1.5">
                <ShowerHead className="size-3.5 shrink-0" />
                {site.showers ? "Showers available" : "No showers"}
              </li>
            </ul>
            <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
              <span className="font-mono">
                {site.lat.toFixed(4)}, {site.lng.toFixed(4)}
              </span>
              <Button size="xs" variant="ghost" onClick={copyCoords} className="gap-1">
                {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                render={<a href={site.bookingUrl} target="_blank" rel="noreferrer" />}
              >
                Check availability <ExternalLink />
              </Button>
              <Button
                variant="outline"
                aria-pressed={isFavorite}
                aria-label={isFavorite ? `Unsave ${site.name}` : `Save ${site.name}`}
                onClick={() => onToggleFavorite(site.id)}
              >
                <Heart className={cn(isFavorite && "fill-destructive text-destructive")} />
              </Button>
              <Button
                variant="outline"
                aria-label={`Get directions to ${site.name}`}
                render={
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${site.lat},${site.lng}`}
                    target="_blank"
                    rel="noreferrer"
                  />
                }
              >
                <Navigation />
              </Button>
            </div>
            <p className="text-center text-[11px] text-muted-foreground">
              Opens {site.bookingPlatform} in a new tab
            </p>
          </div>
        )}
      </div>
    </li>
  );
}
